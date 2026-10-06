# PCF-700 Author self-check at the frozen head (not a review)

A **read-only** self-check the author ran **at the reviewed head `659ff6a`**: re-run the local verification and test
whether the predicate behind the tier table is wider than the conclusion it supports. **This is not a review, carries no
verdict and releases no marker**; the opposite host's REVIEW_REPORT remains the authority.

```text
STATUS             AUTHOR_SELF_CHECK (read-only; the reviewed head was not modified, no review_* field was touched)
REVIEW TARGET      659ff6aa98bc5675862b1170ed0cf5e1b78dba5f (equal to both remote branches)
CHECKED AT         2026-10-06T21:53:55Z (Mech host)
```

## 1. Frozen-head local re-run (2026-10-06T21:53:55Z)

```text
tests/pcf700-compatibility.test.mjs + tests/pcf700-dependency-direction.test.mjs  => 11 pass / 0 fail
node scripts/check-bilingual.mjs                                                  => exit 0 (docs/evidence/data-records synchronized)
node scripts/pcf700-review-packet.mjs                                             => exit 0 (8/8)
git status --short                                                                => empty (scratch directories, .scratch-pcf700-*, were cleaned up)
Hosted on the same head: V0.2 checks run 37502818037 success (gateway-web + android), with `pnpm test` and
`pnpm check:docs` both having run there.
```

## 2. What the self-check found: **the predicate is wider than the conclusion** (said by the author first)

The tier table treats "at least one production file **references** the contract" as LIVE_WIRED, and "references" is a
**textual** test: it can be a comment or a data-path string rather than a module import edge. The author measured that
difference at the reviewed head:

```text
execution-backend-v1   4 production MENTIONERS: standard-devices.mjs, worker-pool.mjs, execution-profile.mjs, server.mjs
                       2 production files with a real import EDGE: worker-pool.mjs, execution-profile.mjs
                       2 mention-only (no edge): standard-devices.mjs, server.mjs
node-descriptor-v1     3 production mentioners, ALL with an import edge (worker-pool, server, headless-node-agent)
remote-local-discovery-v1   one mentioner (nearby.mjs), WITH an import edge
rs-presentation-contract-v1 one mentioner (presentation.mjs), WITH an import edge
=> re-judged on the stricter import-edge predicate, NOT ONE of the four LIVE_WIRED conclusions rests on a bare mention
   (the predicate can be tightened; the conclusion does not move)

engineering-manager-v1 / engineering-foreman-scheduler-v1 / general-ai-gateway-v1 / general-ai-registry-v1
                       production mentioners = 0 AND production import edges = 0; every edge comes from tests/
                       (including tests/web-scheduler-adapter.test.mjs importing general-ai-registry-v1/records.mjs)
                       => stronger than the tier table needed: they are not even mentioned in production code
rs-cross-device-return-v1   production mentioners = 0; all five edges are in tests/ => NOT_WIRED confirmed strictly
remote-typed-dataplane-v1   production mentioners = 0 => confirmed unwired
```

**Conclusion**: the tier table's **conclusions** stand (four LIVE_WIRED, EM/GAI tests-only, the return seam proven by no
production path), but the **predicate's precision** should improve - the audit should list import edges and bare
mentions separately instead of folding them into one `productionImporters` number.

## 3. How the author will handle it (stated now so the reviewed head is not moved mid-review)

```text
* NOT NOW: under the freeze in AUTHOR_HOLD_Mech.md, scripts/pcf700-reuse-audit.mjs and
  data-records/.../reuse-wiring-audit.json stay exactly as they are at `659ff6a`, even though the author already knows
  how to improve the predicate.
* AFTER THE VERDICT: on a NEW head, split `productionImporters` into `productionImportEdges` and
  `productionMentionsOnly` and regenerate the machine-readable record; if the reviewer already recorded this precision
  issue as a finding, that new head is its repair head and says which finding it answers.
* CLASSIFICATION NOW: this is not a product defect but a **statement in this audit that needs tightening** (class F5) -
  "references" should read "import edges".
```

## 4. How to reproduce this self-check

The read-only probe lives in the **process directory** (it is not part of the reviewed head):
`D:\utopia-chat\pcf700-lived-wired-precision.mjs`. Run it inside the frozen checkout; it only reads:

```bash
cd <reviewed checkout>
node D:\utopia-chat\pcf700-lived-wired-precision.mjs
```

Its rule is the STRICT one: it extracts the file's real module specifiers (`import`/`export ... from`, side-effect
`import '...'`, dynamic `import('...')`) and asks whether any of them points into that contract directory. Because that
differs from the audit's "text contains" test, the probe can both confirm the conclusion and expose the width of the
predicate.
