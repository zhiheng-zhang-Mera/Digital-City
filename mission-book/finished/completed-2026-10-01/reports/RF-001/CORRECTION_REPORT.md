# RF-001 Correction Report — Node Identity + Installation Lifecycle

```text
MISSION                     = RF-001 (Remote Fabric programme)
STAGE                       = CORRECTION
CORRECTION_HOST             = Mech  (Development host was Alien — two-host gate satisfied)
CLAIM_COMMIT                = a7456d3 (Digital-City main, "claim(RF-001): Mech claims Correction stage")
CLAIMED_AT                  = 2026-09-30T12:27:59Z
DEVELOPMENT_HEAD_REVIEWED   = b1ee127bb7ba292bda7b817dd4910b4498f446c1
DEVELOPMENT_CI_REVIEWED     = 36713816317 (gateway-web success, android success)
COMPONENT_BASELINE          = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_REPO         = zhiheng-zhang-Mera/utopia
CORRECTED_BRANCH            = remote/RF-001-node-identity-installation-lifecycle
CORRECTED_HEAD_SHA          = 0f4c75b2ab641ba2111c8da58a3954db121cee34
CORRECTED_BRANCH_CI         = 36715609917 — gateway-web success, android success
LOCAL_CHECK_SUMMARY         = module 75/75, root 101/101, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
CORRECTION_COMPLETE         = true
MERGE                       = NOT PERFORMED (forbidden for component branches)
```

## 1. Method

Correction is a repair task, not passive verification, so this stage ran as:

1. **Independent reproduction first.** The branch was checked out on Mech in a separate worktree
   and Alien's own suite was run unmodified: **65/65 pass**. That establishes the baseline and
   means every later failure is caused by a deliberate attack, not by an environment difference.
   (`pnpm` is not on PATH on Mech; `corepack pnpm` resolves the CI-pinned 11.19.0.)
2. **Adversarial probing before reading.** Probes were written against the public surface and the
   author's own handoff list, and executed (`probe.mjs`, `probe2.mjs`). Raw evidence, git-ignored:
   `.runtime/evidence/mission-book/RF-001/correction-001/`.
3. **Root-cause reading.** Only the paths the probes implicated were read in full
   (`contracts.mjs` key/installation validation, `identity.mjs` lifecycle and clone detection).
4. **Direct repair on the same branch** plus a regression test per defect, then the whole local
   check suite, then branch CI.

Six in-scope defects were found. All six are repaired. Nothing was reported without a repair.

## 2. Independent review findings (each reproduced before repair)

### C1 — a retired device still presented key authority (severity: high)

`assertActiveKey` checked only that the key existed and was `ACTIVE`; it never looked at
`device.state`. `retireDevice` preserves the key set as history, so a retired device kept an
`ACTIVE` key. The module's own docblock names "a `deviceId` plus a key that passes
`assertActiveKey`" as the trust criterion, so a record the module documents as terminal still
passed its own authentication check.

```text
PROBE P1 retired.state = RETIRED, keys[0].state = ACTIVE
PROBE P1.assertActiveKey(retired): NO-THROW -> {"keyId":"key-1",...}
```

