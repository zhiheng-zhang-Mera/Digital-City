> English reading translation / 英文阅读译本. The [original document](../RIV-002-independence-profile-and-assurance-classes.md) remains authoritative. This reader grants no execution or migration authority.

# RIV-002 — Independence Profile & Assurance Classes

> **PARKED / NOT ACTIVATED.**

## Objective
Express review independence as an explicit profile, rather than vague substitutions such as changing machines or changing agents.

## Profile dimensions
```text
authorship_independence
agent_session_independence
model_family_independence
physical_host_independence
runtime_environment_independence
hardware_toolchain_independence
evidence_source_independence
conflict_recusal
```

For every dimension, define REQUIRED / PREFERRED / NOT_REQUIRED / NOT_APPLICABLE and record observable evidence.

## Assurance class
Define a small set of classes according to task risk and verifiability, for example:
- LOCAL_DIAGNOSTIC — does not constitute Formal Review;
- STANDARD_FORMAL — at least meets the current formal threshold;
- ENVIRONMENT_DIVERSE — explicitly requires different runtimes or hardware;
- HIGH_ASSURANCE — multidimensional independence plus stronger evidence;
- DOMAIN_SPECIALIST — prioritizes professional qualifications while still meeting required independence.

Specific class names and thresholds may be adjusted at activation; assurance must not be reduced to shorten waiting time.

## Completion gate
Clearly define the profile schema, eligibility semantics, failure and unknown semantics, and the compatibility mapping to the current §3.
