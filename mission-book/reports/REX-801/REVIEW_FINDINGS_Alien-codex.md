# Alien-codex independent REX-801 review findings

Reviewed original Mech development8f8c521fc299d622093776615b653457d8833f96 on opposite physical MERA-ALIANWARE. Branch tip ef89e917 is NOT substituted for that source. Existing contract9 / Gateway+feature9 tests passed independently. New independent HTTP negatives and restart seed sequence cover malformed/unknown capability/impossible topology/conflicting variables/duplicate experiment id; no tasks created.

P1 PROVENANCE_RELATION_MISMATCH: softwareRefs=[utopia@main] alone is accepted as validation.ok=true. Parsing labels as exact=false does not enforce the manifest's exact software/config provenance gate. Raw independent-review-red2.log genuinely reproduces this after fixing our initial invalid worker/host fixture. Correction rejects movable refs and requires at least one full commit anchor; explicit supplementary component versions remain labels.

P1 TOPOLOGY_IMPOSSIBLE: hosts=[host-a,host-a] / workers=[host-a,host-a] pass TWO_HOST_MESH via array length. One repeated identity is not two physical hosts. Raw red3 reproduces; correction refuses duplicate host/worker/control-surface references.

EXPOSURE_BACKEND_NOT_READY: no ordinary user entry before correction, despite DIRECT_CONTROL / exposure gate PASS being a task completion requirement. Developer explicitly documented missing presentation; do not treat API vocabulary as visible UI. Choice: add thinnest Web Advanced Research entry to list/inspect/import authored JSON/validate/register canonical manifests. REX807 still owns fuller research workflow/progressive disclosure. No experiment runner/fault permission/measurement defaults added.

Controlled real browser tests now traverse navigation→import→validate(no registration)→register→inspect→invalid branch refusal→draft retention→disconnect disables actions. Canonical tasks remain0. Screenshot initially exposed default narrow textarea and huge duplicate response vocabulary; repair full-width editor and bounded compact result, preserve vocabulary in details. This is ordinary Playwright browser execution, not an actual physical workload/topology demonstration.

Original exact source remains historical. Corrections live on review/REX-801-Alien-codex, not Mech's source branch. Final corrected candidate SHA/CI pending; review_complete=false until gates and technical correction review pass. Preserve original development evidence and use explicit source→corrected acceptance relation.
