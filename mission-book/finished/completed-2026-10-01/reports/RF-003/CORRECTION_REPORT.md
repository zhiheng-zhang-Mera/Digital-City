# RF-003 Correction Report — Same-Wi-Fi / LAN Discovery + Local Direct Path

```text
MISSION              = RF-003 (Remote Fabric programme)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-003-local-discovery-lan-direct.md
CLAIM_COMMIT         = 02898b7 (Digital-City main, claim of RF-003 Correction by Alien)
CLAIMED_AT           = 2026-09-30T14:40:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = f0d8f59796a3d152a61f104682d3d86c2ca023c2
DEVELOPMENT_CI       = 36724660725-success
CORRECTION_BRANCH    = remote/RF-003-local-discovery-lan-direct
CORRECTION_HEAD_SHA  = 4a51996e0caf771676508e569a3c328ad4c99b8a
BRANCH_CI            = 36728802526 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = RF-003 16 pass, root 117 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at f0d8f59, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews, as for every Correction in this programme, but the isolation was **mechanical** rather
than a discipline the reviewing host had to keep.

The revision under review was exported to an immutable path and byte-verified **before any review
began**, and the reviewer was told to import only from that export:

```text
D:\A-Utopia\.runtime\evidence\mission-book\RF-003\frozen-f0d8f59\contracts\remote-local-discovery-v1\
  discovery.mjs  exported match=True
  index.mjs      exported match=True
