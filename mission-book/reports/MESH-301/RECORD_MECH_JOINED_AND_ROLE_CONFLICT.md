# RECORD — Mech: `Mech-Win` is JOINED to the canonical City; and a ROLE CONFLICT that is the Owner's to settle

```text
FROM = Mech   TO = Owner (for the role conflict), Alien (for the join evidence)
STATE = MESH-301 step 2's worker-node half is DONE. A role conflict exists and I have NOT resolved it by force.
```

## 1. The join is done, and it is two real worker nodes in ONE City

Both credentials arrived out of band, so this host could finally register. The result, measured against the
other host's City rather than a local one:

```text
BEFORE   cityId=22e1216b-f124-4d4a-be4a-4a280558c027  nodes=1   Alien-Win online=true
AFTER    cityId=22e1216b-f124-4d4a-be4a-4a280558c027  nodes=2
           id=Alien-Win  displayName=Alien-Win  online=true
           id=Mech-Win   displayName=Mech-Win   online=true
```

So MESH-301's completion gate 2 — **Alien and Mech are two real, distinct worker nodes** — is satisfied, and the
City is the other host's (`http://172.31.3.110:4391`), not a loopback bring-up. The reachable path was measured
at claim time as the workbook demands, not carried over from an earlier task.

## 2. The credential gap is closed, and it matched Alien's own decision rule

The Owner relayed one value; the gateway needs two. Alien's record D1 had already reasoned the same thing and
chosen the rule: **control credential = the Owner's value verbatim; node credential = that value with a `-node`
suffix**, derived rather than asked for so the Owner relays one pair and no second secret has to be invented.
The node credential the Owner then supplied is exactly the `-node` form. **No token value appears in this file,
in any screenshot, or in Git** — only the rule, which is what MESH-301 step 2 requires.

Recorded because it cost a round: I first tried the one value for both roles and the Gateway answered
`Invalid pairing token` from `POST /api/v0/node/register`, while `GET /api/v0/city` accepted the same value — so
control and node credentials are separate by construction (`server.mjs auth()` compares against `nodeToken` for
node routes) and **pairing cannot substitute for the node token**, because `pairing.exchange()` returns
`credential: this.credential`, the control token. I probed the pairing route to establish that rather than
assuming it.

## 3. THE ROLE CONFLICT — I am not resolving this by force

- **Alien claimed MESH-301 as development host** at control-plane commit `f532089` ("Alien claims the three-end
  mesh at Utopia main ec12fd0 after claim-time reconciliation…"), and its Step 2 record describes itself as the
  development host. It has already stood the City up.
- **The Owner assigned development to Mech.** Asked directly which way the roles fall, the Owner selected
  "Mech is development host, Alien formally reviews", and separately instructed this host to join the task
  under the default name `Mech-Win`.

Those cannot both hold, and §2 makes claims **atomic** while §12 makes role assignment the **Owner's**. So:

- **I did NOT push a competing claim.** My local branch briefly carried one; I dropped it with
  `git reset --hard origin/main` rather than pushing it over an existing claim, and I am not editing
  `development_host`, which Alien currently holds.
- **I am not treating the Owner's answer as a reason to overwrite a field.** A verbal ruling is authority, but
  the mechanism for changing a claim is the claimant releasing it; a reviewer-host reaching in to seize it is
  the failure mode this programme has already ruled against once.

**What the Owner needs to decide:** whether Alien releases so Mech develops as ruled, or whether the ruling is
revised and Alien keeps development while Mech takes endpoint A plus the formal review. The second costs no
re-work — Alien has already done Step 2 and controls the Android device — but it is not mine to choose.

## 4. What I will do in the meantime, whichever way the roles fall

Work that is needed under **either** assignment and that belongs to no claim:

1. keep this host's `Mech-Win` node joinable and its launch parameters recorded (they are: identity via
   `CITY_NODE_ID`, City via claim-time measurement, credentials out of band);
2. record the **duplicate-identity hazard** the other host flagged and confirm this host is not a party to it;
3. prepare the three-end measurement instrument (server-`seq` convergence probes, negative controls) that both
   the development and the review halves will need, since Step 5 requires a bounded-convergence probe over the
   canonical `seq` and Step 6 requires negative controls regardless of who authors the code.

I will not start on the strict target-device routing contract until the development role is settled, because
that is the task's actual product change and writing it under a disputed claim would be exactly the
claim-collision the atomic-claim rule exists to prevent.

## 5. RESOLVED BY THE OWNER, and it is the opposite of what I asked for

Asked to settle it, the Owner **revised the earlier answer**:

```text
roles = Alien develops; Mech is endpoint A (Mech-Win) plus the formal reviewer
note  = Alien's drafting task was revised by a third party, so it is allowed to proceed and Alien is NOT to be
        treated as a duplicate participant
```

**Consequences, stated because they change my position rather than just the paperwork:**

- **There is no claim conflict to resolve, and none was pushed.** Alien's `f532089` claim stands unchallenged;
  the statement in §3 above that the two assignments "cannot both hold" was true of the answers I had been
  given, and the Owner has now made them consistent by revising the earlier one.
- **I hold no development claim and will not take one.** My dropped local claim commit stays dropped.
- **My part is endpoint A plus the formal review**, which is precisely the combination MESH-301's design audit
  legalised when it deleted its defect 5 — endpoint participation is not authorship, and the only requirement is
  that Development and Formal Review sit on different physical hosts. This host is not the development host, so
  that requirement is met by construction.
- **The 1-hour credential window and the join are unaffected**: `Mech-Win` remains a real registered worker in
  the canonical City either way, which is what MESH-301 needs from this host.

**Recorded as a correction to my own record rather than by rewriting §3**, because the sequence matters: I
reported a conflict, refused to resolve it by force, and the Owner then removed it. A record that only showed
the final state would hide the part where declining to force the claim was what kept both hosts' work intact.



[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_JOINED_AND_ROLE_CONFLICT.md)
