# 城市道路 City Roads — Cross-Domain Semantic Contracts

```text
STATUS = PARTIAL_VERSIONED_CONTRACTS_EXIST
RUNTIME_SERVICE = FALSE
CURRENT_REFERENCE = Utopia contracts/
```

Roads are stable versioned semantics between owners, **not a central daemon or mandatory broker**.

Current Utopia examples already include:

- `pairing-v1`;
- `city-control-v0`;
- `capability-bridge-v1`.

Future roads should only be extracted when two real owners need the same cross-boundary contract.

## Allowed artifacts

- schemas;
- protocol modules/shared types;
- validators;
- compatibility/conformance tests;
- optional SDK/code generation.

## Forbidden role

Roads do not own business state, City authority, a mandatory transport, or a universal broker.

A new “Road service” must not be created merely because the map has a Road.
