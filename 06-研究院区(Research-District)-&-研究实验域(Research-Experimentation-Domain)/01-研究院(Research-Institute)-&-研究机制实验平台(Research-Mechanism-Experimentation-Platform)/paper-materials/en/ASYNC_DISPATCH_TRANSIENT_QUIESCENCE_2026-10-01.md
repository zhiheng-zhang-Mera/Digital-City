# Paper material — transient quiescence in asynchronous multi-host dispatch

FACT: INCIDENT_ID=ASYNC-DISPATCH-TRANSIENT-QUIESCENCE-2026-10-01
FACT: GLOBAL_COMPONENT_TASKS=41
FACT: DEVELOPMENT_IMPLEMENTED=41
FACT: FULLY_TWO_STAGE_COMPLETE_AT_FINAL_SNAPSHOT=20
FACT: CORRECTION_CODE_COMPLETE_CI_BLOCKED=2
FACT: DEVELOPMENT_CODE_COMPLETE_CI_BLOCKED=5
FACT: DEVELOPMENT_GREEN_WAITING_CORRECTION=14
FACT: UTOPIA_MAIN_STAYED_AT=82ed36933fb4c5b00e44768d9e1aedec1d525d9c
FACT: FAILURE_CLASS=TRANSIENT_ZERO_ELIGIBILITY_MISREAD_AS_TERMINAL_OR_PARKABLE
FACT: REPAIR_CLASS=ELIGIBILITY_AWARE_BOUNDED_RESCAN
FACT: DEFAULT_RESCAN_INTERVAL_MINUTES=20
FACT: STRUCTURAL_INELIGIBILITY_BYPASSES_PERIODIC_RESCAN=true
FACT: GLOBAL_EXTERNAL_BLOCK_BYPASSES_PERIODIC_RESCAN=true
FACT: SINGLE_EMPTY_SCAN_PROVES_POOL_DRAINED=false

## Observation

The 2026-10-01 BA/RF/GAI/EM construction run exposed a scheduler failure mode that is distinct from a code defect: **a host can observe zero claimable work at one instant while the global task pool is still unfinished and while another host is about to create new eligible work**.

The component pool used two physical hosts and a staged eligibility rule:

```text
Development -> hosted CI green -> Correction by the other physical host -> programme integration
```

GitHub Actions then became account-level unavailable. Jobs failed in 2–4 seconds with zero executed steps. This created a mixture of temporarily unverifiable work, host-separation restrictions, and still-unclaimed Development.

At Digital-City commit `b2672fa` (2026-10-01 03:32:29 +10), Alien stopped after RF-006 Correction became code-complete but hosted CI could not start. Its handoff snapshot still contained three unclaimed Development stages. Mech subsequently claimed exactly those three:

- `d9201af` — BA-007 Development, 03:36:42 +10;
- `802d4c9` — EM-013 Development, 03:42:35 +10;
- `d4e2847` — GAI-009 Development, 03:48:00 +10.

Thus both local observations were truthful, but a one-shot scheduler could still lose concurrency. The important invariant is:

> **SNAPSHOT_EMPTY != TERMINAL_DRAIN when eligibility is time-dependent.**

## Root cause

The earlier no-idle rule defined when a host *currently* had nothing claimable, but did not distinguish:

1. **temporarily unclaimable** — another host, CI, provider, or stage transition can make work eligible later;
2. **structurally ineligible** — host-separation, permission, hardware/capability, identity, or policy makes the current host unable to claim all remaining work;
3. **globally externally blocked** — no internal host action can honestly close a remaining gate until an Owner/external condition changes;
4. **truly drained** — all work is terminal.

A single global scan was therefore being used for two different questions: “what can I do now?” and “is the system finished?”. Those are not equivalent in staged asynchronous execution.

## Scheduler repair

Future City engineering books should inherit an eligibility-aware quiescence rule:

- if no work is claimable **and unfinished work may become eligible later**, enter `TEMPORARILY_UNCLAIMABLE`, park without busy polling, and re-scan after about **20 minutes** by default;
- repeat bounded re-entry while the pool is unfinished and future eligibility remains plausible;
- if all unfinished work is structurally forbidden to this host, emit `STRUCTURALLY_INELIGIBLE` with the exact reason and do not perform periodic retry;
- if all remaining progress depends on a typed global external action such as account billing, emit `GLOBAL_EXTERNAL_BLOCK` and do not manufacture internal work;
- only `POOL_TERMINAL`/all-terminal evidence may be interpreted as global completion.

Every future dispatcher should report at least:

```text
pool_incomplete
claimable_now
potentially_claimable_later
structural_ineligibility_reason
global_external_blocker
rescan_after
terminal_reason
```

## Research value

This incident supplies a concrete systems hypothesis:

> In staged multi-agent engineering queues, replacing snapshot-based quiescence with eligibility-aware bounded re-entry should reduce premature worker retirement, owner intervention, and makespan without busy polling.

Useful future measurements:

- wall-clock programme makespan;
- host utilization and idle intervals;
- time from “zero eligible” to the next eligibility transition;
- number of premature terminal declarations;
- number of Owner/manual restarts;
- correction backlog depth;
- number of unverifiable heads accumulated during external CI outage;
- rescan count and scheduler overhead;
- programme-drain time under even spreading vs dependency-aware drain-first scheduling.

This is both paper evidence and Utopia dogfood: the scheduler itself should learn that “nothing runnable now” is a state, not automatically an ending.
