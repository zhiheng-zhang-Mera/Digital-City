# Alien continuation packet — REX then MON; SHOW excluded

Owner order: scan eligible REX workbooks in code order; complete the research acceptance prerequisite before MON construction. Never claim SHOW work. This is a checkpoint, not task-pool completion.

## Current task truth

- REX-801/802 COMPLETE at accepted full SHAs in canonical workbooks.
- REX-803 current workbook Mech-owned, Development incomplete and recorded head null. Alien earlier candidate is reference only after claim collision reconciliation; do not overwrite Mech claim.
- REX-804 Alien-owned candidate f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5 on rex/REX-804-Alien-codex-faults, PR #30. Hosted final CI 37397799729 / 37397794253 in progress at this checkpoint; independently query terminal status before interpreting completion. No merge authority. Formal Review needs Mech and a previously unused fault probe.
- REX-805/806/807/890 WAITING_DEPENDENCIES; accepted exact dependency heads unavailable. Do not construct speculative union baselines.
- MON-901 COMPLETE; MON-902 Mech Development complete, review unclaimed; MON-903 READY; MON-990 depends on 902/903. Their eligibility does not override Owner's REX-before-MON order.

## Zero-claim semantics

pool_incomplete: true
claimable_now_for_Alien_in_REX: 0 after current REX804 Development delivery
potentially_claimable_later: true
classification: TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
structural_ineligibility_reason: Alien cannot perform its own REX804 Formal Review
wake_condition: REX803 Development release; REX804 exact final CI; Mech review release; accepted dependency SHA propagation
rescan_after: default approximately 20 minutes while a live controller is running; this packet does not imply an installed background timer
terminal_reason: null
owner_required: false

## Resume

1. Fetch fresh Digital-City and Utopia refs; revalidate claim and exact IDs.
2. Reconcile CI at final recorded head; preserve failed/cancelled/older runs.
3. If REX803 Development released, Alien may atomically claim Formal Review at its recorded exact head, not the remembered branch tip.
4. If REX804 eligible Mech review releases, propagate accepted heads and scan REX805 next.
5. Use sync_dependency_state.py, then sync_mission_progress.py and --check after state transitions.
6. Switch to MON only once the Owner's research prerequisite is met; preserve existing MON902 claim and begin eligible role in task-code order.

Evidence: REX803/CLAIM_COLLISION_ALIEN.md; REX804/{DEVELOPMENT_REPORT,PAPER_MATERIAL_INDEX,HANDOFF_PACKET}.md; CAP-RESEARCH-FAULTS-001 candidate registry. Current findings and initial test failures remain preserved. Host identity Mera-Alianware = Alien; local critic is not second physical host.
