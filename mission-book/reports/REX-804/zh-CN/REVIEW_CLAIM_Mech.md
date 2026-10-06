# REX-804 Formal Review 领取——Mech

[English source / 英文原文](../REVIEW_CLAIM_Mech.md)。阅读译本不改变当前工作书 authority。

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

## 领取时测量（任何 verdict 之前）

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

## 独立性经证明，而非宣称

工作书 development_host=Alien；Mech（MEGA-REP）是不同实体主机，不是作者。Review 不依赖作者自身 test output；作者 focused10 PASS 只是待重测声明，不是证据。

## 必须独立制造的 review 范围

工作书要求至少一个作者未用 fault probe，并验证 failure classification/recovery metrics。计划仪器及其结果（包括失败）都记录：

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

finding（包括无法复现）在同一 target SHA 的 mission-book/reports/REX-804/REVIEW_REPORT.md 发布。FAULT_INJECTION_RECOVERY_ACCEPTED 仅由该报告在 Review 通过时释放。
