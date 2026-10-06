# UPT-PRE-ASSISTANT — Implementation Report

> Workbook: `ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md`
> Binding ruling: `response-9-30.md#R12` (`MIGRATION_ONLY` → `PRE_ASSISTANT_PRODUCT_CLOSEOUT`)
> Implementation repo: `zhiheng-zhang-Mera/utopia`
> Implementation Host: **Alien** (`MERA-ALIANWARE`)
> Branch: `product/upt-pre-assistant-closeout`, created from `d0dea7bcb66cf57edee73c67ddfb9526337dfb4e`

This is a **product integration** report, not a Mission migration report. No donor was
re-consulted, no new Room was created, no BOSS/HNS connector exists, and there is no LLM in
any routing path.

## 0. T0 — migration closeout and phase freeze

`T0.1` re-proved the baseline rather than restating it:

| check | result |
| --- | --- |
| MB-001..MB-012 `migration_complete` and `verification_complete` | all true (12/12) |
| implementation Mission branches ahead of Utopia `main` | 0 |
| the three R11 provenance branches are ancestors of `main` | true (`6e9781c`, `f22273c`, `e0d9470`) |
| `merged_main_sha` for MB-010..MB-012 | still `null` |
| hosted CI on the baseline `main` | run `36678805229` PASS (gateway-web + android) |

`T0.2` created the freeze record in paired Utopia docs:
`docs/en/MIGRATION_PHASE_CLOSEOUT.md` + `docs/zh-CN/MIGRATION_PHASE_CLOSEOUT.md`, with
identical `FACT:`/`STATUS:`/`SHA:`/`RUNS:` lines (enforced by `scripts/check-bilingual.mjs`).
It states plainly that MB-010..012 are negative-result provenance, not transferred capability.

T0 exit gate: `MIGRATION_QUEUE_CLOSED = true`, `REOPENED_MISSIONS = 0`,
`UNMERGED_IMPLEMENTATION_MISSION_BRANCHES = 0`, `BASELINE_TRUTH_RECORDED = true`.
Commit `506dce3`.

## 1. T1 — Room Pack attached to the normal product

### T1.1 host lifecycle

`scripts/start-city.ps1` now starts the Gateway, the reference-node Agent **and** the Room Hub,
waits for each one's own health endpoint, and records `roomsPid` / `roomsUrl` / `roomsState` /
`roomsReason` in `.runtime/processes.json`. A hub that fails to start or answer is recorded
`UNAVAILABLE` with a reason and reported loudly; it is never silently treated as ready, and the
city still runs while telling the truth about Rooms.

`scripts/stop-city.ps1` stops all three, verifying every process against its own command line
first, and sweeps unrecorded Agents and Hubs. `scripts/host-processes.ps1` holds the matching
rule: the script path must be a **standalone argument**, and the current process and its
ancestors are never candidates.

That strictness is not defensive padding. Two earlier sweeps written with
`CommandLine -like '*rooms/hub/server.mjs*'` matched the command text of the shell running them
and killed it — the harness reported a subprocess-runner crash, and an orphaned Agent survived
because the same loose rule had killed the *launcher* instead of the target. Both scripts now
share the one tested helper.

Starting twice is a restart, not a second copy: previously recorded processes are stopped,
unrecorded Agents and Hubs are swept, and a Gateway that cannot bind is refused rather than
leaving the launcher silently attached to the old one.

Measured on this host (`-BindAddress 172.31.3.110`, LAN):

```text
start  -> gateway pid, agent pid, rooms READY (pid, http://127.0.0.1:4320/, loopback only)
start again -> "Stopped the previous reference node Agent", "Stopped the previous Gateway",
               "Stopping stale Room Hub pid ..."
after two starts -> gateway=1 agent=1 hub=1
listeners        -> 127.0.0.1:4320 (hub) and 172.31.3.110:4310 (gateway)
```

So the hub is loopback-only while the gateway is on the LAN: the isolation is preserved, not
weakened for Android's convenience.

### T1.2 Web integration

`apps/web/index.html` navigation is now `Home`, `Tools / Rooms`, `Devices`, `Activity`, and an
`Advanced` group holding `Services`, `Tasks`, `Actions`, `Pairing`, `Settings`. Nothing that
existed before became unreachable. Home gained a Rooms section that lists all ten accepted Rooms
from `GET /api/v0/rooms`, with the zh label, number, summary and persistence. `Tools / Rooms`
opens a room through the existing Room Pack UI (iframe on the loopback `hubUrl` returned by the
gateway); when the hub is unavailable the page says so with the gateway's own `reason` instead of
showing an empty success. No Room data model was rewritten.

Web i18n keys: 186 in `en`, 186 in `zh-CN`, none missing, none empty (checked independently — see
the verification report).

### T1.3 Android boundary