In scope: the workbook requires device retirement semantics, and invariant 6 ("local state is a
cache, not authority; revalidate before resuming") is meaningless if retirement is not terminal
for authentication.

### C2 — placeholder key material was indistinguishable from real key material (severity: high)

`migrateDeviceIdentity` builds a key reference named `legacy-gateway` for a legacy gateway row
that has no key material. Nothing in the v1 document distinguished that placeholder from a real
key, so the migrated — explicitly unauthenticated — record satisfied `assertActiveKey`.

```text
PROBE P2 keys=[{"keyId":"legacy-gateway",...,"state":"ACTIVE"}]
PROBE P2.assertActiveKey(migrated): NO-THROW -> {"keyId":"legacy-gateway",...}
```

The development report's D10 rejected "omit the key and relax the v1 contract" precisely because
that "would make an unauthenticated record satisfy the same document shape as an authenticated
one, destroying the distinction the module exists to create". The implementation as written did
exactly that; the distinction was asserted in prose but not representable in the contract. This
is an in-scope design defect, and the repair preserves D10's stated intent rather than reversing
it.

### C3 — a reinstall could reuse the installation credential (severity: high)

`reinstallInstallation` required a new `installationId` and a new `instanceId` but accepted the
previous credential handle or secret. The workbook requires that cloned **or reused** installation
credentials must not let two physical installations share one active installation identity.

```text
PROBE P3.reinstall(same credentialId+fingerprint): NO-THROW -> {"retired":{...},"installation":{...}}
```

### C4 — reused credentials were invisible to the population scan (severity: medium-high)

`detectCredentialClones` grouped by `installationId` only, so a credential shared by two
*different* installation identities produced no finding. The author flagged this in the handoff as
an open question; the workbook's wording ("cloned/reused installation credentials") makes it
in scope, because reusing the secret is how two installations end up sharing one credential.

```text
PROBE P4.detectCredentialClones(reused credential, distinct installation ids): NO-THROW -> []
```

### C5 — a quarantined installation could not be retired, and the refusal was misleading (severity: medium)

`validateInstallation` required `state === 'QUARANTINED'` exactly when a quarantine block was
present. `retireInstallation` and `reinstallInstallation` preserve the quarantine block when they
move a record to `RETIRED`, so both legitimate lifecycle operations threw
`malformed: state QUARANTINED and a quarantine block must be set together` — a false refusal, with
a message describing a state the record was no longer in. A quarantined clone could therefore not
be retired, and could not be reinstalled cleanly.

```text
PROBE P7.retireInstallation(quarantined): threw malformed: state QUARANTINED and a quarantine block must be set together
PROBE P8.reinstallInstallation(quarantined, fresh ids): threw malformed: state QUARANTINED and a quarantine block must be set together
```

### C6 — MAC pairing evidence threw an untyped `TypeError` (severity: low)

`macPairingEvidence('3c:22:fb:11:22:33')` — one reported address, the most natural caller mistake —
crashed with `TypeError: (values ?? []).map is not a function` instead of answering with a declared
refusal. In a path whose entire purpose is "never block a pairing", an incidental crash is exactly
the failure mode the module's rejection-code discipline exists to prevent.

```text
PROBE P5.macPairingEvidence("not-an-array"): threw TypeError: (values ?? []).map is not a function
```

## 3. Direct repairs

| Repair | File | Change |
|---|---|---|
| C1 | `identity.mjs` | `assertActiveKey` refuses a `RETIRED` device with `device_retired` before consulting the key set; docblock now states all three rungs (device not retired, key `ACTIVE`, key has real material) |
| C2 | `contracts.mjs` | new `KEY_MATERIALS = ['PUBLIC_KEY_MATERIAL','PLACEHOLDER']`; `DEVICE_KEY_FIELDS` gains `material`; `deviceKey` requires a known kind; `validateDeviceIdentity` refuses an unknown/absent kind; copy-constructors carry it |
| C2 | `identity.mjs` | `assertActiveKey` refuses a `PLACEHOLDER` key with `key_material_missing`; `migrateDeviceIdentity` marks the `legacy-gateway` reference `PLACEHOLDER` |
| C3 | `identity.mjs` | `reinstallInstallation` refuses a reused credential handle **or** secret with `credential_reuse` |
| C4 | `identity.mjs` | `detectCredentialClones` also groups by credential fingerprint and reports `REUSED_CREDENTIAL` (with `installationIds`) separately from `SHARED_INSTALLATION_IDENTITY` |
| C5 | `contracts.mjs` | a `RETIRED` record may keep a quarantine block it already had; the refusal messages now describe the actual rule |
| C6 | `identity.mjs` | `macPairingEvidence` accepts one address, an array, or nothing, and throws a typed `malformed` refusal for anything else |
| all | `contracts.mjs` | `IDENTITY_REJECTION_CODES` gains `key_material_missing` and `credential_reuse` |
| all | `index.mjs` | `KEY_MATERIALS` exported |

Post-repair probe results (same probes, same inputs):

```text
PROBE P1.assertActiveKey(retired): threw device_retired
PROBE P2.assertActiveKey(migrated): threw key_material_missing
PROBE P3.reinstall(same credential): threw credential_reuse
PROBE P4.detectCredentialClones(reused credential): [{"reason":"REUSED_CREDENTIAL","installationIds":[...]}]
PROBE P5.macPairingEvidence("string"): one reported entry, no crash
PROBE P7/P8 retire/reinstall of a quarantined installation: succeeded, quarantine block preserved
```

## 4. Regression tests

Ten tests were added to the module suite (section 12, "correction round (host: Mech)"); each fails
on `b1ee127` and passes on `0f4c75b`: C1 retired-device authority; C2 placeholder-is-not-authentication
(including "rotation restores authentication without moving `device_id`"); C2 every v1 key must state a
known material kind; C3 three credential-reuse shapes plus the accepted fresh-credential path; C4
credential-reuse finding and its separation from the shared-identity finding; C5 retire-a-quarantined
installation with its evidence preserved; C5 reinstall from a quarantined installation; C5 quarantine-block
legality on both sides; C6 MAC input shapes; C6 the new refusal codes are declared in the vocabulary.

Module suite: **75/75 pass** (65 original + 10 regression). No original test needed to change: the
existing clone-detection assertions still hold because C4's two records share one *identity*, so
their finding count is unchanged — verified rather than assumed. The suite's own invariant test that
every raised code is declared now covers the two new codes.

## 5. Checks that found nothing (independent confirmation, not assumed)

- **Presentation ladder order** (handoff item 1): a credential presented from a different instance is
  `CLONE_DETECTED` before the unbound rung; a wrong credential is `CREDENTIAL_MISMATCH`; a clone that
  mints its own record is caught by the population scan. No sequence was found that accepts a
  presentation while two physical instances share one installation identity.
- **Device/installation retirement terminals**: rotation on a retired device is refused; revoking the
  active key is refused; a retired installation is refused for every presenter, so a clone cannot clear
  its own flag.
- **MAC is not authority**: `trustFromMacEvidence` refuses for every input; spoofed evidence cannot
  enter an authority-bearing field; missing/randomised MAC never blocks.
- **Metadata cannot become authority** (probe P6): unknown patch keys are dropped by `deviceMetadata`,
  so `recordNetworkMetadata` cannot smuggle `deviceId`/`keys`/`displayName` into a device.
- **No raw secret in serialised documents**: `credentialLeakScan` remains true-by-contract.
- **Handoff item 5 — manifest provenance widening, verified by falsification:** adding a `donor` block
  to a programme task's `PROVENANCE.json` makes `city/tests/manifest.test.mjs` fail, and deleting a
  migration module's `DONOR.json` makes it fail with `ENOENT`. The widened task-id recognition did not
  weaken the migration rule, and a programme task still cannot claim a donor. Working tree restored
  clean afterwards (8 pass / 0 fail).
- **Handoff item 6 — the repaired census fixture cannot pass vacuously:** the infrastructure building
  list is explicit and paired with a non-vacuity assertion; the loop must have walked a building for
  the assertion to be reached.
- **No ambient state**: no `Date.now()`, `Math.random()`, `process.env`, filesystem or socket access in
  the module; instances are parameters and entropy is an explicit 16-byte input.

## 6. Decision log (problem → choice → rejected alternatives → why)

**D1 — How to correct another host's implementation without copying it.**
CHOICE: work on the same branch in a separate worktree; reproduce the author's suite unmodified first,
then attack. REJECTED: (a) reading the diff and writing a review — the workbook says Correction is a
repair task, and findings without falsifying observations are opinions; (b) rewriting the module —
would discard verified work and make the two-host evidence meaningless.

**D2 — Where the trust repair belongs (C1/C2).**
CHOICE: at `assertActiveKey`, the module's single named trust primitive, so every future caller inherits
the rule. REJECTED: (a) checking `state` at each caller — the same gap would reappear in the next
caller; (b) making a retired device's document invalid — the validator requires `activeKeyId` to name an
`ACTIVE` key, so a retired device could not keep its key history, which the module deliberately
preserves.

**D3 — How to represent "a key we do not have" (C2).**
CHOICE: an explicit `material: PUBLIC_KEY_MATERIAL | PLACEHOLDER` discriminator on every key, with
`assertActiveKey` refusing placeholders. REJECTED: (a) omitting the key for a legacy row — this is the
development report's own rejected option, and it would delete the distinction; (b) a separate
`legacy: true` flag on the device — it would not generalise to any other key that lacks material, and a
key-level fact belongs on the key; (c) inventing key material — a fabricated cryptographic fact.
CONSEQUENCE, recorded deliberately: this is a shape change inside v1, so a v1 device document whose keys
do not state `material` is now refused (`key`). The module mints its own documents and v1 is the only
version, so no caller is broken; the contract is stricter and honest rather than silently permissive.

**D4 — Credential reuse: refuse at reinstall, or only report at population level (C3/C4)?**
CHOICE: both. `reinstallInstallation` refuses it at the point where the mistake is made, and
`detectCredentialClones` reports it independently so a manually constructed population is still caught.
REJECTED: population-only (the bad record already exists and may already be bound), and reinstall-only
(two records built by hand would stay invisible).

**D5 — Extend the population finding shape or overload the existing one (C4)?**
CHOICE: add `reason` and report `REUSED_CREDENTIAL` as its own finding kind, because "one identity under
two instances" and "one credential under two identities" are different facts needing different repairs.
REJECTED: returning a boolean per record. The shape change is additive for consumers that read
`.installationId`/`.instances`, which the existing tests confirm.

**D6 — Quarantine on a retired record: keep or clear the block (C5)?**
CHOICE: keep it. The module states the quarantine reason is carried verbatim so a ledger can say what
happened; clearing it on retirement would rewrite history. REJECTED: (a) clearing on retirement — loses
the evidence; (b) forbidding retirement of quarantined installations — leaves a known-bad installation
un-retirable.

**D7 — Widen the module's refusal surface for an input-shape mistake (C6)?**
CHOICE: yes — accept the three legitimate shapes and answer anything else with a declared `malformed`
refusal. REJECTED: documenting the array-only expectation, because the pairing-evidence path must not be
able to throw an untyped error at a caller that is trying to avoid blocking a pairing.

**D8 — No evolution-feed event for RF-001.**
CHOICE: unchanged from the development report's D8 (the event schema pins `MB-` ids and `contracts/**`
is frozen for this task). The correction record is this report.

