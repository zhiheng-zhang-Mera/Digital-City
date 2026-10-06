# REX-804 Development report

Developer: Alien / Mera-Alianware. Baseline `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`; candidate head `9b68d4f7054bb911c484340532cc3b5ae9ed47ac`, branch `rex/REX-804-Alien-codex-faults`.

Four controlled classes implemented: HEARTBEAT_LOSS (refuse targeted heartbeat), PROVIDER_UNAVAILABLE (refuse target execution claims, not external provider API), DELAY_RESULT (hold targeted canonical reports), DUPLICATE_EVENT (duplicate research observation, never canonical execution). Explicit online canonical target, Owner-only route, typed confirmation, <=30000ms bound, expiry, emergency stop, restart interruption. Normal execution and unrelated nodes remain canonical. No OS/public-network/destructive fault injection.

User path: Web Research → Advanced / Danger Zone → target/type/duration → read impact → type exact confirmation → inject → inspect bounded receipt/recovery → emergency stop. Real Web-to-Gateway test exercised refusal before confirmation, activation and stop. Android control parity is an explicit seam for REX-807, not verified complete.

Focused tests: 10 PASS; fresh technical critic independently reran controller/Gateway 9 PASS, initial storage-isolation and measurement-attribution findings repaired. This is NOT opposite-host Formal Review. Initial full local suite has a timing failure in S1 relay rate-limit test; failure preserved and requires isolated reproduction and final exact-head CI. CI `37397118298` initially IN_PROGRESS at exact candidate SHA. Full-suite success and formal completion are not yet claimed.

Detection metrics require an exercised active heartbeat fault plus canonical NODE_OFFLINE. Recovery requires an exercised request plus later successful restored target operation; missing values remain null. Selected receipt and screenshot in Utopia `evidence/raw/mission-book/REX-804/`; raw logs stay `.runtime/evidence/mission-book/REX-804/`.

Remaining: terminal exact-head CI, Mech Formal Review with at least one previously unused fault probe, registry/runtime independent reconciliation. No merge authority.
