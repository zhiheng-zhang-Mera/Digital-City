# PCF-700 Development report

```text
TASK_ID            PCF-700  Ownership, call-chain and compatibility reality audit
PROGRAMME          PERSONAL_COMPUTE_FABRIC
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech (COMPUTERNAME MEGA-REP; role Mech-DS, development side)
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit
SERIES BRANCH      pcf/series-mech (= d611cfe, the series' accumulated head)
BASELINE_SHA       312b627b54af5bbf274fa25eca8f8383869c1c34  (= origin/main; see CLAIM_REPORT.md)
HEAD_SHA           d611cfe5f0272673706b9dc5c9f6b85ed40a9406
CI                 V0.2 checks run 37497553367 (see "CI status" below)
DELIVERABLES       docs/zh-CN/pcf/ownership-map.md, docs/en/pcf/ownership-map.md,
                   tests/pcf700-compatibility.test.mjs
REVIEW             review_host = null (waiting for the other physical host; this host never self-reviews)
```

> Reading translation of the Chinese report beside it. The Chinese file is the record of authorship; this mirror keeps
> the same facts, the same failures and the same unfinished list.

## 1. Deliverables and what was actually measured

`docs/{zh-CN,en}/pcf/ownership-map.md` (mirrored) freezes three things:

```text
reuse/extend/missing table   every reuse point carries all five layers: declaration, caller, live API, user surface,
                             exact evidence. Example: STRICT_TARGET_FIELD in targeting.mjs:30 is used by
                             standard-devices.mjs INSIDE the claim path, so "the function is exported" is not
                             "the seam is enabled".
nine interfaces / eight types MEASURED: none of the nine candidate interfaces in ARCHITECTURE section 4 exists at
                             312b627. Two names are occupied by other domains - observeResources (EM Foreman) and
                             admit (capability routing) - so they are NAME COLLISIONS, not reuse points. Every one of
                             the eight shared types is absent too, so they must be created under
                             contracts/personal-compute-fabric-v1/; this round created NONE of them.
three wiring layers          (1) profile switching is LIVE_WIRED (built at server.mjs:503, routes :963/:967,
                             snapshot :718); (2) chooseHybridTarget (execution-profile.mjs:166) is NOT_WIRED -
                             the gateway has no call site and only the WBC-604 tests call it, so C6 freezes that as an
                             assertion; (3) the strict target really is wired into the live claim path
                             (classifyTarget / withheldTasks / claimAllowedByTarget in standard-devices.mjs) and C3
                             verifies it through a real HTTP claim.
single writer / no new DB    server.mjs is the only writer of routes and controller construction, store.mjs the only
                             writer of canonical task/action/device/event truth, node-descriptor-v1 the only writer of
                             descriptor fields; after a bare City starts, no pcf-named state exists in the data
                             directory, and repo-wide the string personal-compute-fabric appears only in mission-book
                             planning files and docs.
```

`tests/pcf700-compatibility.test.mjs`: **7/7 green** (re-run immediately before the commit; 1.06 s), covering C1-C7.

## 2. This round's own instrument errors (recorded, not hidden)

```text
E1  assumed POST /api/v0/tasks could carry targetDeviceRef - it accepts only type and returns 400
    "Choose a supported safe task type; parameters are not accepted"
E2  assumed the withheld row's field was id and its reason was UNKNOWN - they are taskId and STRICT_TARGET_BOUND
E3  assumed classifyTarget returns {ok} - it returns {state, claimable, reason}
E4  (minor) assumed POST /api/v0/node/register accepts a legacy descriptor - it returns 400 without capabilities,
    while roles stays optional
```

All four live in the test comments and in section 6 of the ownership map: the probes were falsified first.

## 3. Judgement calls where nothing was specified (reasoning recorded)

```text
J1  How should the series branch accumulate? Chosen: a FAST-FORWARD push (pcf/series-mech: 312b627 -> d611cfe)
    rather than a merge commit. Only one task exists in the series so far, and whether this work counts as accepted
    is the owner's merge ruling after review; adding a merge object now would only create history to explain later.
    Recorded here so a reviewer can overturn it.
J2  Where do report mirrors go? The directory's existing CLAIM_REPORT.md is bilingual in one file, so this
    DEVELOPMENT_REPORT.md follows that form and an English mirror sits in en/; it does not go into zh-CN/, which would
    clash with the existing file's form (the clash itself is recorded here).
J3  Claim PCF-701 immediately after finishing one task? NO - blocked by the rules, not by preference: PCF-701..728 all
    depend (directly or transitively) on PCF-700, and PCF-701's READY requires the dependency to be status=COMPLETE
    (consistency rule 4, READY_WITH_UNACCEPTED_DEPENDENCY). PCF-700 has review_host=null and the formal review must be
    done by the other physical host (section 3 forbids self-review). The series' single critical path is therefore the
    opposite-host review of PCF-700, not another claim. This is ISOMORPHIC to what stalled the REX series for 15
    rounds, so it is raised as an explicit problem rather than excused by a local exception.
J4  Build the nine PCF interfaces while we are here? NO. This workbook is an audit and compatibility contract, and its
    section 7 lists what is unfinished; implementing interfaces without workbook authority would widen scope by
    pretending an audit is an implementation.
```

## 4. Boundaries not crossed (written down rather than assumed)

```text
no purchase, no paid service; no system-service installation; no running-profile change; no remote-execution enabling;
merge_authority stays false (the series branch only accumulates; the merge ruling belongs to the owner);
the resident City (pid 44088, 172.31.12.151:4391) was not touched by PCF work; this host does not review its own output.
```

## 5. CI status

```text
V0.2 checks run 37497553367  head=d611cfe  status=in_progress at report time
V0.2 checks run 37496389297  head=312b627  completed / success (the baseline head; both jobs green)
local evidence: node --test tests/pcf700-compatibility.test.mjs => 7 tests / 7 pass / 0 fail
```

The CI conclusion is whatever the repository's Actions says; this report never writes "pushed" as "verified".

## 6. Next (for the next round or the opposite-host review)

```text
a opposite-host independent review: walk sample call chains on both hosts for the TWO_HOST_VERIFIED tier;
  this host does not substitute for that step
b the five-tier check of specification revision 2 (EM connector/Foreman, RF, GAI, WBC, origin tooling) - so far only
  the existence of the contract directories has been measured
c the per-file UI->backend dependency matrix and a machine-readable single-writer list
d the "accepted EM/RF/GAI components vs the PCF reuse boundary" table
```

Section 7 of `ownership-map.md` says the same thing: `UNKNOWN` is a conclusion there, not a blank.
