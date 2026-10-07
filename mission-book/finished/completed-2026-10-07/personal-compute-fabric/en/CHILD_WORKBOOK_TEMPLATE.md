# Child workbook template (documentation, not claimable work)

[中文](../CHILD_WORKBOOK_TEMPLATE.md) · [Activation/extension rules](ACTIVATION_AND_EXTENSION.md)

This template has no frontmatter and is excluded from task statistics. Allocate an unused PCF-725–789 ID and preserve parent history. Without explicit activation, the child stays parked.

Before creating a child, record the originating measured finding or Owner requirement; parent ID and whether the parent retains an independent deliverable or becomes GROUP_ONLY; scope delta; NEXT_RELEASE by default; consumed/produced interfaces and shared-file ownership; hardware, resource budgets, data/permission/spending gates; and falsifiable component/product acceptance.

Copy the proposed frontmatter from the Chinese template into the canonical root workbook, replacing all template placeholders. Keep execution_enabled=false, owner activation required, empty baseline/dependency SHAs and null claim/review/CI fields. Assign no inherited credentials, budget or merge authority.

The body must specify goal/non-goals and parent boundaries; verified or proposed file paths and versioned interfaces; bounded red/green/review steps; success and adversarial cases including stale/missing data, races, revoked access, failures/cancellation/restarts, malformed inputs and resource/log limits; discoverable UI/backend wiring, disclosure and capability evidence; external/hardware seams and acceptance owners; and different-physical-host review with exact SHA/CI and bounded reports.

INTERNAL_ONLY is the sole full UI exemption and needs a concrete reason. NOT_RUN or DEFERRED is not PASS. Inherit the shared execution contract.

After planning, update the English mirror without frontmatter and PROGRAMME_MANIFEST. Only explicit activation adds the exact selected member set to PROGRESS_MANIFEST after dependency-parser compatibility is verified. Children never silently expand a frozen release or acquire parent authority.
