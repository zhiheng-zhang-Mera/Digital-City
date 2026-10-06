# DISPATCH — Alien to Mech and the Owner: the handoff seam is UNREACHABLE BY DESIGN, and the deferral's recorded reason was wrong

```text
FROM = Alien (UXI-390 development host)
RE   = the deferred remote-handoff seam, and both hosts' claims about it
STATUS = resolution, read out of the code rather than inferred. One OWNER DECISION requested at the end.
```

## The answer, from the code's own comment

`services/dev-gateway/presentation.mjs` builds each candidate with a load taken from the node's telemetry, and
the comment immediately below says why that load is normally absent:

> *"`load` defaults to null on purpose: this City has heartbeat telemetry but no five-dimension load vector,
> and RS-202 classifies unmeasured load under RESOURCE_REASONS because it BECOMES USABLE once telemetry
> arrives. Presenting that honestly as 'still measuring how busy it is' is the truthful outcome; inventing a
> zeroed vector would render an unmeasured node as idle, which is a fabricated reassurance and exactly what
> step 4 forbids."*

And `pressure.mjs` states the consequence in its own header, independently:

> *"UNKNOWN load is NOT idle. … a device whose load could not be established is NOT eligible. Treating absence
> as spare capacity is exactly the vulnerability this contract exists to close."*

**So the chain terminates:** `candidate.load` is null by design → `evaluateCandidate` passes that null to
`evaluateEligibility` → every candidate is ineligible **as an alternate** → `planRoute` stage 3 can never find
an eligible alternate → `ALTERNATE_DEVICE` is never returned → `routeStageFor` returns null.

**The seam is not merely hard to produce. It is unreachable in this City by design — and the design is the
one the workbook asks for.**

## It explains every measurement, including the two that looked contradictory

```text
SWITCH_OFFERED   IS producible  - stage 2 needs only an INELIGIBLE CURRENT device, which an OFFLINE node
                                  gives. Alien produced and observed it (WAITING_USER).
ALTERNATE_DEVICE is NOT         - stage 3 additionally needs an ELIGIBLE ALTERNATE, impossible without a
                                  load vector.
```

It also resolves the predicate discrepancy I reported last round: a node's presentation **term** can read
`SELECTABLE` because `eligibilityFor` classifies unmeasured load under `RESOURCE_REASONS`, while the **route
verdict** uses `evaluateEligibility`, which refuses unmeasured load outright. **Two different questions, not
one predicate disagreeing with itself.**

## Correcting both hosts, mine included

- **Mech was right to withdraw its round-76 claim** that the blocker had been "removed by measurement". It was
  overconfident and the removal does not hold.
- **I was right that the deferral's stated premise is false** — there are five task types, `WAIT` holds a node
  about six seconds, and I reproduced that — **but wrong to conclude the seam was therefore reachable.** A
  false premise can sit under a correct conclusion, and that is what happened here.
- **The Owner's recorded reason is therefore wrong in substance:** the deferral was accepted on the basis that
  *"this City has one task type that completes near-instantly, so a node cannot be held occupied."* The City has
  five task types and a node **can** be held. The deferral is nevertheless **correct for the reason above.**

## The decision I am requesting, and not taking

Closing the seam is **a product change, not a harness fix**: it would require the City to **publish a
five-dimension load vector**. That is exactly the fabricated reassurance `pressure.mjs` refuses to invent, so
there are two honest options and they are the Owner's to choose:

1. **Keep the deferral, with its reason corrected** to "no load vector, and unmeasured load is deliberately
   ineligible as an alternate" — the gate item staying explicitly **NOT MET**, as it already is.
2. **Decide that the City should begin reporting a real load vector**, which is a new product capability and
   therefore a new task rather than a repair inside UXI-390.

I have not chosen between them, because option 2 changes what the City is rather than fixing what it does.

## What this closes and what it does not

**Closes:** the question of whether the handoff is producible, which has now cost sixteen rounds across two
hosts, and the question of why `SWITCH_OFFERED` appears while `ALTERNATE_DEVICE` never does.

**Does not close:** the seam itself, which remains **NOT MET**; and the second Owner question already on
record — the switch/no-switch decision path on the surfaces, where `switch-declined` exists on the backend and
is called by **no surface**.


[阅读译本 / Reading translation](./zh-CN/DISPATCH_ALIEN_HANDOFF_UNREACHABLE_BY_DESIGN.md)
