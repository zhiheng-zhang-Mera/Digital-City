# REX-804 Development report

Developer: Alien / Mera-Alianware. Baseline `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`; candidate head `ef11bb7a160b1388b234b63215207d56d3f51950`, branch `rex/REX-804-Alien-codex-faults`.

Four controlled classes implemented: HEARTBEAT_LOSS (refuse targeted heartbeat), PROVIDER_UNAVAILABLE (refuse target execution claims, not external provider API), DELAY_RESULT (hold targeted canonical reports), DUPLICATE_EVENT (duplicate research observation, never canonical execution). Explicit online canonical target, Owner-only route, typed confirmation, <=30000ms bound, expiry, emergency stop, restart interruption. Normal execution and unrelated nodes remain canonical. No OS/public-network/destructive fault injection.

User path: Web Research → Advanced / Danger Zone → target/type/duration → read impact → type exact confirmation → inject → inspect bounded receipt/recovery → emergency stop. Real Web-to-Gateway test exercised refusal before confirmation, activation and stop. Android control parity is an explicit seam for REX-807, not verified complete.

Focused tests: 10 PASS; fresh technical critic independently reran controller/Gateway 9 PASS, initial storage-isolation and measurement-attribution findings repaired. This is NOT opposite-host Formal Review. Initial full local suite has a timing failure in S1 relay rate-limit test; failure preserved and requires isolated reproduction and final exact-head CI. CI `37397436261` initially IN_PROGRESS at exact candidate SHA. Full-suite success and formal completion are not yet claimed.

Detection metrics require an exercised active heartbeat fault plus canonical NODE_OFFLINE. Recovery requires an exercised request plus later successful restored target operation; missing values remain null. Selected receipt and screenshot in Utopia `evidence/raw/mission-book/REX-804/`; raw logs stay `.runtime/evidence/mission-book/REX-804/`.

Remaining: terminal exact-head CI, Mech Formal Review with at least one previously unused fault probe, registry/runtime independent reconciliation. No merge authority.

Final evidence head `ef11bb7a160b1388b234b63215207d56d3f51950`; source implementation parent `9b68d4f7054bb911c484340532cc3b5ae9ed47ac`. Local final full suite with test-concurrency=4: 1360 PASS / 0 FAIL. Original default-concurrency run: 1357 PASS / 1 FAIL (S1 relay burst); isolated unchanged relay suite 12 PASS / 0 FAIL. Its 30 sequential requests cross a 1-second rate window under full-suite load; no threshold/test deletion used. Bilingual docs PASS; Rooms 69 PASS; promotion-history 10 verified. Final PR #30 remains draft until exact-head hosted CI and Mech review release.

Selected `utopia:evidence/raw/mission-book/REX-804/controlled-probe.json` preserves four actual local probe receipts and trace. HEARTBEAT_LOSS detection 963ms, observed heartbeat recovery after removal 22ms; execution-claim restoration 24ms, delayed-report restoration 7ms; duplicate trace observations 3. These are one local controlled probe, not performance or physical-host/provider recovery claims. All unobserved metrics remain null.

Hosted fixture defect retained: initial push CI `37397118298` failed on `FAULT_TARGET_NOT_READY` during the real Gateway probe. The test configured a 100ms liveness lease but did not maintain heartbeats between fault phases; loaded runner correctly expired the target before injection. Classified `MEASUREMENT_DEFECT`, not permission to bypass target readiness. Same source's PR run `37397255730` subsequently succeeded; that does not validate the new final head.

Repair-only test commit: `f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5` refreshes genuine heartbeat before each activation, uses a 2000ms fixture lease, awaits actual canonical offline state within bounded observation, and maintains heartbeats in non-heartbeat phases. Fault duration remains <=30000ms; all safety assertions preserved. Focused final tests: 10 PASS; product source unchanged from `9b68d4f7054bb911c484340532cc3b5ae9ed47ac`. Final CI `37397799729` and push `37397794253` running. Superseded evidence-only active runs `37397436261` and `37397431269` cancelled to free runners; original failure retained. City linkage `37397800050` passed at final head. Local City checks: 1969 PASS / 15 SKIPPED; skips remain explicit.

## Development release — final exact CI observed

Final implementation/evidence head: `f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5`. PR CI `37397799729` and push CI `37397794253` both COMPLETED SUCCESS, independently verified headSha equal final recorded head; gateway-web and android both SUCCESS. City linkage `37397800050` SUCCESS. All PR checks terminal SUCCESS. Remote branch tip equals local HEAD and worktree clean at release. PR #30 ready for Mech review; no merge performed.

Development complete = true. Review complete = false. Registry remains CANDIDATE_PENDING_FORMAL_REVIEW. Mech must independently add a previously unused fault probe and reconcile exact-head runtime/UI/Registry; component Web verified, Android control seam remains documented. This is not REX programme completion.

Control-plane command repair: PATH python was a WindowsApps placeholder with no real script execution. Actual D:/Tools/MonitorPython-3.13.0/python.exe ran dependency/progress sync and --check with explicit synchronized output. All eight REX frontmatters plus candidate/index YAML were parsed using the repository yaml package with uniqueKeys checks. Earlier silent placeholder calls are not claimed as successful validation.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
