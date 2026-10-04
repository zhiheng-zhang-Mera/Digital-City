# WBC-601 review findings / 独立复核问题

Reviewer Alien-codex on physical MERA-ALIANWARE, developer Mech on MEGA-REP. Recorded original head d65dbd3af2d8903aca13726f74110e1f2f6b9b65, original CI37205291447 SUCCESS revalidated; this did not establish missing negatives.

P1: public dispatch checks endpoint readiness and only terminal task state, but omits strict-target and handoff guards. A queued task for Mech can be assigned to Alien; a running task on Mech can be reassigned to free Alien. Canonical claim had these guards; seam exposed a bypass. P2: claim returns task:null for sharing disabled or busy but readiness.ready=true; new metadata contradicts actual acceptance.

Opposite-host independent tests reproduce all three negatives at recorded source (review-red2.log). First reviewer harness used wrong default fixture IDs (Q-a/Alien vs Q-1/Mech), producing404 rather than valid defect evidence; corrected fixture and retained review-red.log as INVALID_INSTRUMENT. Do not count that first failure as product failure.

Choose direct Review/Correction within §3: only QUEUED may dispatch, apply same strict/handoff guards before assignment, make claim readiness agree with actual gates. No new scheduler/store and no change to accepted canonical claim/report decisions. Correction CI and registry backfill still pending; review_complete remains false. Raw Utopia .runtime/evidence/mission-book/WBC-601, no logs copied into City.

Correction focused23/23 pass and independent old612c344f9f2b06a67b2645b4662d97750dd7c44e Gateway vs corrected Gateway HTTP traces10/10 equivalent on startup/untargeted/holder/progress/offline strict/unknown/cancel. These are controlled canonical endpoint fixtures on opposite actual host, not a new distributed hardware campaign. Additional P2 null port threw TypeError instead of typed INVALID_BACKEND; red/green fixed. Final review correction integrates accepted main0e9bea3ce739b979e582a428af8fb233045a5e75 without conflicts: review source11e59e71a2aaf00a03bb95d1f6d6a9a600191dd0. Exact correction CI pending; developer head remains immutable d65dbd3af2d8903aca13726f74110e1f2f6b9b65.
