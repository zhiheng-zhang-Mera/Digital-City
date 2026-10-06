# PCF-711 — Explicit checkpoints and resume compatibility

[Canonical state](../PCF-711-checkpoint-and-resume-contract.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose a checkpoint contract/service and tests/pcf711-checkpoints.test.mjs. validateCheckpoint extends the existing checkpoint gate without weakening refusal semantics.

Define explicit provider save/restore support, original task/attempt/input digest, schema and executor/runtime/model versions, completed stages, unpublished outputs and side-effect state. Publish only complete verifiable checkpoint artifacts through 709; partial or failed writes are not recoverable state.

Validate target platform/dependencies/model/data scope. Incompatible upgrades require refusal or a tested migration, not assumptions from file existence. Demonstrate interruption/resume with a real chunked CPU task whose final digest matches uninterrupted execution. Do not promise serialization of arbitrary GUI sessions, external sessions or hidden provider reasoning.

Run `node --test tests/pcf711-checkpoints.test.mjs` for partial writes, corruption, wrong task/input/executor/model, unresolved external effects, revocation and duplicate restore. Already committed results cannot publish twice. Save/read compatible artifacts across the two real workers and measure saved/wasted work without claiming arbitrary process migration.

715 exposes support/refusal and checkpoint version/location provenance, not private contents. New checkpoint providers may be children without requiring universal resume support.
