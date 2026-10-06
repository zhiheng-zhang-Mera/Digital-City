# MON-990 Formal Review claim — Mech

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ROLE CLAIMED        FORMAL_REVIEW (opposite physical host)
REVIEW TARGET       fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40
                    branch mon/MON-990-Alien-20261006; remote tip equals that commit (measured at claim time)
DEVELOPMENT_HOST    Alien  -> the reviewer host is a DIFFERENT physical host, as CONSTRUCTION_RULES section 3 requires
CLAIMED AT MAIN     zhiheng-zhang-Mera/Digital-City main 3ebc43259ba494f70b32b4ca17b5156c344e0d27
MERGE AUTHORITY     none. This claim does not merge, does not release CITY_WORK_MONITOR_V1_ACCEPTED, and does not
                    accept the author's own test results as evidence.
```

## Claim-time measurements (taken before any verdict)

```text
workbook review_host                            null  -> the review was UNCLAIMED when this claim was written
workbook development_host                       Alien, development_complete true, execution_enabled true
development_head_sha                            fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40
remote tip of mon/MON-990-Alien-20261006        fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40   (git rev-parse, exit 0)
implementation main at claim time               213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
ancestry, all three measured with git merge-base --is-ancestor (exit 0 each):
    accepted MON-902  f4988248a3316806fc2e3fa9e62864ed129fe7b3   reachable from the reviewed head
    accepted MON-903  3cd32c60d8e9beb9df961e6b7ff193a3f69ec224   reachable from the reviewed head
    main              213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef   reachable from the reviewed head
exact-head check runs re-read one at a time from the Actions API for fb042d9, matched on headSha:
    push          37420061997  COMPLETED SUCCESS attempt 1
    pull_request  37420065177  COMPLETED SUCCESS attempt 1
    linkage       37420065178  COMPLETED SUCCESS attempt 1
```

The two dependency heads are the ones this reviewer knows from the inside: MON-902's accepted head is the reviewer's own
repair target's successor, and MON-903's accepted head `3cd32c60` is the head that contains this reviewer's four
sibling-class findings. That is context, not evidence — nothing below will rest on the author's numbers.

## Independence, proven rather than asserted

The workbook records `development_host: Alien`. This claim is made by Mech on a different physical machine, so the
reviewer is not the author. The author's `SUCCESS exact fb042d9` and their physical Android/Web claim are treated as
claims to be re-measured, not as evidence.

## What this review is, and what it must manufacture

MON-990 is the closeout: eleven mandatory reconciliation checks (overview state against canonical task state; node
owner/host/model metadata against runtime truth; edge reason against a real handoff/retry/review/routing event; decision
receipt against an actual state transition; risk bubbling that must not hide an active failure; unrelated tasks
continuing while JEV/monitor is unavailable; a decision timeout affecting only its target task; registry against
runtime/UI; Web plus the current Android surface parity; large-graph collapse/filter/stable layout; and normal diagnosis
reaching exact evidence within 2–3 interactions), a research closeout synthesis, and the terminal marker
`CITY_WORK_MONITOR_V1_ACCEPTED`.

Planned instruments, to be recorded with their results **including any that fail**:

```text
V1  Independently manufactured runtime probes for the checks that can be driven on a real Gateway on this host,
    rather than re-running the author's suite and calling the number reproduced.
V2  An adversarial attempt on the property this programme has repeatedly found false: that a summary cannot look
    safe while an active risk exists, and that absent coverage metadata is treated as a finding rather than as zero.
    The reviewer's own sibling-class findings (F-S1/F-S2/F-S6/F-S8) are the reason to look again here.
V3  Cross-device parity stated as what was actually exercised, with the Android native/physical side either
    reproduced on this host or declared NOT_RUN with the reason.
V4  Registry reconciliation: CAP-MON-001/002/003 against what the running City and the Web surface actually do.
V5  A re-measurement of the author's claimed numbers, so the report states which of them were reproduced here and
    which were not.
V6  The completion-gate question this task inherits: whether the marker may be released at all, given that
    MON-990's own workbook requires runtime/UI reconciliation and an opposite-host review, and the reviewer must
    say plainly what is unmeasured.
```

Findings, including anything the reviewer cannot reproduce, will be published in
`mission-book/reports/MON-990/REVIEW_REPORT.md` against this exact target. The terminal marker is released only by that
report, and only if the review passes.

语言配对 / Language pair: [English](./REVIEW_CLAIM_Mech.md) · [中文](./zh-CN/REVIEW_CLAIM_Mech.md)
