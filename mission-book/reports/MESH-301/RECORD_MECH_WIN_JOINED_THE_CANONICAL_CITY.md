# RECORD — `Mech-Win` joined the canonical City (measured), and what it must now do

```text
FROM = Alien (development host of MESH-301)
TO   = Mech, Owner
RE   = MESH-301 step 2, second half: the Mech host registering into THIS City rather than only into its own
```

Mech's join record proved the launcher worked on its host, but explicitly did not prove it had joined the
canonical City. It now has. This is the measurement, taken from the City's own event stream rather than from
any surface's rendering of it.

## 1. The measurement

```text
canonical City   http://172.31.3.110:4391   cityId 22e1216b-f124-4d4a-be4a-4a280558c027

seq 2  NODE_ONLINE  {"nodeId":"Alien-Win"}
seq 3  NODE_ONLINE  {"nodeId":"Mech-Win"}        <-- the Mech host, in the Alien host's City
seq 4  NODE_OFFLINE {"nodeId":"Mech-Win"}

node record  id=Mech-Win  devicePrincipalId=Mech-Win  displayName=Mech-Win
             online=false  lastHeartbeatAt=2026-10-03T02:53:10.796Z
             agentVersion=0.2.0  platform=win32  capabilities=[task.execute.safe, filesystem.temp]
node record  id=Alien-Win devicePrincipalId=Alien-Win displayName=Alien-Win
             online=true   lastHeartbeatAt=2026-10-03T02:53:32.684Z
```

Four separate things are established by `seq 3`, none of which a report could establish on its own:

1. **The LAN path works.** The Mech host reached `172.31.3.110:4391` across subnets. The claim-time address
   was real, not a historical constant.
2. **The token relay worked and the credential is accepted.** A wrong credential is a 401 and would have
   produced no event at all.
3. **The duplicate-identity hazard did not fire.** The node is `Mech-Win`, not `Alien-Win`. The machine-side
   default identity is `Alien-Win`, so this is evidence that `CITY_NODE_ID` was set explicitly on that host —
   the hazard recorded in the step-2 record is real but was avoided, not merely warned about.
4. **The City now holds two distinct worker identities.** `Alien-Win` and `Mech-Win` have different
   `devicePrincipalId`s, which is completion-gate item 2.

## 2. What is NOT established, and I will not claim it

- **Mech is not online.** `seq 4` says its node stopped heartbeating at `02:53:10Z` (the heartbeat timeout is
  8 s). The join was a short-lived run, not a standing node. Completion-gate item 2 needs two worker nodes
  *running*, and a task cannot be strictly routed to a device that is not there.
- **No strict-target task has been exchanged.** Two identities is the prerequisite, not the result. Nothing
  has yet been routed from one host to the other.
- **Android has not appeared at all.** The Android control client has not connected to this City, so
  completion-gate items 1, 3 and 4 are untouched.
- **Step 2 is not complete.** One of three control surfaces (Alien's) is present.

## 3. What the Mech host needs to do next

The node must **stay up** for the duration of the three-end work; a node that joins for thirty seconds and
exits cannot receive a targeted task, and every later step depends on it being claimable at the moment a task
is created.

```text
instruction to Mech: re-run the node launcher and LEAVE IT RUNNING; the City is the same one
                     CITY_URL        = http://172.31.3.110:4391
                     CITY_NODE_ID    = Mech-Win
                     CITY_NODE_TOKEN = <unchanged; the Owner already relayed it>
```

If Mech's node shows the same `id=Mech-Win` on re-registration, the persisted-identity mechanism is working
as designed across a restart — which is the property the earlier kickoff record claimed and Mech correctly
measured as absent from every branch. It is now code on `mesh/MESH-301-three-end`, and this second
registration is its first cross-host test.

## 4. The credential window, and what happens when it lapses

```text
window opened  2026-10-03T02:46:50Z   (City process start)
window closes  2026-10-03T03:46:50Z
```

The gateway's bearer credential carries **no expiry of its own** — only pairing *sessions* have a TTL, and the
node path does not use pairing sessions at all. The "1 hour" is therefore an operational window, and the
honest way to end it is to stop honouring the credential: after `03:46:50Z` I will stand the City up again on
a new port with a new credential pair and re-publish the measured address (superseding, not editing, the
step-2 record). Mech will need to re-join against the new address. A three-end run that would cross the window
will be restarted rather than allowed to straddle it, because a credential that outlives its stated validity
is exactly the kind of quiet divergence this programme keeps finding.

## 5. What I am doing meanwhile

Step 3 (strict target-device routing intent) does not depend on Mech being online, so it is being implemented
and tested now rather than waited on: the route, the claim guard, the waiting/refusal vocabulary, the
no-rerouting guards and the duplicate-submit boundary. The unit and gateway tests run on one host; the
two-host and Android halves remain, and they need Mech's node up.
