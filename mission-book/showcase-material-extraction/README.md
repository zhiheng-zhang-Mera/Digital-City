# Showcase Material Extraction Programme

> **Purpose:** produce a compact, evidence-backed Utopia showcase package for project pages and PhD outreach.
>
> **This programme is NON-PRODUCT. It must not modify Utopia source code.**

Active workbook:

- [SHOW-401 — Utopia 项目展示素材提取与双 Demo 制作](./SHOW-401-Utopia项目展示素材提取与双Demo制作.md)

Required final outputs:

1. one **main demo**: three real endpoints + targeted execution + result return;
2. one **technical demo**: guarded remote handoff of the same task across Windows workers;
3. three curated screenshots;
4. one compact results table;
5. one concise technical-message pack reusable in outreach email / README / project page;
6. a deliverable manifest binding every media item to its source run, device identities, task ids and accepted runtime baseline.

Media binaries are recorded/exported **outside the Utopia repository**. Large MP4 files are not committed to Digital-City by default. Digital-City keeps the workbook, manifests, selected safe screenshots if desired, hashes/paths, result table and final narrative.

## Hard boundary

`zhiheng-zhang-Mera/utopia` is a **read-only runtime source** for this programme.

Allowed:
- run the already-accepted product;
- inspect current main SHA / CI;
- use Web/Android product surfaces;
- use Android Studio device mirroring;
- use online meeting/screen-share software;
- create ephemeral runtime tasks, pairing sessions and local runtime data required for the demo;
- use CMD/PowerShell only as an auxiliary startup/stop/query mechanism.

Forbidden:
- edit tracked Utopia files;
- create a Utopia development branch;
- commit, merge, cherry-pick, revert or open a product PR;
- repair a defect inside this programme;
- change tests or success definitions to make a recording work;
- use terminal/process-list output as the primary evidence that the product is running.

If a real product defect blocks the planned scene, record it as a blocker and stop that scene. A separate Owner-authorized product workbook is required before Utopia code may be changed.
