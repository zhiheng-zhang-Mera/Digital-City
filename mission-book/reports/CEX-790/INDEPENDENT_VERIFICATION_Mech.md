# CEX-790 integration — opposite-host independent verification (Mech)

```text
VERIFIER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
SUBJECT             Alien's current-main integration of the CEX sub-series
BRANCH              integration/CEX-790-Alien-20261006
VERIFIED HEAD       4688274255464383d577841a37e85a556d92c678   (PR #33, base main)
MERGE COMMIT        65f86f91a3d404cdbcb8f2fa43ceb9da8e994600   (parents: main 213f9f9f + author 04ecb7dd)
MAIN               213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef   (verified an ancestor of the head, exit 0)
VERDICT            nothing found that should block merge; 1 reproducibility finding, 2 of my own record
                   claims corrected (see §5 and §6), and 1 residual risk stated rather than cleared
MERGE AUTHORITY     none — this host did not and does not merge
```

## 1. What this is, and what it is not

This is an **opposite-host verification of Alien's integration**, not a review of Mech's own CEX-790 task. CEX-790's
Development and its owner-waived closure are Mech's; the thing under verification here is a different artefact that
Alien produced on a different physical host. The two must not be conflated.

The integration is a merge of current `main` (`213f9f9f`) with Alien's audited author branch (`04ecb7dd`), plus one
ordinary commit (`4688274`) that adds the current-audit evidence. Nineteen files differ from `main`.

## 2. Provenance: every changed file traces to a declared source

The report claims the merge "does not replace main with the old dependency union". That is checkable mechanically, and
an unverified merge is exactly where an "evil merge" hides: content that exists in neither parent. The check is a
set-difference — a file may differ from `main` only if some **declared source** also changed it — and it deliberately
prints the *unexplained* set rather than a pass/fail word, because that set is what a reviewer has to look at.

```text
main 213f9f9f -> head 4688274 relative to main: 19 files

declared sources (files each changes vs main)
  author branch 04ecb7dd (90)   capability-bridge repair 8c67bb2 (4)   research-registry repair a676c8c (3)

AT THE MERGE COMMIT 65f86f9   explained 14 / 15, unexplained 1:
  tests/cex790-current-inventory.test.mjs      <- the integrator's own NEW test; read in full (§4)
AT THE FINAL HEAD 4688274     explained 15 / 19, unexplained 4:
  docs/{en,zh-CN}/CAPABILITY_ENTRY_AUDIT_INTEGRATION.md
  evidence/raw/mission-book/CEX-790/current/{RECONCILIATION.md,capability-inventory.json}
      <- `git diff --name-only 65f86f9 4688274` returns exactly these four, so they are attributed, not unexplained
```

Every one of the nineteen files is therefore accounted for by main, the author branch, one of the two published repair
branches, or one of the integrator's own two commits. **No evil merge.**

## 3. The two adopted repairs are byte-identical to what this host published

Alien's report states the two repair branches were "reviewed and adopted". Adoption is where a repair silently loses its
guard, so the claim was verified by diff rather than trusted:

```text
git diff 8c67bb2 4688274 -- services/capability-bridge/ tests/bridge-artifact-store-guard.test.mjs   -> EMPTY
git diff a676c8c 4688274 -- services/dev-gateway/research/ tests/rex801-store-guard.test.mjs         -> EMPTY
```

And `services/dev-gateway/server.mjs`, which both repairs touch, is a clean **union** rather than one side winning:

```text
this host's repair contributes   health's `artifacts` component + its exclusion from the degraded calculation
the REX-801 repair contributes   the registration route forwarding `persistFailure` to the caller
BOTH hunks are present in the integration; neither was dropped
```

One honest gap in my own published work, found by Alien and fixed here: the REX-801 repair put the typed reason on the
wire (`persistFailure`), but `apps/web/research.js` still discarded it, so a Web user would still not have seen it. The
integration adds `persisted`/`persistFailure` to the compact receipt and a store-unavailable notice, and adds a real
browser probe (`tests/rex801-research-ui.test.mjs`) for it. That is a repair of the *surface* of my repair, and it is
recorded as such rather than as an addition.

`apps/web/app.js` removes two duplicated render lines on the Devices page. Both survivors are the stronger of their
pair (the kept scheduler line carries `busyTasks`; the kept terminal render carries `credentialContext`), so the DOM is
no longer built twice per frame. `CityClient.kt` only widens the typed-refusal path list — additive, nothing removed.
`tests/rex801-research-ui.test.mjs` gains a probe and weakens no existing assertion.

## 4. The cited CI, verified per-run

```text
37412522043  push           head 4688274  completed SUCCESS attempt 1  jobs: android success, gateway-web success
37412526500  pull_request   head 4688274  completed SUCCESS attempt 1  jobs: android success, gateway-web success
37412526523  pull_request   head 4688274  completed SUCCESS attempt 1  job:  reciprocal-contract success
```

All three read from the Actions API one run at a time and matched on `headSha`. The report's own caveat is also
correct: at the moment it was written push/PR were still queued, and it did not infer green from a running job.

## 5. Independent local reproduction, and two instrument classifications

Run on the verifier host at the exact head, clean worktree, verified twice:

```text
run 1 (root install only)                          run 2 (root + city install, as ci.yml prescribes)
tests 1359  pass 1352  fail 7                      tests 1359  pass 1356  fail 3
```

The three failures in run 2 are all `host-city-launcher` — *"Requires a free local host reservation"* — because the
resident City on this machine holds the host reservation. That is a genuine property of this host, not of the product.

The four extra failures in run 1 were classified by experiment, not by opinion:

