# PCF-706 — Policy, consent and data boundaries

[Canonical state](../PCF-706-policy-consent-and-data-boundaries.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Propose a versioned policy contract/service and tests/pcf706-policy.test.mjs. resolveEffectivePolicy(request, authorityFacts) references existing trust, GAI budget and Attention authority, not new credential or approval databases.

Version endpoint allowlists, workload scope, expiry, budget, fallback and revocation. Distinguish ORIGIN_DEVICE_ONLY, TRUSTED_PERSONAL_FABRIC and APPROVED_CLOUD. Preserve local-first, explicit cross-device confirmation and Web/API gates. Owner-granted bounded preauthorization cannot silently expand to every device or future task.

Revalidate at dispatch, artifact transfer, execution start and result publication. Redact sensitive values while retaining refusal provenance. Missing/conflicting policies fail closed without changing legacy defaults. Explain incompatible hard constraints and provide reversible opt-out; advanced settings cannot override identity/permission floors. Keep cost units and remaining allowances unambiguous.

Run `node --test tests/pcf706-policy.test.mjs`: expired/revoked/wrong-task consent fails; origin-device-only data cannot leave for another private PC; LAN membership is not trust; declared metadata cannot grant privilege; zero/unknown budgets cannot trigger paid execution; concurrent spending cannot exceed allowance; logs contain no secrets.

Consent/revoke/sharing controls are not released until 715 provides live UI wiring; 714 returns refusals to the origin. Domain profiles may grow without embedding clinical, investment or other specialized decision logic.
