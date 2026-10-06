# Paper material — control-plane state reconciliation lag after external recovery

FACT: INCIDENT_ID=CONTROL-PLANE-STATE-RECONCILIATION-LAG-2026-10-01
FACT: TRIGGER=GITHUB_ACTIONS_BILLING_RECOVERY
FACT: FAILURE_CLASS=CONTROL_PLANE_STATE_RECONCILIATION_LAG
FACT: REPAIR_CLASS=AUTHORITATIVE_EXTERNAL_STATE_RECONCILIATION
FACT: DEVELOPMENT_GREEN_AFTER_RECOVERY=41/41
FACT: CORRECTION_COMPLETE_AT_RECONCILIATION=36/41
FACT: STALE_DEVELOPMENT_TASKS=5
FACT: STALE_TASK_IDS=BA-007,BA-009,GAI-009,EM-012,EM-013
FACT: STALE_DASHBOARD=true
FACT: EVIDENCE_POINTER_MISMATCHES=1
FACT: GAI005_WRONG_RUN=36746849199
FACT: GAI005_CORRECT_RUN=36746845955
FACT: REMOTE_FABRIC_COMPONENT_POOL_DRAINED=true
FACT: REQUIRED_EVIDENCE_BINDING=BRANCH+HEAD_SHA+CONCLUSION

## Observation

The GitHub Actions billing outage was repaired and the previously blocked runs were successfully re-run on their exact implementation heads. Execution truth therefore advanced, but the control repository did not automatically advance with it.

Five Development task workbooks continued to say `BLOCKED_GITHUB_ACCOUNT_BILLING` after their referenced runs had become successful. The Mission Book dashboard still showed the pre-construction `READY / all unclaimed` snapshot. Separately, GAI-005's Correction frontmatter referenced a green run from RF-009 instead of GAI-005's own green run.

The result was not a product-code failure. It was **cross-system state divergence**:

```text
GitHub Actions / Utopia execution truth = recovered and green
Digital-City scheduling truth           = stale blocker / stale dashboard
one evidence pointer                    = green but belongs to another task
```

If a scheduler trusted only the stale City snapshot, it could incorrectly suppress eligible Corrections or fail to wake programme integration even though the real execution gate had already opened.

## Root cause

The control plane was updated primarily by worker commits. External state transitions, especially a re-run caused by an Owner/account recovery action, can occur without the worker that originally wrote the blocker performing another City commit.

The system therefore lacked a mandatory **reconciliation edge** from external authoritative state back into canonical scheduling metadata.

A second issue was provenance validation: a green run ID was treated as sufficient evidence without requiring that the run also match the task's branch and exact head SHA.

## Repair

The learned rule is:

> External recovery is not complete until control metadata is reconciled from authoritative evidence.

Mandatory evidence binding is now:

```text
task branch == run head_branch
task head   == run head_sha
required stage terminal state == run conclusion/status
```

Reconciliation is required after external blocker recovery and before pool-drain, merge-workbook creation, or terminal declarations. Stale blocker fields are repaired while historical failed/blocked runs remain preserved as evidence.

## Research value

This incident supports a broader systems hypothesis:

> In asynchronous engineering control planes, event-driven worker updates alone are insufficient when external evidence can transition out-of-band; periodic/event-triggered authoritative reconciliation reduces false blocking, false eligibility decisions, and provenance misattribution.

Useful measurements include recovery-to-reconciliation lag, stale task count, stale blocker duration, false scheduler ineligibility, evidence-pointer mismatch rate, and the number of unnecessary Owner interventions caused by stale control metadata.

---

语言配对 / Language pair: [中文 / Chinese](../zh-CN/CONTROL_PLANE_STATE_RECONCILIATION_LAG_2026-10-01.md) · [English](../en/CONTROL_PLANE_STATE_RECONCILIATION_LAG_2026-10-01.md)
