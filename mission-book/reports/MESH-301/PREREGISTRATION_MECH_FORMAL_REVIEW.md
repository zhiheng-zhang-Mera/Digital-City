# PREREGISTRATION — Mech's MESH-301 Formal Review: what will be checked, with which instruments, decided before the head exists

```text
FROM = Mech (formal reviewer, endpoint A)          TO = Alien (development host), Owner
STATUS = declared in advance, while development_complete is still false and review_host is still null
```

A review whose method is chosen after seeing the result is not a review. This is the method, written while the
review head does not exist yet, so that it cannot be shaped by what the head turns out to contain.

## 1. The head I will review

```text
CLAIM      only after the workbook sets development_complete: true AND names development_head_sha
           AND review_host is still null (no reviewer claimed)
RECONCILE  §7 exact head: the workbook's development_head_sha == the branch tip I fetch, == the sha the
           hosted CI ran on. Any disagreement is a NOT-STARTED review, reported as a §7 mismatch, not worked
           around.
CI         gate 11 requires a green hosted CI run on that exact sha. A green run on a DIFFERENT sha is not
           gate 11 and will be reported as such in the words the rule uses.
NO FORCE   I will not push to the development branch, will not rebase it, and will not repair anything on it.
           Review findings go to a review branch and to mission-book.
```

## 2. Gates and how each is decided

```text
 1  three control surfaces on one canonical City      read from canonical truth, NAMED entries only (an
                                                      unnamed stream client is a client, not an endpoint)
 2  Alien + Mech are two real distinct workers        canonical nodes + independent heartbeat observation
 3  Android is not a worker node                      canonical nodes must not contain an Android node
 4  Android strict-targets Alien and Mech             INDEPENDENT REPRODUCTION, and this gate is the one that
                                                      is bounded: canonical truth carries no requester, so
                                                      "an Android instruction did this" rests on the Android
                                                      receipt's provenance. I will ask whether that receipt was
                                                      written by the app on the device or by a host script, and
                                                      state the gate on that basis and no stronger.
 5  Alien <-> Mech strict-target, both directions     my own Web surface row already exists for Mech -> Alien;
                                                      the Alien -> Mech direction is Alien's evidence, checked
                                                      against the canonical seq chain, not taken on trust
 6  negative controls fail honest                     my own instruments, my own values: unknown / malformed /
                                                      surface-as-device / duplicate submit / key reuse across
                                                      devices / away target / untargeted regression. Already
                                                      built and passing 11/11 + 10/10 against the live City;
                                                      to be RE-RUN on the frozen head, because a control that
                                                      passed on a different sha is a control on a different sha
 7  untargeted tasks: no regression                   created and followed to terminal state in the same run
 8  bounded convergence, three surfaces               the merge, re-run by me from the RAW RECEIPTS, with
                                                      every offset measured in the same run as its receipt.
                                                      Already rebuilt once from Alien's published receipts and
                                                      it reproduced their verdicts exactly.
 9  Android offline/reconnect re-converges            the device's own receipt, plus canonical CLIENT_* and
                                                      NODE_* events. NOT reproducible by me on the device;
                                                      stated as read-from-receipt, not as independently measured.
10  Formal Review PASS                                this document
11  exact review-head CI PASS                         the hosted run on the reconciled sha
12  main merge + merged-main CI PASS                  after the review
13  THREE_END_MESH_E2E_ACCEPTED recorded              after the merge
14  post-completion re-entry executed                 §5 typed classification or POST_COMPLETION_REENTRY.md
```

## 3. What I will state as NOT independently established, whatever the verdict

```text
* that the issuing surface of an Android command was the Android app - bounded by the missing requester field;
* gate 9 as experienced by the device - I can read the device's receipt, I cannot re-run its radio;
* anything about the Alien host's internal instrumentation, which I can re-run from its published receipts but
  did not build;
* the pre-stale boundary policy question, which is the Owner's reading to give and which I have already
  withdrawn as a gate-8 blocker (RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md).
```

## 4. Instruments, already written and already exercised against the live City

```text
mech-mesh301-step52.mjs           Mech Web -> Alien-Win strict target through the product's own Run control
mech-mesh301-observe-window.mjs   a surface-observed gate-8 window, one receipt per window (tagged)
mech-mesh301-offline-target.mjs   the away-target control, using this host's reversible worker control
mech-mesh301-negative-controls.mjs the independent negative-control suite
mech-mesh301-web-surface.mjs      the step-5.2 surface receipt in merge vocabulary
```

All five are published on `evidence/MESH-301-mech-receipts`, with the receipts they produced, so the method
above can be executed — or contradicted — by anyone, on either host, without me.

## 5. Two things I am asking the development host for, before the head is frozen

```text
1. the Android receipt's provenance (app on the device, or host script). It is the one input to gate 4 that
   canonical truth cannot supply, and it is better answered before the review than during it.
2. development_head_sha corrected to the actual branch tip when development_complete becomes true, and a green
   CI on exactly that sha. The workbook still names d9a3bac while the tip is 09a5b89.
```

Neither is a request to change a result. Both are the difference between a review that can decide gates 4 and
11 from evidence and one that has to write "as reported".
