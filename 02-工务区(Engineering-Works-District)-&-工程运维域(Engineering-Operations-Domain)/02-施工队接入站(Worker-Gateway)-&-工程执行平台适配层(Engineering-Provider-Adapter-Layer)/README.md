# 施工队接入站 Worker Gateway — 工程执行平台适配层 Engineering Provider Adapter Layer

```text
STATUS = STRUCTURAL_BUILDING_INSIDE_HNS
STANDALONE_REPOSITORY = NOT_REQUIRED_BY_DEFAULT
CURRENT_IMPLEMENTATION_SOURCE = DS-Hns
```

## Role

This layer converts different official engineering-agent products into one Hns-facing provider contract.

Hns Core must talk to the contract, not to vendor-specific UI/runtime internals.

## Target provider contract

A provider adapter should expose only what Hns needs, such as:

- `detect()` / installation and readiness;
- `version()`;
- `capabilities()`;
- `startTask()` or attach/create session;
- `status()`;
- `cancel()` / interrupt when supported;
- `collectResult()`;
- `collectEvidence()`;
- optional `checkpoint()` / `resume()` when genuinely supported.

Capability support is declarative. Providers are not forced into a false lowest-common-denominator contract.

## Candidate provider adapters

- DeepSeek Harness;
- Claude Code;
- OpenAI Codex;
- WorkBuddy / CodeBuddy;
- generic local/remote process agents;
- future official engineering-agent products.

## Official-software rule

Prefer installing and using the provider's official software.

The adapter must not require Hns to maintain:

- a forked vendor UI;
- copied vendor runtime internals;
- vendor authentication implementation;
- a custom vendor updater;
- DOM injection or brittle UI coupling when a supported programmatic/process boundary is available.

## Existing Hns foundation

DS-Hns already contains useful generic foundations such as plugin/provider adapter contracts, managed-process support and project adapters. These should be generalized rather than duplicated per vendor.

## Boundary

This layer selects/translates providers; it does **not** own:

- the Engineering plan;
- global City capability registry;
- Node identity truth;
- provider-internal reasoning;
- City-wide authorization.