Android gained a Rooms panel that reads `GET /api/v0/rooms` through the existing authenticated
`CityClient` path and shows availability, `reason`, `checkedAt` and the ten-Room catalog. The
loopback `hubUrl` is deliberately **not modelled** in the Android DTO, so the client cannot use it
and no Room Hub port is opened from the device. `available:false` renders as UNAVAILABLE, not as an
error and not as empty success.

Reading of the workbook: the explicit `Home / Tools-Rooms / Devices / Activity / Advanced{...}`
navigation requirement is written under **T1.2 Web integration**, so it was applied to Web. Android
keeps its existing bottom navigation and gained Ask / Rooms / Action entries; Services and Tasks
remain reachable there.

## 2. T2 — canonical Action facade

`services/dev-gateway/actions.mjs` defines one Action over the three existing backends:

```text
route        ROOM | CAPABILITY | CITY_TASK          (BOSS and HNS do not exist in this phase)
status       QUEUED RUNNING WAITING_CONFIRMATION SUCCEEDED FAILED REFUSED CANCELLED UNAVAILABLE
backendRef   the real room id / capabilityId+invocationId / taskId
resultRef    the real room record, invocation digest, or City task id
provenance   source, host, roomId/capabilityId/taskId/invocationId, and a status history
```

Adapter rules that are enforced in code, not merely documented:

- a ROOM action calls the room's own HTTP API over loopback and stores the room's own record id —
  a checklist item never becomes a City task;
- a CAPABILITY action calls the real bridge and keeps the real `invocationId` and result digest;
- a CITY_TASK action creates a real control task and re-reads its state on every read, so a
  `QUEUED` action becomes `RUNNING`/`SUCCEEDED` because the *task* did;
- `REFUSED` (policy), `UNAVAILABLE` (target cannot run) and `FAILED` (something broke) are kept
  distinct, and `SUCCEEDED` is only ever written from a real backend success response;
- an `idempotencyKey` replays the first Action instead of executing again.

`services/dev-gateway/rooms.mjs` is the only path to the hub. `probe()` resolves for both
available and unavailable states and never throws for a down hub, so the product can render
UNAVAILABLE rather than a failure page.

`services/dev-gateway/static.mjs` replaced the gateway's hardcoded page map with a
containment-checked server rooted at `apps/web`, so a new product page no longer requires a
transport change. Traversal is refused.

## 3. T3 — deterministic Ask / Do

`services/dev-gateway/intents.mjs` maps literal patterns to literal targets. Nine rules cover the
routes the workbook names — document intake, knowledge query, checklist, bookmark, hash, evidence
review, theme generation, a supported City task, and a local note. The behaviour that matters:

- one high-confidence match runs; the response carries `router: DETERMINISTIC_RULES`,
  `deterministic: true`, `llm: false`, and no client may invent otherwise;
- `search knowledge for X` matches **two** genuine owners (the local Knowledge Room and the City
  Knowledge Query capability), so the router returns `AMBIGUOUS` with both and executes nothing;
- a `sideEffect` target (a City task, a theme build) returns `AWAITING_CONFIRMATION` and executes
  nothing until the client re-sends with `confirm: true`;
- no match returns `UNMATCHED` plus the full manual target list (16 targets across the three
  routes) and executes nothing;
- a client `selection` chooses a **route**; the gateway re-runs its own rules and uses the input
  *it* extracted, so a selection cannot smuggle in an input the rules did not produce.

## 4. Scope audit (self-reported; the verifier re-checks this independently)

```text
assistant / persona layer        absent
LLM router                       absent - no model call in any routing path
BOSS / HNS connector             absent - the route vocabulary has no such value, and
                                 POST /api/v0/actions refuses BOSS/HNS/SYSTEM/SHELL with 400
new Room                         absent - the catalog is still the ten accepted rooms
arbitrary shell                  absent - no shell execution was added
new domain integration           absent
```

## 5. Defects found by driving the product, not by the unit suite

The Web client's own author reported it as complete with passing tests. A real browser said
otherwise, and this is worth recording because it is the exact failure mode the workbook's T4
exists to catch.

The first browser run found that **no terminal page could render at all**: `renderTerminal()`
returned `true` while the shell stored that value as its terminal handle, so every later
`terminal.isPage(...)` was a silent no-op. Fixing that exposed three more:

1. navigating from one terminal page to another never switched page, because the controller's
   `render()` ignored the page it was called with and kept the page it was first mounted on;
2. the Ask / Do page re-rendered the shell bar's `#ask-text` / `#ask-submit`, so the document
   contained duplicate ids and every id-based lookup was ambiguous;
3. `terminal.js` handled the shell's submit id *as well as* the form's submit event, so one
   click posted the request twice — which, for a non-idempotent route such as adding a checklist
   item, would have created the item twice.

All four are fixed, and `tests/web-terminal-shell.test.mjs` now guards them statically: it
asserts the controller is returned, that page switching works, and that no id in the shell
document is duplicated. A real-browser acceptance run then reached 11/11.

The root suite was green before and after, which is the point: the unit tests were not what
found this, and passing them was not evidence that the product worked.

