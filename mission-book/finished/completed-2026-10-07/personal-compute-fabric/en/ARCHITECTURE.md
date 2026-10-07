# PCF architecture and contracts

[中文](../ARCHITECTURE.md) · [Index](README.md)

## Chosen approach

Extend WBC with an incremental resource/execution service. Do not replace the OS, create another task database, or require Kubernetes/Ray for startup. External backends remain optional adapters. Establish deterministic policy and live evaluation before learned optimization.

Flow: App/Agent → canonical Action/Task → WorkloadEnvelope → effective policy → observations/estimates → placement proposal → atomic admission → WBC backend → authorized executor → canonical result → origin surface. Execution pipelines are explicit stage/data graphs, not DGX semantic reasoning graphs or shared hidden reasoning.

## Ownership

City core owns Task/Action/Attention and transitions. Existing Remote Fabric and registries own identities, trust and transport. GAI owns provider/channel semantics and spending approval. Engineering Manager/FR owns engineering goals and review/repair. PCF owns bounded resource observations, proposals and reservations linked to canonical state. REX owns experiment execution and artifacts. Monitor is a discardable projection.

Candidate source roots are contracts/personal-compute-fabric-v1/ and services/personal-compute-fabric/. Preserve existing execution-backend and headless-agent ownership. PCF-700 confirms mappings; this document does not authorize source creation.

## Shared types

ResourceObservation carries node/installation/boot identity, sequence, observation/receipt times, TTL, source, unit, value, presence, freshness and quality. KNOWN/UNKNOWN/UNSUPPORTED is independent of FRESH/STALE/UNKNOWN. Estimates are separate from measurements. Unknown or stale never means zero capacity.

WorkloadEnvelope references canonical taskId/actionId, originSurfaceRef, workloadKind, versioned executor, input ArtifactRefs, capabilities, platform/resources, QoS/deadline, privacy scope, consent, retry safety and checkpoint contract. Preserve targetDeviceRef. Never repurpose providerRef or handoffTargetRef. QoS is INTERACTIVE, SOFT_DEADLINE, BATCH or BACKGROUND, not an unmeasured hard-real-time promise.

EffectivePolicy includes version, allowed endpoints, explicit data scope, budget grant, expiry/revocation version, local-first, fallbacks, quota and foreground protection. Distinguish ORIGIN_DEVICE_ONLY, TRUSTED_PERSONAL_FABRIC and APPROVED_CLOUD.

PlacementProposal contains decision/task/state/policy versions, referenced observations, candidate rejection reasons, selected node, execution plan, estimate intervals and expiry. It is pure: eligibility, trust, authorization, data boundaries and strict targeting precede soft optimization.

ReservationReceipt carries reservation/attempt/task/node IDs, resource vector, owner epoch, expiry, state version and commit token. Competing requests cannot both acquire the last unit. Logical reservation is not OS isolation.

AttemptReceipt preserves task/action identity across new attempts and records decision, reservation, executor, input digest, fence epoch, outcome and side-effect state. CheckpointRef/ArtifactRef include opaque identity, digest, compatibility, originating attempt, data scope, authorized locations, size and expiry. Metadata is protected; a digest grants no access.

## Interfaces

701 observeResources(sample, context) returns ResourceObservation; 706 resolveEffectivePolicy(request, authorityFacts) returns EffectivePolicy or Refusal; 708 normalizeWorkload(canonicalTask, extension) preserves legacy semantics; 702 planPlacement({workload, observations, policy, estimates}) returns a pure PlacementProposal; 704 admit(proposal, expectedVersion) returns a serialized ReservationReceipt; 709 resolveArtifact(ref, principal, destination) returns an authorized TransferPlan; 710 executeAttempt(envelope, reservation, controls) returns a real AttemptReceipt; 711 validateCheckpoint(ref, targetEnvironment) returns a compatibility decision; 712 reconcileExecution(canonicalSnapshot, observations) proposes actions.

These are proposed interfaces, not claims about the existing Store. Admission requires serialization/transactional primitives under the existing canonical owner, not a separate PCF task database.

## Authorization and recovery

Revalidate consent at dispatch, data transfer, execution start and result publication. Preserve local-first, explicit API spending approval and strict targets. Preauthorization is valid only for the Owner's specified endpoints, budget and duration.

Lease expiry does not prove the old executor stopped. Epoch fencing prevents stale canonical commits but cannot undo external side effects. Distinguish retry-safe, checkpoint-resumable, non-retryable and SIDE_EFFECT_UNKNOWN work; quarantine and reconcile uncertain effects. Do not promise generic exactly-once execution.

Migrate tasks or explicit checkpoints, not arbitrary processes, GUI sessions or VMs. Require compatible executors and inputs, authorization, migration benefit, cooldown and retry budgets. Strict targets remain bound without new approval.

## Concurrent and persistent execution

Admission precedes execution; queues and streams have explicit limits, fairness, backpressure, deadlines and cancellation. Account for observations, existing reservations and freshness. Foreground protection uses quotas and supported cooperative degradation, not arbitrary termination of games or system processes. Shared accelerators must not leak private application state.

712 supervises execution, not FR engineering semantics. 716 provides unattended operation without browser or interactive login. V1 controller failure is fail-closed; worker recovery is not controller HA.

## Exposure and evidence

Show reasons/resources in task/device details; provide sharing, drain, profiles, quotas and consent as real controls. Hide raw telemetry/epochs only behind Technical Details, never hide active risk or unknown state. Use normal Web/Android paths.

Plans do not create verified capability inventory. Component contract review is not live product acceptance. Unwired exposure stays disabled and remains a required release seam. Existing global exposure rules take precedence.

## Reference boundary

Atomic grouped reservation and thermal adaptation are established mechanisms, not PCF novelty claims. These references do not mandate adopting their frameworks. Refresh related work before publication.

- https://docs.ray.io/en/latest/ray-core/scheduling/placement-group.html
- https://developer.android.com/stories/games/lineagew-adpf
