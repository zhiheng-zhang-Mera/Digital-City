# City roles and device-list development log

Reading translation / 阅读译本：Complete reading translation of the historical source, not a second authoritative record. All evidence, historical failures, and acceptance limits remain unchanged.

- Date: 2026-10-05; recorder: Alien-codex.
- User issue: after a successful connection, the device list did not correctly express multiple hosts in one City. The local device should be first; other devices should use their enrollment names. There was a historical occurrence of duplicate Cities on the same host.
- Role requirement: the primary City agent must not be fixed to Alien or any other device; the user will choose it later. A new host that has not joined another City has its own primary City by default. After successful joining, only that host becomes a member; the destination network's existing primary remains unchanged. Failure or lack of approval must not demote the host.
- A joined host should restore its member role after restart, avoiding a second independent primary City. Each host should run at most one City.
- Current investigation: local demotion and member-role persistence code has merged. Installed-version, device-list, and role-display consistency still require inspection; the existence of code alone cannot establish resolution of the field issue.
- Repair order: recheck role isolation; locate device-list identity mapping; inspect enrollment naming and defaults; verify communication and existing compute-resource entry points. Agent appointment/migration authorization and lifecycle require separate explicit implementation; changing a device label must not be called primary-City migration.
- Experiment status: this recheck has not yet run; real multi-physical-host verification NOT_RUN. No performance improvement or cross-region remote sign-in is claimed.

## Results of this recheck

- Source inspected: Utopia `3bab6bdc78c18467645f3fb88272dab7a86f8a0d` (repair branch merged into main).
- Command: `node --test tests/host-member-role.test.mjs tests/city-members.test.mjs tests/city-members-ui.test.mjs`; result 11/11 PASS.
- Observations: successful enrollment closes only the local old Gateway/worker, retaining the destination primary as PRIMARY. Failure or busy local tasks do not demote the host. Member role persists through restart. Same-City devices use enrollment names and the local device is first. Member messages carry receipt acknowledgements. Another member actually executes the test task, and stops claiming after sharing is disabled and enrollment revoked.
- Boundary: these are controlled local Gateway/browser/worker tests. They do not replace measurements on two physical hosts, and do not verify user appointment of the primary agent or migration while running.
- Current gap: default primary and local demotion are implemented. This evidence cannot declare “the user later appoints the primary City agent” complete. Appointment, authorization, and agent lifecycle must be a separate feature, preserving the current network primary.

## Device execution entry-point repair progress

- CEX-702 is under development: expose the existing backend switch-declined → another-device handoff path as explicit user choices on Web/Android, prohibiting client-side device ranking.
- A candidate compute-device check that ignored “stop sharing” was found and repaired. Conflicting switches for a rejected specified-device task, expired decisions, and no available device are refused; existing primary-City role is preserved.
- Three controlled Gateway/browser/worker tests passed; B completed the real task and the result returned to the original Web page. All 47 older scheduler compatibility tests passed. Not deployed to the installed version; two-physical-host verification and user appointment of the primary agent remain NOT_RUN / not implemented.
- Detailed issues and reasoning: ../CEX-702/DEVELOPMENT_LOG.md. Exact SHA/CI, capability registration, and formal review from another host are still needed.

## Android member-management candidate

- CEX-705 / PR21, exact source `de9185a4ef8d761053c88316ec9efeca037239fb`: all same-City members use their enrollment names; enrolled local device first. Member online, compute online, and resource sharing are shown separately. Joining the same City does not rewrite the destination primary role.
- 87 Android unit tests/build and 8 final backend tests passed. On OPPO, local-first order, another member's name, and server RECEIVED following native message confirmation were observed. The other member was a controlled program on the same host; two-physical-host verification NOT_RUN.
- Installation-list authorization requires consistent City/installation/device bindings and refuses missing/duplicate identities. Owner control represents City-host authority, not the phone's local identity. Two technical-review issues were repaired and regression checked.
- CI37218345150 is still running; formal opposite-host review pending. Physical native verification of rename, revoke, sharing toggle, and send remains pending. The field application/private connection was restored and the running City was unchanged.
- Later user appointment/migration of the primary agent still requires independent implementation. This display or execution-choice work is not completed migration.

## Member-management physical follow-up

- Exact CEX705 source `de9185a4ef8d761053c88316ec9efeca037239fb` / APK `a13b0727b225c9aa20c16defc0b4ed89cfd90da739969974156ccb657bec07ae`; no source modification and no replacement of verified CI identity.
- OPPO native operations observed: pause/resume sharing, send message and show confirmed receipt, identity preserved after Session restart, management of only the local device with rename disabled, old session401 after self-revoke, and Owner rename/revoke of another installation. Rename did not change PRIMARY; no agent appointment/migration occurred.
- Earlier NOT_RUN values for these actions were updated only within the observed follow-up scope. Details and raw UI hashes: ../CEX-705/PHYSICAL_FOLLOWUP.json. Same-host logical members/compute advertisements cannot serve as two-physical-host or Android compute-execution evidence. Original application/private connection restored; running City unchanged.

2026-10-05: City-neutral pairing lockout wording PR23 merged at d3262ce after exact-head attempt2 and PR checks success; attempt1 timeout retained with unresolved full-suite timing attribution. Main CI pending. CEX703 native catalog physical defect logged before repair; full-width title/short status/full reason fixed and OPPO selection remains no-task. Primary default/self-only demotion semantics unchanged; future user-appointed primary migration remains NOT_IMPLEMENTED, rename does not appoint an agent.

Role boundary revalidated at exact pointfix source `a7d6f2a9b97e02d5fd10adf3a73eafb4a5f3ef6e`: host-member-role + city-members + city-members-ui 11/11 PASS. Observed controlled native production local Gateway/worker retirement and target PRIMARY preservation; restart keeps MEMBER/original City pointer. This is controlled integration evidence, not double-physical-host acceptance.

PR23 merged-main `d3262ce2dd81e51a53e39e6f9add8dee650a7682` CI37222674520 terminal SUCCESS. Sourcea7d6f2a is retained by verified cloud archive tag; remote head removed with exact-SHA lease after ancestry verification. CEX703 source478d486 exact CI and all PR checks SUCCESS; opposite physical-host Formal Review remains pending.

语言配对 / Language pair: [原文 / Source](../DEVELOPMENT_LOG.md)