```

That let this host repair in parallel with the review — the third time this pattern has been used,
and it remains the fix for the EM-002 failure mode where the reviewer read a worktree this host was
editing.

Two independent probes were run by this host against the frozen export (`alien-probe.mjs`,
`alien-probe2.mjs`, `alien-probe3.mjs`), and the reviewer ran p1–p9 in its own scratch directory
(`D:\A-Utopia\.runtime\scratch\rf003-adversarial\`). Findings were merged by defect, not by reporter:
where the two reviews had found the same mechanism the report names it once and says who found it.

Repair was then verified by replaying **the original reproductions** against the repaired module
(`alien-verify-repair.mjs`, 27 checks, all PASS) rather than only by the new regression tests — so
the repair is checked against the defect, not against my own restatement of it.

## 2. Confirmed defects, seven, all repaired

Seven distinct defects were confirmed. Six were found by the reviewer (D1–D6); this host found D1 and
D6 independently first (logged as RF3-1/RF3-3) and found **RF3-2, which the reviewer did not report**.
Every one was invisible to the author's own suite, which passed unchanged before and after.

| id | class | mechanism | repair |
| --- | --- | --- | --- |
| RF3-2 | false merge (high) | unidentified sightings keyed by display name + addresses | key is a digest of the whole observation |
| D1 / RF3-1 | one-sided time bound | `parse(last_seen) + ttl <= now` | two-sided `isStaleSighting` + `MAX_CLOCK_SKEW_MS` |
| D2 | prototype-chain read (high) | own-key allowlist, values read via the chain | bare-object requirement + own-property reads |
| D6 / RF3-3 | stale state used as current | snapshot verdict re-emitted; no consumer gated | `freshnessOf` + refusal at three boundaries |
| D5 | non-canonical evidence | `' 1.2.3.4 '` and `'1.2.3.4'` both survive | canonical spelling required |
| D3 | one-sided cap | negative `limit` is a slice offset | non-negative safe integer required |
| D4 | check that cannot fail | `identities_preserved` certified by construction | identity bound to `candidate_ref` |

### RF3-2 (high) — two different unidentified devices collapsed into one candidate

*Found by this host; not reported by the reviewer.*

**Symptom.** `normalizeCandidates` keyed an unidentified advertisement as
`` `${display_name}|${addressKey(advertisement)}` ``. With no addresses the key reduced to the
display name alone, so any advertiser could claim another device's candidate by repeating its name,
and two genuinely different devices sharing a name and no address became one candidate.

**Reproduction** (`alien-collapse-probe.mjs`, frozen revision):

```text
two unidentified devices, same display_name, no addresses   -> candidates=1  duplicates=1
same, but DIFFERENT MAC evidence                            -> still 1 candidate
same, but android vs ios platform                           -> still 1 candidate
two unidentified devices, different display_name            -> candidates=2   (control)
```

**Judgement basis.** This breaks two normative texts at once: the module header
("never treats an address, hostname, display name or MAC as identity"), the workbook §2 D2
("Logical identity is cryptographic, not network-derived … IP address, hostname, display name and
MAC address are metadata, never authorization identity"), and the workbook's §4 acceptance line
("stale or duplicate advertisements do not create duplicate logical devices" is the *other* half;
the half this breaks is that two devices must not become one).

**Repair.** The unidentified key is now a content digest over the whole observation — source,
canonical addresses, interfaces, MAC evidence, platform, installation ref, display name, advertised
at, ttl. Two sightings collapse only when the entire observation matches, which means "the same
advertisement was heard twice", not "two things looked alike".

### D1 / RF3-1 (medium/high) — a future-dated or unparseable sighting was never stale

**Symptom.** `stale` and `pruneStale` both computed `Date.parse(last_seen_at) + ttl_ms <= nowMs`.
Both halves are false for malicious input — a date in the future satisfies the sum, and `NaN`
comparisons are all false — so "not stale" was the *failure mode of the expression itself*, not a
verdict. A sighting dated ten years ahead with `ttl_ms: 1` reported `stale: false` and survived
`pruneStale`. `isIsoInstant` was a shape-only regex, so `2026-13-45T99:99:99Z` also validated.

**Reproduction:** `alien-probe.mjs` and `alien-probe3.mjs` (frozen), independently reproduced by the
reviewer's `p1-time-bound.mjs`.

**Repair.** One two-sided predicate, used by both call sites instead of the expression written twice:

```js
age >= MAX_CLOCK_SKEW_MS in the future  -> stale   (replay / hostile / clock skew)
age < 0 within the skew window          -> fresh   (an ordinary NTP-ahead peer)
age >= ttl                              -> stale
unparseable                             -> stale
```

`isIsoInstant` must now round-trip to the calendar instant it claims, so an impossible date is
refused at validation rather than becoming a candidate at all.

### D2 (high) — the allowlist validated key *names* while values were read through the prototype chain

**Symptom.** `validateAdvertisement` scanned `Object.keys` (own enumerable names only) but then read
`advertisement.device_id`, `.addresses`, `.advertised_at` … through the prototype chain. An object
whose only own key was `platform`, with a prototype carrying the rest, validated `ok = true` and
became an identified `device:dev-…` candidate; re-pointing the prototype afterwards changed what the
next call consumed. The same hole existed for interface records.

**Reproduction** (`alien-probe3.mjs`, reproduced independently before repair):

```text
Object.keys(smuggled)        = ["platform"]
validateAdvertisement().ok   = true
-> candidate_ref             = device:dev-1111…  identified = true  addresses = ["10.9.9.9"]
-> after re-pointing prototype, next call consumes = dev-2222…
validateInterface(proto iface).length = 0
```

**Repair, two layers.** A record must be a **bare object** (prototype `Object.prototype` or `null`),
and every consumed field is read as an **own** property. The first closes inheritance, the second
closes a polluted `Object.prototype`. Null-prototype records stay accepted (they have no inherited
surface), so the rule costs nothing legitimate.

### D6 / RF3-3 (medium) — a freshness snapshot was re-emitted as a current verdict, and nothing gated on it

**Symptom.** `normalizeCandidates` stamped `stale` at its own `nowMs` and every later consumer
re-published that verdict: a candidate judged fresh at T0 still said `false` an hour later while
`pruneStale` called it stale. Worse, no boundary that acts on an address consulted freshness at all:
`resolveToPairing` resolved a year-expired sighting, `upgradeToDirectPath` opened an authenticated
encrypted `LOCAL_DIRECT` path to a candidate the module itself had labelled `stale: true` (accepting
`nowMs` and using it only to stamp `established_at`), and `onNetworkChange` announced a long-dead peer
as `reachable: true` with `rediscovery_required: false` because subnet membership was the only test.

**Reproduction** (`alien-probe2.mjs`, reproduced independently before repair):

```text
upgradeToDirectPath(stale candidate, nowMs) : OK -> {"path":"LOCAL_DIRECT","authenticated":true}
onNetworkChange(ancient, same subnet)       : reachable=true rediscovery_required=false
resolveToPairing(stale candidate)           : resolved=true
```

**Repair.** `freshnessOf(candidate, nowMs)` is exported and re-derives the verdict; `resolveToPairing`
returns `STALE_ADVERTISEMENT` instead of an address, `upgradeToDirectPath` throws
`STALE_ADVERTISEMENT`, and `onNetworkChange` recomputes staleness against this call's `nowMs` and
treats an aged sighting as unreachable. `freshnessOf` reports `checked: false` when there is no time
source *and* no snapshot verdict, so "not known to be stale" is never dressed up as "verified fresh".

### D5 (medium) — one address had several spellings, and address evidence had no shape rule

**Symptom.** Addresses were lower-cased but never trimmed or canonicalised, and the interface merge
key compared exactly — so `[" 192.168.1.20 "]` and `["192.168.1.20"]` survived as two addresses
(`address_count` 2 for one address), and the dedupe/merge key could be defeated by padding.

**Repair.** Addresses must be canonically spelled (no whitespace, lower-case) and interface text may
not be padded; the canonical form is applied once, at the single place addresses enter the module.

**Deliberately not repaired (see §4):** imposing an IP-literal / unicast rule.

### D3 (low/medium) — the per-round advertisement cap was one-sided

**Symptom.** `scripted.slice(0, Math.min(limit, MAX_ADVERTISEMENTS_PER_ROUND))` clamps only from
above, and a negative `limit` is a valid slice **offset**: with 300 scripted advertisements,
`discover({ limit: -1 })` emitted **299** and `{ limit: -5 })` emitted **295** in one round, against
the adapter's own declared `max_advertisements_per_round: 256` and `DISCOVERY_ADAPTER_PORT.bounded`.

**Repair.** `limit` must be a non-negative safe integer; the declared cap still clamps a larger
request. Refusing rather than silently clamping, because a negative limit is a caller defect and
silently substituting the cap would hide it — the same reasoning as the one-sided freshness bound,
where the old expression's silent success *was* the defect.

### D4 (low) — the identity-preservation invariant had no computed witness

**Symptom.** `identities_preserved` compared a set against a superset built from the same retained
array, and `logical_identity_changed` was a hardcoded `false`. This is the only witness for the §2 D8
acceptance line ("a local network change triggers rediscovery without changing logical identity"), and
an unreachable, address-stripped, never-re-sighted candidate still returned `identities_preserved: true`.

**Repair.** Identity is bound to the `candidate_ref` it was observed under. A ref that changes hands
between device ids is an identity conflict, and a retained identity that no candidate still carries is
a loss; both are reported (`identity_conflicts`, `lost_identities`) and both feed
`logical_identity_changed`.

## 3. Reviewer claims reconciled, not accepted verbatim

- **D4 "true for every input"** is an overstatement. With two device ids sharing one `candidate_ref`
  it does return `false`. The defect is real — the check cannot fail for *well-formed* input, which is
  exactly the input the acceptance line is about — and it is recorded that way, but the stronger
  phrasing is not repeated.
- **D5's "no address shape rule"** is real and is repaired only in its canonicalisation half. See §4.
- **D2's reachability caveat** is accepted: the reviewer reproduced it only at the module boundary.
  `structuredClone` in the adapter double produces a plain object, so a prototype-tier payload cannot
  arrive *through the double*; the hole is real for any direct caller of the exported
  `normalizeCandidates`/`validateAdvertisement`, which is a public surface. Repairing it is correct
  either way, and the residual reachability question is recorded rather than closed.
- The reviewer **falsified its own suspicion** that the lexicographic latest-sighting comparison is
  unsound (20 000 seeded mixed-spelling pairs, 0 chronological inversions). That negative result is
  recorded here so the next host does not re-spend the effort.

## 4. Deliberate non-fixes, with the reasoning

1. **No IP-literal or unicast address rule.** The reviewer asked for malformed and non-unicast
   addresses to be refused. I canonicalised addresses but did **not** impose a shape rule, because
   the workbook explicitly lists *hostname* alongside IP address as peer metadata ("IP address,
   hostname, display name and MAC address are metadata"), `planDirectScan.targets` and
   `interface.address`/`.subnet` are all declared as free text, and `LOCAL_DISCOVERY_CODES` has no
   address-shaped code. Deciding which address forms are usable is a schema decision that would also
   bind RF-002/RF-006/RF-009, so it is raised to the Owner rather than invented here. The concrete
   consequence is recorded, not hidden: `upgradeToDirectPath` still accepts a candidate whose address
   list contains a hostname or a non-unicast literal, provided the entries are canonically spelled.
2. **No new error code for a future-dated sighting.** The reviewer proposed `FUTURE_ADVERTISEMENT`.
   Not added: with the two-sided bound, a future-dated sighting beyond the skew window is already
   stale, which means validation-adjacent callers, `pruneStale`, `resolveToPairing`,
   `upgradeToDirectPath` and `onNetworkChange` all refuse or drop it. A new code would add vocabulary
   without adding a single closed path.
3. **Trust-record validity is not re-checked here.** `assertMayInvoke` and `upgradeToDirectPath`
   require `state === 'TRUSTED'` and a matching `device_id`, but do not consult an expiry, because the
   trust record shape belongs to RF-002 and the record used here is this contract's own fixture with
   no validity field. Per the workbook, missing sibling RF implementations are represented by test
   doubles, so expiry at the invocation boundary is RF-002's obligation. Recorded as a cross-contract
   seam for the Owner, not repaired speculatively.
4. **`mac_evidence` is still inert.** The reviewer confirmed no code path reads it, so MAC
   randomisation, multi-NIC and unavailability could not be attacked through it. It is now part of the
   unidentified observation digest only (as an observed distinguisher, never as identity) and remains
   non-authoritative. Extending the surface is Development work, not Correction work.

## 5. Positive findings (what the author got right, verified rather than assumed)

- **Prototype pollution is genuinely absent.** Allowlists use `Object.keys` + `Array.includes`, so an
  own `__proto__`/`constructor`/`toString` key is refused at both advertisement and interface level,
  and `({}).polluted` stayed `undefined`. This is the first of nine contracts reviewed where this
  class did not reproduce.
- Wired + Wi-Fi sightings of one device merge into one candidate with two sightings; two distinct
  identified devices with no addresses stay two; two advertisements claiming the same `device_id`
  merge to one with one duplicate.
- An unidentified sighting is preview-only: `resolveToPairing` and `assertMayInvoke` both refuse it
  with `DEVICE_ID_REQUIRED`.
- `assertMayInvoke` refused null, `QUARANTINED` and wrong-device trust, and an Array carrying
  trust-shaped properties. Spoofed `display_name` and `mac_evidence.authority` grant nothing.
- All fingerprint mismatches (case, whitespace, wrong, missing) are refused; `planDirectScan` refused
  both 65 and 0; returned candidates are `structuredClone` copies, so post-hoc mutation of an input
  advertisement does not leak; returned objects are frozen; refused calls leave no state, so
  mutation-before-refusal does not occur here.
- The 256 cap is per-round by design (five rounds emitted 1280, documented as intended).

## 6. Unstated decisions (problem / choice / rationale)

1. **Unidentified merge key.**
   *Problem:* an unidentified sighting has no cryptographic identity, so what may two sightings be
   merged on? *Choice:* only a full-observation content digest; a repeat of the identical
   advertisement collapses, everything else stays separate. *Rationale:* every weaker key (name,
   name+address, any single field) lets either an attacker or mere coincidence merge two devices,
   and the workbook forbids metadata as identity. A per-sighting counter was rejected because it
   would never collapse a genuine repeat and would make refs order-dependent.
2. **Clock-skew tolerance.** *Problem:* how much future dating is a peer's clock rather than a
   replay? *Choice:* `MAX_CLOCK_SKEW_MS = 5 * 60 * 1000`, exported. *Rationale:* the workbook states
   no value; the constant only has to separate ordinary NTP skew from a replayed or hostile
   sighting, and 5 minutes is above any step-corrected skew and far below any useful replay window.
   The reviewer proposed 2 minutes; there is no normative basis for either, so the value is exported
   so it can be ruled on rather than buried.
3. **`isIsoInstant` round-trip by prefix.** *Problem:* the author's suite uses both `…T12:00:00Z` and
   `…T12:00:00.000Z`. *Choice:* compare the first 19 characters of the round-tripped `toISOString()`
   with the input's first 19. *Rationale:* exact equality would refuse one of the two spellings the
   contract already accepts, while the prefix comparison still rejects impossible dates (which
   normalise to a different day) and `NaN`.
4. **Refusing a negative `limit` instead of clamping.** *Rationale:* clamping hides a caller defect;
   the defect here was precisely a silent wrong answer, so the repair is a loud one.
5. **Fail-closed `checked: false` in `freshnessOf`.** *Problem:* this module is pure and has no clock,
   so when the caller passes no `nowMs` the module cannot know whether evidence is current. *Choice:*
   report `stale: false` but `checked: false`, and only refuse when staleness is provable. *Rationale:*
   refusing every unjudged candidate would break callers that legitimately have no clock, and
   answering "fresh" would repeat the original defect in a new place.
6. **Two-layer prototype defence** (bare object *and* own-property reads) rather than one.
   *Rationale:* they close different vectors — inheritance and a polluted global prototype — and the
   second costs one helper.
7. **No author test was corrected this time.** For BA-003 and EM-002 an author test encoded a defect
   and was corrected with the reason written into it. Here all eight author tests passed unchanged
   before and after the repair, which is itself the finding: their suite simply did not cover any of
   these seven mechanisms.
8. **No Android device observation and no Computer-Use session.** The workbook authorises them if
   acceptance requires observation; RF-003's acceptance is a pure-module contract with a deterministic
   adapter double and no device surface, so nothing was observed and Android Studio was not invoked.
   Recorded because the authority was granted and is not being used.

## 7. Tests and CI

Author suite: **8/8 still pass unchanged**. Suite extended **8 → 16 tests**; every negative assertion
is paired with a legitimate neighbour that must still pass, so no guard can be satisfied by refusing
everything (for example: a padded address is refused *and* a canonical one is accepted; a negative
`limit` is refused *and* the declared cap still clamps; an inherited payload is refused *and* a
null-prototype own-property record is accepted; an expired sighting is refused *and* an in-window
skewed sighting still resolves).

Repair verification replays the original reproductions rather than the new tests:
`alien-verify-repair.mjs`, **27/27 PASS**.

Local equivalent of the CI gate, on the repaired revision:

```text
node --test tests/*.test.mjs                -> 117 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at f0d8f59)
node scripts/check-bilingual.mjs            -> docs/evidence/data-records SYNCHRONIZED
```

Implementation CI: **36728802526 — gateway-web success, android success** on
`remote/RF-003-local-discovery-lan-direct` @ `4a51996`.

## 8. Honest self-errors

- My first regression test asserted that a sighting 1 000 ms old with a 30 s ttl is stale. The test
  was wrong, not the module (`1000 >= 30000` is false, so it is fresh); it now uses `ttl + 1` ms.
- My evidence-probe paths were wrong twice before running (the frozen export is nested under
  `contracts/remote-local-discovery-v1/`, and the verification probe's relative import needed
  `.runtime/` in the path). Recorded because a probe that never ran proves nothing.
- I briefly added `stale: null` to the merge branch and then removed it: the spread already carried
  no verdict, so the field was shape noise rather than a fix.
- The line references in my working notes (`:141`, `:117`) were off; the merge key was at `:139` and
  `addressKey` at `:117`. Corrected in the notes.
- `addressKey` became dead code once the unidentified key changed, and was deleted rather than left
  unused.

## 9. Result

All seven confirmed defects are repaired at the mechanism, with paired regression tests and a replay
of the original reproductions. No defect was closed by narrowing a test or by refusing legitimate
input; four candidate repairs were deliberately not made and are recorded in §4 with their reasoning.
Nothing about this task required device observation, so none was performed.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/remote/RF-003-local-discovery-lan-direct.md
```
