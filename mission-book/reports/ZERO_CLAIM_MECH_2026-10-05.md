# Mech zero-claim classification — 2026-10-05

> Recorded per `CONSTRUCTION_RULES.md` §5. A zero-claim result is a **classification**, not an announcement that the
> pool is finished. This file exists so the next Mech round reads the reason instead of re-deriving it, and so a
> missing wake-up event is visible as a missing event rather than as "no work exists".

```text
pool_incomplete                 = true
claimable_now                   = 0   (for the Mech host)
potentially_claimable_later     = true
classification                  = TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
structural_ineligibility_reason = null
global_external_blocker         = null
terminal_reason                 = null
```

## 1. What was measured, and against which truth

Board re-read at `origin/main` immediately before classifying (not from memory, and not from the README table):

| Workbook | status | development_host | Mech-claimable now |
|---|---|---|---|
| CEX-701 | IN_PROGRESS | Alien-codex | no — another host's claim |
| CEX-702 | IN_PROGRESS | Alien-codex | no |
| CEX-703 | IN_PROGRESS | Alien-codex | no |
| CEX-704 | IN_PROGRESS | Alien-codex | no |
| CEX-705 | IN_PROGRESS | Alien-codex | no |
| CEX-790 | WAITING_DEPENDENCIES | — | no — needs CEX-701..705 accepted |
| JOIN-590 | READY | — | **not eligible from this session** (see §2) |
| MON-901 | IN_PROGRESS | Alien-codex | no |
| MON-902 / MON-903 / MON-990 | WAITING_DEPENDENCIES | — | no |
| REX-801 | READY | Mech | **mine, development complete** — no further claim needed |
| REX-802 | IN_PROGRESS | Alien-codex | no |
| REX-803..807 / REX-890 | WAITING_DEPENDENCIES | — | no |
| SHOW-401 | IN_PROGRESS | Alien | no (non-product media task, preferred host Alien) |
| WBC-601 / WBC-602 | COMPLETE | Mech | closed by opposite-host review |
| WBC-603 | IN_PROGRESS | Alien-codex | no |
| WBC-604 | WAITING_DEPENDENCIES | — | no |

`XX-000` is the workbook template, not a task, and is excluded.

## 2. Why JOIN-590 is not eligible from this session

JOIN-590 is the only other `READY`, unclaimed workbook, so it was examined rather than skipped. Its minimum real
topology is `Alien Windows + Mech Windows + Android physical control surface`, and every completion gate needs two
hosts acting together:

```text
gate 1  real Alien↔Mech physical onboarding run        needs the other host
gate 2  restart tokenless reconnect on the member      needs a member enrolled by that run
gate 3  revoke refusal convergence                     needs the revoked installation to exist
gate 7  opposite-host Formal Review                    needs the other host by rule
gate 9  merged-main post-closeout verification         needs the above to have happened
```

This session runs on Mech only, cannot drive the Alien host, and has no Android device attached. Starting it would
consume a claim on a task whose first gate is unreachable from here — which is the "claim without eligibility"
failure this rule set exists to prevent — so it is left unclaimed for a two-host window. Recorded as an
**eligibility** fact, not as a product problem.

## 3. Wake conditions (event-first; no busy-poll)

Mech becomes claimable again when any of the following happens:

1. the Alien host closes any of CEX-701..705, REX-802, WBC-603 or MON-901, freeing a slot in a programme where
   Mech's remaining work can start;
2. WBC-601 / WBC-602 land in `main` **and** a task becomes ready whose baseline requires them (`WBC-604`,
   `CEX-790`, `REX-803` are dependency-locked on precisely this kind of acceptance);
3. an Owner activates a new workbook (`MON-902/903`, `REX-804..807`, `REX-890`, `WBC-604`) from
   `WAITING_DEPENDENCIES` to `READY`;
4. a joined two-host window opens with the Android control surface available, which is the only state in which
   JOIN-590 becomes claimable;
5. a review finding is raised against a Mech-authored head (`REX-801` now; WBC-601/602 are already closed), which
   returns work to this host as a repair rather than as a new claim.

## 3A. Re-scan at the "continue claiming" request (measured, not assumed)

The whole board was re-read after pulling `origin/main`, and the two candidate paths a "keep claiming" instruction
could plausibly mean were each tested rather than dismissed:

**(a) JOIN-590 — the only other `READY`, unclaimed workbook.** Its blocking resource was measured on this host:

```text
adb devices -l                                  -> "List of devices attached" and nothing else (no physical device)
emulator -list-avds                             -> utopia36 exists (an emulator, NOT a physical Android surface)
resident City on this host                      -> http://127.0.0.1:4389  state ONLINE, endpoint
                                                   http://172.31.12.151:4391 (this host's own LAN address)
```

JOIN-590's first completion gate is a real `Alien + Mech + Android` run whose approval step happens on an
**already trusted physical control surface**. An emulator is not that surface, and the workbook's own rule is that
`deferred != passed`. Producing approval evidence from an emulator would be a fabricated acceptance, which is worse
than a zero-claim, so this path stays closed until a physical Android device is attached and the two-host window is
agreed. This is the same conclusion the other host reached independently in
`reports/MON-901/ELIGIBILITY_SCAN_20261005T103433_Alien-codex.md` ("No callable Mech physical session/address was
provided"), with one addition measured here: the Mech side **is** live and has no device attached, so the missing
piece is the physical Android surface, not this host's availability.

**(b) Merging the eleven reviewed-but-unmerged PRs (14–25).** They are all `MERGEABLE`, and a merge is not a
review, so this was examined as a genuinely executable option rather than a claim. It was not taken, because no
workbook currently authorises it: every relevant workbook carries `merge_authority: false` — including
`WBC-601`, `WBC-602`, `REX-801` and `WBC-603` — and `workbench-compatibility-migration/README.md` §8 states that no
final integration / merge workbook exists yet and must not be created until all four WBC tasks are complete with
opposite-host review, green exact-head CI and no unresolved regression. Executing merges on this control plane
without either an authored integration workbook or an explicit Owner ruling would be taking merge authority that
was never granted. Recorded as an **open, unclaimed integration need** rather than a Mech task.

```text
claimable_now (after re-scan) = 0
new exclusion reason (measured) = JOIN-590 additionally blocked on absent physical Android control surface
control-plane gap observed      = 11 reviewed+mergeable PRs (14–25) with no merge authority granted anywhere
```


`rescan_after` = 20 minutes as the low-frequency liveness fallback only, per §6. The primary mechanism is the
event, not the clock.

## 4. What Mech did instead of idling

Per §4 and §9 this was **not** filled with new features. While REX-801's hosted CI ran, the same session completed
the control-plane records for REX-801 and re-read the whole board twice (the second read caught the other host's
progress from `READY` to `COMPLETE` on WBC-601/602), so the classification above is a measurement rather than a
recollection.