## 7. Reconciliation with DEVELOPMENT_REPORT

- Every "Required acceptance" line the report maps to tests does have those tests, and they pass on Mech
  (independently reproduced, 65/65 before repairs).
- The report's purity, MAC, migration and refusal-code claims were re-checked and hold.
- **Discrepancy 1**: D10's stated rationale ("would destroy the distinction the module exists to create")
  was not achieved by the implementation — nothing distinguished placeholder from real key material (C2).
  Repaired; the distinction is now machine-checkable.
- **Discrepancy 2**: the report claims the migration "does not claim the device holds a key it was never
  issued" and that "a real enrollment must rotate it". The first half was a prose claim only until C2;
  the second half is now enforceable rather than advisory, because the placeholder cannot authenticate.
- **Discrepancy 3**: the report's clone-detection section treats reuse as covered by the
  `installationId` grouping. It is not (C4); the credential dimension is now covered, and the reinstall
  path is guarded directly (C3).
- **Extension recorded**: the report's D4 defines a clone as "the same `installationId` from a different
  `instanceId`". The workbook's word "reused" extends that to credentials; C3/C4 implement the extension
  rather than contradicting D4.

## 8. Local checks and CI

| Check | Result |
|---|---|
| module suite `device-identity.test.mjs` | 75 pass / 0 fail |
| `corepack pnpm test` | 101 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 records verified against local history at b1ee127bb7ba |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36715609917 on `0f4c75b2ab641ba2111c8da58a3954db121cee34` | gateway-web success, android success |

