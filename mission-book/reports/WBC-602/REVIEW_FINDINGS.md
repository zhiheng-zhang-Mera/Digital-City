# WBC-602 independent opposite-host findings

Reviewer Alien-codex on MERA-ALIANWARE; developer Mech on MEGA-REP. Original c312a60b4d73f02597bde1f106372b253067fe33 / originalCI37206331839 success independently verified. Correction d99101fdac5169aad74ae84fb7c0c25be43ad7d9 pushed; CI37211820065 in progress. No WBC601 sibling merge or REX802 import.

Independent root tests: original13/13 pass; five new adversarial tests5/5 FAIL before correction, then18/18 PASS including originals. Technical critique discovered one additional constructor inconsistency; new red then19/19 PASS. These are root physical review observations; same-host child critique is additional technical review only.

| Finding | Reproduction | Correction |
|---|---|---|
| P2 unknown hardware | no GPU data projected NODE_REPORTS_NONE/UNSUPPORTED; missing network projected false | UNKNOWN/null unless explicit hardware report; liveness hints use observed canonical online flag |
| P2 requirement fit | Windows satisfied linux platform constraint; measured GPU count0 satisfied accelerator request | PLATFORM_MISMATCH/PLATFORM_UNKNOWN and ACCELERATOR_UNAVAILABLE versus UNKNOWN |
| P2 malformed requirements | strings split into capability characters, null caused untyped exceptions | bounded string arrays / supported minima mapping / typed INVALID_REQUIREMENTS |
| P2 busy readiness | assigned worker remained acceptingWork=true while claim returnsnull | use canonical nonterminal assigned tasks; ENDPOINT_BUSY; no scheduler rewrite |
| P2 declared role loss | HTTP registration discarded EXECUTION_NODE+VALIDATION_NODE; restart could not restore | validate optional worker roles against vocabulary and require actual worker EXEC, persist on canonical record, preserve omitted role legacy reconnect |
| P2 constructor role invariant | roles string/empty silently became declared execution identity; factory created validator-invalid descriptor | reject explicit malformed arrays; derive omitted execution flag from validated roles; enforce flag/role agreement |

Controlled actual Gateway HTTP comparison against separate accepted baseline0e9bea3ce739b979e582a428af8fb233045a5e75:10/10 equivalent startup/old task claim/report/wrong-holder/progress/complete/strict offline/correct holder/unknown target/cancel. Targeted broader34/34 before final constructor correction; final19/19 plus rerun HTTP10/10 after correction. Bilingual fact checker SYNCHRONIZED. Receipt utopia:evidence/raw/mission-book/WBC-602/review-receipt.json. No new distributed-hardware or GPU performance claim. Optional declarative validation role does not infer host certification or authority from Windows/Alien/Mech names.

City ownership PRIMARY/MEMBER is separate from execution capability roles. This correction does not appoint or migrate a primary City agent. User-requested future City agent selection remains independently tracked CITY-ROLE-20261005.

Final Formal PASS/terminal marker withheld until exact final CI and Capability Registry reconciliation. merge_authority=false.

语言配对 / Language pair: [English](./REVIEW_FINDINGS.md) · [中文](./zh-CN/REVIEW_FINDINGS.md)
