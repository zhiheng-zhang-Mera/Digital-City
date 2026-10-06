> English reading translation / 英文阅读译本. The [original document](../README.md) remains authoritative; this translation grants no execution, claim, or migration authority.

# RIV — Review Independence v2 / Multidimensional independent-review migration

> **Status: PARKED / NOT ACTIVATED**
>
> This series preserves the migration design for a future Review Pool v2. **It does not currently change `CONSTRUCTION_RULES.md §3`: Development and Formal Review must still be performed on different physical hosts.**
>
> This directory is excluded from `PROGRESS_MANIFEST.json` and the main task counts. Every workbook has `execution_enabled=false`; these workbooks must not be claimed or used to change the current construction process.

## Objective

Develop review independence from a single machine-name constraint into an auditable multidimensional assurance profile, while preserving a safe migration path:

```text
task risk / domain
→ required independence profile
→ eligible reviewer pool
→ fresh-context review
→ evidence reconciliation
→ assurance receipt
```

Candidate independence dimensions:

- authorship / role；
- Agent / session context；
- model family；
- physical host；
- OS/runtime/environment；
- hardware/toolchain；
- evidence-source independence；
- conflict-of-interest / recusal。

**Multiple dimensions do not automatically relax the rules.** Until RIV-990 demonstrates equal or greater assurance for an alternative and the Owner explicitly authorizes migration, the existing opposite-host gate remains the minimum requirement for Engineering Formal Review.

## Workbook series

| ID | Work | Status |
|---|---|---|
| RIV-001 | Current Review Reality Audit | PARKED |
| RIV-002 | Independence Profile & Assurance Classes | PARKED |
| RIV-003 | Fresh-context Two-pass Review Protocol | PARKED |
| RIV-004 | Capability-based Reviewer Selection & Scheduler Contract | PARKED |
| RIV-990 | Controlled Acceptance + Migration Decision | PARKED |

## Boundary with DGX

DGX may declare the independence floor required for a deliberation or adjudication; RIV researches and migrates **Engineering Formal Review itself**. DGX must not use anticipated future RIV results to lower the current gate.

## Activation conditions

At minimum:

1. The Owner explicitly activates RIV;
2. Reread the then-current `CONSTRUCTION_RULES.md` and actual host and agent capabilities;
3. Do not change the assurance contract midway through an ongoing Formal Review;
4. Define a falsifiable controlled comparison for the candidate new profile;
5. Before RIV-990, do not amend the current §3 into a less restrictive rule.