Documentation impact: none required. The only architecture-doc sentence in scope ("...no key material,
no separation of logical device from installation...") describes the legacy gateway row and remains true.

## 9. Deferred / out-of-scope seams (unchanged from the development report)

No product/service consumer (`services/dev-gateway` wiring), no transport/discovery/pairing/encryption
(RF-002..RF-006), no presence/reachability/policy (RF-009/RF-010), and no evolution-feed event. The
correction did not widen the module's boundary; it only made the declared boundary enforceable.

## 10. Open items for the Owner / final integration

1. The v1 key-shape change (D3) means any integration that constructs device documents by hand — rather
   than through `enrollDevice`/`deviceKey` — must state `material`. No such constructor exists on this
   branch; the Remote merge workbook should re-check when RF-002..RF-010 land.
2. `detectCredentialClones` now returns findings with a `reason`; consumers must branch on it rather than
   assume every finding has `installationId`.
3. Whether quarantine should also be expressible as a *separate* history entry (rather than a block on
   the record) is an architecture question for RF-009/RF-010 ledgers, not a defect here.

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Alien
CORRECTION_HOST     = Mech   (different physical host — two-host gate satisfied)
CORRECTED_HEAD_SHA  = 0f4c75b2ab641ba2111c8da58a3954db121cee34
MERGE_STATUS        = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

## 11. Decisions not specified by the workbook (summary for quick scanning)

```text
D1 probe-first correction on the author's own branch, in a separate worktree
D2 trust repair at assertActiveKey (the module's single named trust primitive)
D3 key "material" discriminator instead of relaxing the v1 document contract
D4 credential reuse refused at reinstall AND reported by the population scan
D5 population findings carry an explicit reason (REUSED_CREDENTIAL vs SHARED_INSTALLATION_IDENTITY)
D6 a retired record keeps the quarantine evidence it already had
D7 macPairingEvidence answers an unhelpful input shape with a declared refusal, not a TypeError
D8 no evolution-feed event (schema pins MB- ids; contracts/** frozen for this task)
```
