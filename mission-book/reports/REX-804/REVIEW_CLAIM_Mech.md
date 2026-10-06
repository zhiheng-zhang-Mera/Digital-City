# REX-804 Formal Review claim — Mech

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ROLE CLAIMED        FORMAL_REVIEW (opposite physical host)
REVIEW TARGET       f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5
                    branch rex/REX-804-Alien-codex-faults; remote tip equals that commit (measured at claim time)
DEVELOPMENT_HOST    Alien  -> the reviewer host is a DIFFERENT physical host, as CONSTRUCTION_RULES section 3 requires
CLAIMED AT MAIN     zhiheng-zhang-Mera/Digital-City main as of this commit
MERGE AUTHORITY     none. This claim does not merge, does not release the terminal marker, and does not accept the
                    author's own test results as evidence.
```

## Claim-time measurements (taken before any review verdict)

```text
remote tip of rex/REX-804-Alien-codex-faults   f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5   (git rev-parse, exit 0)
required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe reachable from the reviewed head
                                               git merge-base --is-ancestor, exit 0
dependency REX-802 833279cae237080cca88b1b6dbc9f217027ba68f reachable from the reviewed head, exit 0
implementation main at claim time              213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
exact-head check runs re-read from the GitHub API for f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5:
    gateway-web success (x2), android success (x2), reciprocal-contract success   — all terminal success
author-reported CI  37397799729 (PR), 37397794253 (push), linkage 37397800050
```

## Independence, proven rather than asserted

The workbook records `development_host: Alien`. This claim is made by Mech (`COMPUTERNAME MEGA-REP`), a different
physical machine, so the reviewer is not the author. Nothing in this review will rest on the author's own test output,
and the author's focused `10 PASS` is treated as a claim to be re-measured, not as evidence.

## Review scope to be independently manufactured

The workbook's Review section requires the reviewer to design **at least one fault probe the author did not use**, and to
verify failure classification and recovery metrics. Planned instruments (to be recorded with their results, including
any that fail):

```text
R1  An UNUSED fault class probe: a fault interaction the author's four classes do not cover - specifically a fault
    targeted at a node that becomes INELIGIBLE while the fault is active, and a second injection attempted while the
    first is stopped-but-not-yet-expired.
R2  Normal-mode non-interference: with no fault active, the City's canonical task lifecycle and the campaign surface
    added by REX-803 must be unaffected, and the fault surface must not be reachable by an enrolled member.
R3  Safety bounds: duration bound, expiry, emergency stop, and refusal paths (confirmation mismatch, offline target,
    non-owner credential), each observed rather than trusted.
R4  Runtime/registry reconciliation: the candidate capability record and the workbook's exposure claims against what
    the running City and the Web surface actually do.
R5  Exact-head re-measurement of the author's own focused suite on the reviewer's host, so the review states which of
    the author's numbers it reproduced and which it could not.
```

Findings, including any that the reviewer cannot reproduce, will be published in
`mission-book/reports/REX-804/REVIEW_REPORT.md` on this same target SHA. The terminal marker
`FAULT_INJECTION_RECOVERY_ACCEPTED` is released only by that report, and only if the review passes.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/REVIEW_CLAIM_Mech.md)