| Failure | Classification | Evidence |
|---|---|---|
| `CEX790 current audit …` (`Cannot find module 'yaml'`) | **verifier setup**, not a defect | passes once `city` deps are installed, which `ci.yml` installs separately and `docs/en/CAPABILITY_ENTRY_AUDIT_INTEGRATION.md` states |
| `Windows Services invokes real document, knowledge, skill, evidence and theme adapters` | **load-sensitive instrument flake** | passes in isolation on this head (4590 ms vs 7952 ms under full-suite load) and passes in run 2; the CI run on this exact head was SUCCESS |
| `document bytes flow through real readers …` | **verifier setup** — see §6 | toggling only `city/node_modules` on the same head flips it |
| `Bridge Road extraction preserves all six published document retrieval digests` | **verifier setup** — see §6 | same experiment |

## 6. Correction to this host's own earlier records

For several rounds this host reported two failures as *"inherited environment failures … identical at baseline
213f9f9f"*: `CORRUPT_INPUT` in `capability-adapters` and `city-roads`. **That classification was wrong.** They were a
missing-dependency artefact of this host's own setup, and the claim was repeated in mission-book records and in two
commit messages.

The falsification, run on one worktree at one head (4688274) with the only difference being the presence of
`city/node_modules`:

```text
city/node_modules ABSENT    node --test tests/capability-adapters.test.mjs tests/city-roads.test.mjs
                            tests 11   pass 9    fail 2   (both CORRUPT_INPUT)
city/node_modules PRESENT   tests 11   pass 11   fail 0
```

The cause is ordinary: `capability-adapters.test.mjs` imports the document readers from `../city/09-planning-knowledge/
…`, and those readers load `mammoth` / `pdfjs-dist` / `fflate` / `yaml`, which live in `city/package.json` and are
installed by a **separate** step (`pnpm --dir city install`, `ci.yml` line 20). This host used a root-only `npm ci` —
and a package manager the repository does not use, since both lockfiles are pnpm. The correct setup makes them pass.

Consequences, stated rather than smoothed over: the two store-guard repair records and the family record carry that
incorrect phrase and are corrected in place; and any "5 inherited environment failures" figure from this host should be
read as *"3 host-reservation failures (environment) plus 2 not-installed-dependency failures (setup)"*.

## 7. Attacking the audit's central claim

The strongest claim in the integration is the inventory: `sources.gateway_route: 60`, 205 items, "candidates, not 205
accepted capabilities". Re-running the audit's own script would only show that the script agrees with itself, so an
independent extractor walked `server.mjs` with different logic and set-differenced the two route sets:

```text
raw `path===` occurrences in source          58
distinct captures                            42
source patterns after startsWith/regex       50
method-specific routes declared by the audit 55        sources.gateway_route 60
in the audit but NOT in source                0        <- nothing fabricated
in source but NOT in the audit                2        <- both are auth-layer PREFIX checks, not routes:
                                                          nodeRoute   = path.startsWith('/api/v0/node/')
                                                          researchRoute = path.startsWith('/api/v0/research/')
```

So the check **failed to falsify** the inventory: no invented route, and no omission it can substantiate. That is the
honest ceiling of a crude extractor, and it is stated as such rather than as proof of exhaustiveness.

This host's *first* version of that extractor is worth recording because it is the fourth instance of one failure class
in this programme. It sliced "just the routing chain" at a `// ===` banner, found 11 of the 58 route comparisons, and
produced a confident, entirely wrong list of 42 "fabricated" routes. Only a cross-check of the capture count against
the raw occurrence count exposed it. A extractor that has never been asked "how many should you have found?" is not
evidence — the same lesson as the sweep whose table claimed eight traps while planting six, and as the probe that
planted its fault after construction.

## 8. What this verification does NOT establish

- It does not merge, and it grants no merge authority.
- It does not re-derive the 205 inventory items one by one; it attacks the route subset only.
- It does not accept any physical-device or external-provider claim; the integration makes none, and this host measured
  none.
- The `city.sqlite` / join-store findings (`DEFECT_RESEARCH_STORE_HARDENING.md` F-1, F-2) and the WBC-604 profile-store
  repair (`repair/WBC-604-mech-profile-persist-first`) are **outside** PR #33 and remain open regardless of its merge.
- The Android job was green in CI; this host did not build or install the APK.

## 9. The instruments, committed so the checks are re-runnable

```text
reports/CEX-790/provenance-check.mjs      the declared-source set-difference behind §2
                                          node provenance-check.mjs <worktree> <main> <head> <source> [<source> ...]
reports/CEX-790/route-coverage-check.mjs  the independent route-coverage check behind §7
                                          node route-coverage-check.mjs <worktree>
```

Both print their own uncertainty rather than a bare pass: the provenance check prints the *unexplained* file list
(which is the point — a pass/fail word would hide which files a reviewer still has to justify), and the coverage check
states that a crude extractor can only fail to falsify, never prove exhaustiveness.

## 10. Verdict

```text
MERGE BLOCKERS FOUND        none
PROVENANCE                  every changed file traces to a declared source; no evil merge
ADOPTED REPAIRS             byte-identical to the published branches; server.mjs a clean union of both
CITED CI                    three runs, per-run read, all SUCCESS attempt 1 on the exact head
LOCAL REPRODUCTION          1356/1359, the 3 failures being this host's resident-City reservation
RECORD CORRECTIONS          2 claims of this host's own, corrected in §6
RESIDUAL RISK               1 reproducibility finding (the yaml/city install step) that only bites a reviewer who
                            skips the documented second install; it does not affect CI
```