## 6. Local evidence

- `tests/pre-assistant-closeout.test.mjs` — 8 cases driving the real gateway against a real Room
  Hub on loopback; all pass.
- `live-smoke.mjs` + `live-smoke.json` — 15 checks against the running Host (implementation
  evidence, not independent acceptance).
- `web-i18n-parity.mjs` — 186/186 keys, synchronized.

## 7. Limitations recorded honestly

- The Room Hub keeps its existing runtime directory (`apps/rooms/.runtime-rooms`). Repointing it
  under `.runtime` would have made existing local room data appear empty, so it was not done.
- `hash.hash-file` routes a local text file through the Hash Room, which hashes text. A file that
  looks binary is refused with `NOT_A_TEXT_FILE` rather than reported as a byte hash.
- Android sends no `idempotencyKey`; Ask retries therefore rely on the gateway. Recorded as a
  follow-up, not as a defect.
- Android does not construct Actions directly (`POST /api/v0/actions` is unused there); T2 was
  scoped to listing and reading, T3 to Ask. The on-device effect is the same.

## 8. T4 round 1 — rejected, repaired, re-verified

The independent verification host ran at `adce593` and returned **REJECT for merge**. It was
right to. The blocking finding is worth stating in full because it is the clearest illustration of
this phase's whole point:

> **F.1 — the Android Action list was permanently unreadable on the real device.** The gateway
> returned HTTP 200 with a valid `{apiVersion, schemaVersion, actions:[…]}` body, captured from
> the app's own traffic through a logging relay. The client unwrapped the envelope with an
> *object* reader and then looked for a second, nested `actions` member that cannot exist. The
> branch's own Android unit tests passed because they called `parseActions(rows)` directly and
> never exercised the envelope read — a green suite sitting next to a dead screen, which is
> exactly the failure the workbook's T4 exists to catch.

Four further findings were material, not cosmetic:

| # | finding | repair |
| --- | --- | --- |
| F.1 | Android Action list and manual target list unreadable (T2 parity gate unmet) | `parseActionList` / `parseTargetList` read the array from the flat envelope; panels use them; unit tests now exercise the envelope read and assert the object reader is the wrong reader for array members |
| F.2 | `/api/v0/health` was the constant `healthy`, so a supervisor could not see a dead Room Hub | health now reports `status: healthy\|degraded` with per-component state and reason; verified live with the hub killed |
| F.3 | neither shipped client sent an idempotency key, so a retry executed twice | Web and Android mint one key per user action and reuse it on retry, minting a new key when the action changes |
| F.4 | a reused key with a different request silently returned the original Action | the key is now bound to a request fingerprint; a mismatch is refused with `IDEMPOTENCY_KEY_REUSED` and nothing executes |
| F.5 | `provenance.cityTaskState` stayed `QUEUED` after the task completed | provenance follows the real task state |

Not repaired, recorded instead:

- **F.6 (design boundary, not a defect).** The Web client is handed the loopback `hubUrl`, because
  the browser runs on the Utopia host and has to reach the hub; Android provably is not. A browser
  on another LAN machine would be handed *its own* loopback address, which will not resolve to the
  hub — the room page says the hub is loopback-only rather than pretending otherwise. Closing this
  properly means an authenticated hub proxy, which is a different piece of work.
- The City-Task-with-no-eligible-node `UNAVAILABLE` path was not observed on this host because a
  node was always eligible. `UNAVAILABLE` was observed truthfully on the Room path, and is covered
  by `tests/pre-assistant-closeout.test.mjs`.

Round-1 evidence is preserved: `T4-FINDINGS.md`, the verifier's own probes under
`.runtime/evidence/mission-book/UPT-PRE-ASSISTANT/verifier/`, and its transcripts.

**Round 2 returned ACCEPT for merge at `85ecde4`**, with four items recorded as non-blocking
backlog rather than fixed. They are listed in full in
[`VERIFICATION_REPORT.md`](./VERIFICATION_REPORT.md) §3 and are not claimed here as working:
Android Action drill-down does not open on the device; `-NoRooms` reports a misleading degraded
reason; the key-reuse refusal is HTTP 400 rather than the 409 this report originally stated (the
claim has been corrected here rather than left standing); and the Web client is still handed the
loopback `hubUrl`.

**Host separation.** The workbook prefers two real hosts. Only this machine was available, so the
Owner recorded an explicit waiver (`response-9-30.md#R13`): acceptance on this host is accepted
for this phase, on condition that the verifier is genuinely independent of the implementation, that
the single-host limitation is stated plainly rather than dressed up, that a REJECT must be repaired
and re-verified at the new SHA, and that branch and merged-main CI are still green. This report
states plainly that the round-1 acceptance ran on the same physical host as the implementation;
only the Android device is separate hardware.

STATUS: IMPLEMENTATION_REPORT

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/IMPLEMENTATION_REPORT.md)
