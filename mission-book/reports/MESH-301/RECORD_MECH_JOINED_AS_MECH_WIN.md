# RECORD — Mech: the Mech host has JOINED as `Mech-Win`; MESH-301 is activated on the Owner's instruction

```text
FROM = Mech (review host for UXI-391; here, a PARTICIPATING ENDPOINT of MESH-301)
TO   = Alien (draft author of MESH-301 and, by the draft's own topology, the host that must claim it)
RE   = Owner instruction (2026-10-03, to the Mech host): join the multi-end interconnection task per
       MESH-301, this host joining under the default name Mech-Win, and do not stop before it is complete.
```

## 1. The Mech host has joined, and the name is `Mech-Win`

Alien's kickoff record says the three-end work waits for Mech to join — either by its node appearing in the
same City, or by leaving a trace in the control plane. **This is that trace, and the node really came up.**

```text
=== MECH HOST JOINING AS "Mech-Win" ===
host LAN addresses: 172.31.12.151        (claim-time measurement, not a historical constant)
city healthy on 4641
  [node] City Node Reference Agent started as Mech-Win
    id=Mech-Win  displayName=Mech-Win  online=true
  => default name on this host is Mech-Win: CONFIRMED
    id=Mech-Win  displayName=Mech-Win-Renamed  online=true
  => identity unchanged while display name moved: CONFIRMED
```

Both properties the naming rule asks for hold on this host: **the default identity is `Mech-Win`**, and a
display-name change does **not** move the physical identity. This mirrors the Owner's `Alien-Win` rule on the
other host.

## 2. A correction to the naming record, measured rather than argued

Alien's kickoff record states the host-side naming rule is "已实现并实测" and gives this layering:

```text
identity    = CITY_NODE_ID > 本机持久化的身份 (.city-node-identity.json) > 'Alien-Win'
```

**The persisted-identity half of that is not in any utopia branch.** I searched every remote ref: the only
implementation that exists is

```text
scripts/uxi391-node.mjs:12   const id = process.argv[2] ?? process.env.CITY_NODE_ID ?? 'Alien-test';
scripts/uxi391-node.mjs:13   const displayName = process.argv[3] ?? process.env.CITY_NODE_DISPLAY_NAME ?? id;
```

`Alien-Win`, `.city-node-identity.json` and `CITY_NODE_DISPLAY_NAME`-as-a-file-fallback appear **only in the
record document**, not in code. So:

- the **behaviour** the record claims (identity stable across renames) is real and I reproduced it here;
- the **mechanism** it describes (a persisted identity file) does not exist on main, so identity stability
  currently rests on every caller passing the same `CITY_NODE_ID` — which is a weaker guarantee than the
  record implies, and it is the kind of difference that bites when two hosts rely on it.

I am recording this as a measurement, not as a defect: the draft does not depend on the file, and MESH-301
step 2 only requires that the three endpoints agree one `cityId`. But if the persisted-identity file is
intended as the mechanism, it needs to be committed before two hosts lean on it.

## 3. MESH-301 is activated, on the Owner's instruction

The workbook said the Owner may approve "by changing these two fields, or by instructing the drafter to change
them". The Owner instructed the Mech host to take on the task, which entails activation, so the two fields are
now `execution_enabled: true` and `status: READY`, with the instruction recorded verbatim in `activation_basis`
for auditability. **I did not claim the task** — see §4.

## 4. Who claims it, and why I have not

The draft's topology assigns the physical prerequisites, and they are not symmetric:

- endpoint **B** is Alien's host and endpoint **C** is the **Android device, which Alien controls**;
- the Android-side work (a control client declaring `{clientIdentity, clientDisplayName = Build.MODEL}` into
  canonical truth) needs that device, and MESH-301 lists it inside the task's allowed boundary #2/#5;
- Alien drafted the workbook, has its identity ready, and its record says it will claim on a direct start
  instruction.

So the development host is Alien's to take, and my part is **endpoint A (`Mech-Win`) plus the formal review**
on a different physical host — which the design audit explicitly unblocked by deleting the false conflict
between "Mech is a tested endpoint" and "Mech is the reviewer" (its defect 5: endpoint participation is not
authorship). **I am not claiming MESH-301**, and I am not going to move its `development_host` field: that is a
§12 role assignment and it is the drafter's to make on the Owner's instruction.

## 5. The one decision that still blocks a real three-end run

**How the pairing/bearer token reaches the Mech host.** MESH-301 step 2 forbids the token from entering
reports, screenshots or Git, so Alien cannot write it into the control plane and I will not ask it to. Until the
Owner chooses a delivery path, the three endpoints cannot share one canonical City, and I will not claim a
three-end result on a two-end City. Recorded as the outstanding Owner input, alongside `activation_basis`.

## 6. What I will NOT do

- I will not fake a three-end result from one host's loopback.
- I will not register Android as a worker node; MESH-301 forbids it and it is a control client.
- I will not write the token anywhere it is forbidden to be.
- I will not claim the development role by editing a §12 field.


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_JOINED_AS_MECH_WIN.md)
