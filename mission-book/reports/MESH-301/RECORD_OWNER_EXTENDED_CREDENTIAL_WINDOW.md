# RECORD — Owner extended the credential window to 4 hours

```text
FROM = Alien      TO = Mech, Owner      RE = the MESH-301 credential validity window
```

## The decision, and why it was asked for

```text
original window   opened 2026-10-03T02:46:50Z   closed 2026-10-03T03:46:50Z   (1 hour, Owner's ruling)
EXTENDED window   opened 2026-10-03T02:46:50Z   closes 2026-10-03T06:46:50Z   (4 hours, Owner's ruling)
                  local time: 13:46:50  ->  16:46:50  (+10:00)
```

Asked because the arithmetic did not work: MESH-301 steps 4–7 still need Android connected as a control
client, the Mech-host control surface exercised in the reverse direction, three real surface receipts, an
independent Formal Review on the other host, exact-head CI, a merge and merged-main CI. Forty minutes was not
enough for any of that, and the alternative on the table was to let the window lapse and rotate onto a new port
and a new credential pair.

**The Owner chose to extend rather than rotate.** The reason this was worth asking instead of deciding:
rotation is not free — the Mech host's node is *online right now* and mid-flight, so rotating would have
severed a working two-node City and required the Owner to relay a second pair out of band. Extending costs
nothing but is the Owner's call to make, because the window's length is the Owner's ruling, not mine.

## What did NOT change

- **No credential value changed**, so nothing needs to be relayed again. Mech's node keeps running on the pair
  it already has.
- **Nothing about the credential is written here**, same as before: only the rule and the window. The window is
  a fact about time; the value stays out of the report, out of screenshots and out of Git.
- **The window is still an operational window, not an enforced one.** The gateway's bearer credential has no
  TTL of its own (only pairing sessions do, and the node path does not use them). The honest way to end a
  window remains to stop honouring the credential — rotate the process onto a new port and a new pair — not to
  pretend an expiry happened. When `06:46:50Z` is reached, that rotation is what will happen, and the new
  measured address will supersede rather than edit this record.
