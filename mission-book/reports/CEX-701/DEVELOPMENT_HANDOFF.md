# CEX-701 Development handoff / 开发交接

Exact implementation: a24c04401308b11548626239e8ca1f9b4276bbdf, baseline40e18db4a6cf5bba1490181a473bc62e681edb8a. PR https://github.com/zhiheng-zhang-Mera/utopia/pull/14. CI https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37206760171 SUCCESS at exact source; Android and gateway-web jobs passed. Web17/17 local; independent technical review3/3 no residual blocker. Android84/84, APK build and physical offline Settings observed; installed APK hash matched.

Web Settings: explicit UNBOUND logical-device selection and owner proof; canonical rebind; clone reasons without fingerprint; no automatic identity selection/deletion; owner revoke/member self scope. Owner→member credential switch clears stale roster and recovery confirmations. Android 更多→设置→设备恢复 gives owner-Web approval guidance, credential-free link and reconnect action. Native connected recovery NOT_RUN.

Independent opposite physical host must construct UNBOUND/rebind/wrong-proof/clone/session-other-rebind/self-revoke/owner-other-revoke and exercise browser flow; check native guidance and Registry candidate. Local technical agents are not Formal Review. review_complete=false, merge_authority=false; terminal marker withheld.

Capability candidate CAP-IDENTITY-001 at capability-registry/records/CAP-IDENTITY-001.yaml: Web runtime/backend observed, Android offline reachability partial, end-to-end intent acceptance pending. Fresh rules §14C reconciled before developer handoff.

Observed failures retained in PAPER_MATERIAL_INDEX and ignored Utopia runtime; no public-performance or remote-login guarantee inferred. Research checkpoint CONTEXT_LIFECYCLE.md records observed compaction and exact-state refresh; metrics unavailable remain NOT_OBSERVABLE.
