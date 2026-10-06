# Physical Android window 2 — no post-approval credential observed

Owner declared Mech City ready; Alien-codex re-fetched Digital-City before proceeding. Workbook still fixes development/review to b91677d1478950feb79742f618d0c981773d5bb7. Remote product branch independently resolves the same SHA, and exact CI37259528163 remains completed SUCCESS. The already installed isolated-package build from PHYSICAL_REACCEPTANCE_Alien-codex.md was reused; no new source or build identity was substituted.

Fresh app launch → CODE → Mech destination http://172.31.12.151:4391 → relay → placeholder code required by the existing R4 defect → Connect. Physical handset UI reports new approval-wait shortRef `join-eab97ea241`. Native logs record relayasking 2026-10-05T10:00:41.301720Z and relaywaiting 10:00:41.320669Z (21:00 Sydney). Mech trusted-surface approval was requested; an owner decision was not inferred from the City merely being ready.

Bounded live observation process `.runtime/watch-approval.py`, execution session90996, inspected only this test package's saved preferences for 125 seconds. No saved credential was observed, and the process terminated normally. Consequently saved City identity, member-session kind, durable installation registration, post-approval connection, restart reconnect and targeted revoke remain NOT_RUN. No token was printed or submitted to another origin.

An uncommanded UI transition occurred during the approval window: native log starts a new mdns trial/action at 10:03:13.420382Z/10:03:13.421209Z, and the foreground UI shows LAN discovery with the Alien City row. Root tool history contains no LAN tap after request submission. The source defines LAN as an action handler rather than an automatic approval transition, but the actual actor/cause has not been established. This is an uncontrolled observation window, not proof that the user or Mech automation caused it. A later retry event at 10:03:42.617643Z is tagged with the changed mdns trial; do not treat mixed trial labels as independent successful onboarding evidence. No relayapproved/relayJoin event was recorded in the captured boundaries.

Phone automation taps stopped pending clarification of concurrent operation/state reset; no existing Gateway was stopped and no owner/global token was revoked. This window is not accepted; original review defects and withheld terminal marker remain. Need a coordinated fresh request with actual owner approval and exclusive handset interaction before the post-approval chain can be evaluated.

Artifacts: evidence/round2-request.xml, evidence/round2-final-ui.xml, evidence/round2-native-boundaries.json. Password text is redacted in XML, and native boundary records contain only trial/mode/event/time/count fields. Source/build/private-backup identity remains as explicitly bound in the first physical report.

语言配对 / Language pair: [English](./PHYSICAL_WINDOW2_Alien-codex.md) · [中文](./zh-CN/PHYSICAL_WINDOW2_Alien-codex.md)
