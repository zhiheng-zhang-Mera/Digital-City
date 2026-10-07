# PCF complete-flow opposite-host verification — Mech-DS

Canonical record (Chinese): [../MECH_VERIFICATION_REPORT.md](../MECH_VERIFICATION_REPORT.md). This is the read-only English mirror.

```text
VERIFICATION MODE   SINGLE_BATCH_OPPOSITE_HOST_VERIFICATION (the whole flow is received in one round)
SOURCE              utopia 998440c7772cc032d012b457c2a59cd1059826c0
                    branch pcf/full-flow-alien-pending-verification-20261007 (draft PR #42)
VERIFIED BY         Mech-DS - SECOND AUTHOR (COMPUTERNAME MEGA-REP, role Mech-DS, opposite physical host)
                    Alien-codex - FIRST AUTHOR (submitter, MERA-ALIANWARE)
VERDICT             CANDIDATE VERIFIED AS A DEVELOPMENT CANDIDATE - NOT programme completion, NOT main-merge ready
                    (matches the submitter's own declarations: programme_complete=false,
                     ready_for_physical_handoff=false, new_completed_workbooks=0)
PHYSICAL ACCEPTANCE still NOT_RUN - this round's physical evidence covers only real local CPU execution and the local
                    product surface; cross-host grants/transport, providers, phone worker and the full restart/SLO
                    and research matrices were NOT obtained
MERGED              no merge: PCF merge_authority is false programme-wide; main did not move
```

## What I actually ran

The candidate was fetched into an isolated directory at the exact SHA with a source tree that stayed clean throughout
(the empty status log is retained as evidence). Frozen dependencies were installed in both roots. My own probes - not
the submitter's assertions - ran twice each and agreed every time: 16/16 service checks and 15/15 gateway binding
checks. The submitter's combined component suite ran at 164 tests / 161 pass / 2 fail / 1 skip, the full available
regression at 1635 / 1632 / 2 / 1, the documented real CPU pilot exited 0, and the submitter's frozen study config was
reproduced on this host at 6/6 completed with replay validated on a CLEAN_EXACT_SHA tree.

The placement of my instruments was itself a correction worth recording: I first put the probes inside the candidate
tree, and the candidate's own PCF-700 D4 guard went red and named them, because nothing outside the declared fabric
paths may import the fabric. It was right. Moving the probes outside the tree restored D4 to green. Instruments must not
perturb what they measure, and quietly editing the test would have produced a false pass.

## What I can confirm independently

Real CPU child processes executed both applications, with three distinct PIDs (and the service probe separately
verified that PIDs are never fabricated or reused). The canonical Task reaches COMPLETED while its Action reports
SUCCEEDED with a result digest. Results are delivered but not consumed until the exact digest is acknowledged, and a
wrong digest is refused. Idempotency replays a same-payload retry and refuses a same-key different-payload one. A
caller claiming someone else's parent session is refused with no task created at all, at both the service and gateway
layers. The default posture is read-only and refuses submission, and once approved the projection still declares
OPPOSITE_HOST_ACCEPTANCE_PENDING and agentConsumed=NOT_OBSERVED rather than dressing local success up as acceptance.

The strongest single piece of independent evidence is cross-host reproducibility. Reproducing the frozen study config
here produced byte-identical output digests to the submitter's run for both applications across three repetitions each
(cpu-sort a691bb1f... and cpu-sum 7c5ae92b...), while all six PIDs differed on both hosts - so the agreement is not a
cache artefact. Timing differs (about 200 ms per trial here versus about 1137 ms there) and is recorded as
descriptive only. The candidate also demonstrably refuses to produce a result from a dirty source: a stray untracked
file made the study stop with INFRASTRUCTURE_STOP:STUDY_SOURCE_DIRTY and list the offending file.

## The two failures, located in the instrument rather than the product

Both failures are in tests/pcf716-deployment.test.mjs and both drive PowerShell through spawnSync('pwsh', ...). This
host has no PowerShell 7 at all - only 5.1.26100.9444 - so result.status is null and result.stderr undefined. Rather
than stopping at "environment", I verified the product behaviour directly under 5.1: the opt-out path exits 0 with
{"state":"REFUSED","reason":"EXPLICIT_OPT_IN_REQUIRED"}, and the ancestor-junction path exits 1, throws
REPARSE_POINT_FORBIDDEN and writes no candidate manifest. The gap between the submitter's 163 passing and my 161 is
exactly these two cases. The non-blocking suggestion is to resolve the PowerShell executable (prefer pwsh, fall back to
powershell.exe) so any host without PowerShell 7 does not see red.

## The one skip, and what I cannot prove for the submitter

The single skip is the Linux POSIX process lifecycle case, which states that Linux CI evidence is separate from
physical acceptance. This host has wsl.exe but no installed distribution, so physical Linux acceptance is not
available here either.

Nothing below is upgraded to PASS by this round, and each item was independently confirmed as not obtained: real
cross-host transport and authenticated worker grants; real Codex/DeepSeek engineering execution with supported resume
and process-tree stop proof; phone worker enrolment and three-surface origin return; the complete restart/fault/SLO
matrix and a formal cross-host REX campaign; a licensed model runtime and independent HA substrate; remote
streaming/DAG composition and the full engineering permission manifest. Host facts for comparison: Windows, Node
v24.14.0, 24 cores, NVIDIA GeForce RTX 5060 Laptop GPU with driver 591.59 and 8151 MiB - a driver observation, which
is not GPU execution, and the candidate itself records runtimeVersion and energyJoules as null rather than inventing
them.

## Second-author registration

This verification package has two authors with distinct responsibilities: Alien-codex as FIRST AUTHOR (the candidate
implementation, its frozen local evidence, the coverage matrix and the handoff protocol) and Mech-DS as SECOND AUTHOR
(independent reproduction, independent probes, the discrepancy localisation, and the boundary and NOT_RUN
classification). The registration appears in the report header, in the `verified_by` array of
intermediate-logs/2026-10-07-mech-verification-998440c/INDEX.json, and in the verification status line of this
directory's README. No merge, no marker release, no rewriting of the submitter's historical evidence and no change to
any workbook's review or acceptance facts: this report only ADDS the fact that the second author independently verified
this development candidate.
