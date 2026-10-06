# SHOW-401 — Utopia showcase extraction and two demos: full English reading

[Canonical workbook](../SHOW-401-Utopia项目展示素材提取与双Demo制作.md). Reading translation only, no authoritative frontmatter. SHOW execution remains excluded from the current task; no take, claim or product modification is initiated.

Standing rules: [construction](../../CONSTRUCTION_RULES.md), [relief](../../ASYNC_RELIEF_CONSTRUCTION.md), [process](../../PROCESS_DATA_POLICY.md), [programme](../README.md). SHOWCASE/EVIDENCE EXTRACTION, not product development. Never modify Utopia code in the name of recording.

## 1. Goal

One reusable showcase package for PhD outreach, project home page, GitHub README/portfolio and quick one-to-one supervisor presentation. Deliver all six together: main demo (three real endpoints, strict target execution, returned result); technical demo (same task remote handoff/ownership transfer, returned result); three core screenshots; one results table; technical-message package; DELIVERABLE_MANIFEST binding media, task IDs, devices, runtime baseline and checksums. These are AND conditions; an almost-finished video cannot end work early.

## 2. Confirmed background at workbook creation

MESH-301 COMPLETE/THREE_END_MESH_E2E_ACCEPTED topology: Alien-Win real Windows worker+Web control, Mech-Win real Windows worker+Web control, physical Android control surface (not worker). All can join one canonical City; strict target routing physically verified; Web/Android show task execution/results. UXI-391 accepted real two-host remote handoff/ownership transfer. Reciprocal City/Utopia linkage lets City read live main+CI. Extract existing capabilities into reusable materials, no new product construction.

## 3. Highest-priority constraints

### Utopia absolutely read-only

Allowed for this historical workbook: inspect main SHA/CI; launch accepted software; run Web/Android/workers; create real tasks through UI; runtime .runtime/temporary pairing/task/event state; existing start/stop scripts; Android Studio/meeting/recording software.

Forbidden: editing tracked source/tests/docs, creating development branches, commit/merge/cherry-pick/revert, repairing code for video appearance, changing tests/criteria or fabricating state, new UI/scheduler/runtime development. Product defect response:


```text
STOP THE AFFECTED SCENE
→ record blocker + exact observation
→ continue only other unaffected showcase items
→ DO NOT PATCH UTOPIA
```


Product fixes require a new Owner-authorized workbook.

### Visible foreground product

Alien must visibly show Utopia Web/Activity/Devices and real Android Studio Device Mirroring, not only background Node/scripts. Mech shares its real desktop through meeting software, primarily Utopia product UI rather than terminal/tasklist/process monitor. Android is the real device mirror on Alien, never an emulator presented as physical hardware.

### Shell supports, never replaces product monitoring

CMD/PowerShell may start accepted runtime, start/stop workers for the technical demo, read diagnostics and confirm exits. Primary evidence for City/node online, RUNNING, ownership, handoff, COMPLETED and result return must be frontend UI/Activity/Devices/task state. The following cannot substitute:


```text
tasklist
Get-Process
netstat
PowerShell JSON dump
CMD log
后台 console 文本
```


The original block's last line means background console text. Shell may appear briefly in a supporting area, but the main product window stays visible.

## 4. Recommended recording topology

Alien captures/directs because Android Studio is attached, Web and physical mirror can appear together, Mech shares real desktop through a meeting, and only Alien needs recording:


```text
Alien = capture/director host
```



```text
Alien physical desktop
├─ Utopia Web
├─ Android Studio Device Mirroring
│  └─ physical Android control surface
├─ online meeting window
│  └─ Mech shared Utopia desktop
└─ screen recorder
```



```text
Alien-Win worker
Mech-Win worker
Android physical control surface
```


Visually two desktops, actually three real endpoints. Opening evidence identifies two distinct workers, Android third real control endpoint, all same City, Android not a worker. No MAC/IP/permanent-token display required.

## 5. Preflight before every formal take

1. Resolve remote refs/heads/main to a full 40-character Utopia SHA and record it; branch name is discovery, not evidence. Cross-check generated City live status.
2. Record current exact main SHA, latest full CI and accepted MESH-301 functional baseline.
3. Append exact runtime SHA to capture_run_shas/report for every take/run. Different SHA scenes cannot be described as one run. If current CI is red, classify relevance; product-related failure stops affected recording, without repairs in this workbook.
4. Alien/Mech/Android reachable.
5. Both Windows workers online.
6. Physical Android joined by temporary pairing.
7. Three control endpoints share City.
8. Permanent token, local-config and private paths absent from footage.
9. Close private notifications/mail/chat/accounts.
10. Resolution, meeting share and mirror fonts readable.

An internal QC screenshot must confirm Alien product window, Android mirror and Mech share are visible, with no endpoint proven online only by shell. Otherwise no formal take.

## 6. Deliverable A — main demo

### Goal, 60–90 seconds


```text
three real endpoints
→ one canonical City
→ Android can target a Windows worker
→ Windows control surface can target another worker
→ real task ownership / execution
→ COMPLETED
→ result returns to the initiating surface
```


### Scene A1 — same City, 8–12 seconds

Show simultaneously or quickly switch Alien Web, Mech shared Web and physical Android mirror. Identify Alien-Win, Mech-Win, Android ONLINE/control state and same City for the two workers.

### Scene A2 — Android→Mech-Win, 20–30 seconds

Prefer this strong causal sequence:


```text
Android physical device
→ choose target Mech-Win
→ Run
→ Mech product UI shows the same task / assignment
→ RUNNING
→ COMPLETED
→ Android sees final state/result
```


Record task ID, requested target, actual node, terminal state and result-return surface. If UI lacks all fields together, supplement with Activity/task details product footage.

### Scene A3 — Alien Web→Windows worker, 15–25 seconds

Prefer Alien Web→Mech-Win, or Alien Web→Alien-Win to avoid repeating Mech; choose clearer footage:


```text
Alien Web → Mech-Win
```



```text
Alien Web → Alien-Win
```


Prove user-selected target, actual worker matches, and completed result returns to originating Web.

### Scene A4 — Activity closing, 10–15 seconds

End on product state/Activity showing two real workers, three-control-surface fact, recent target/state/completion, no UNKNOWN-target fallback or duplicate completion.

Forbidden in main demo: three-worker claims, source code, scrolling CI, terminal-dominated footage, intentional network disconnect, irrelevant Rooms or permanent tokens.

## 7. Deliverable B — technical remote-handoff demo

### Goal, 60–90 seconds


```text
same task id
→ initially RUNNING on Worker A
→ Worker A becomes unavailable
→ user-visible routing / handoff state
→ ownership transfers to Worker B
→ Worker B continues/completes the SAME task
→ result returns to the original control surface
```


Use the wording “guarded ownership transfer / remote handoff of an in-flight task”. Never claim arbitrary side-effect tasks transparently migrate exactly once: UXI-391 acceptance does not support that generalization.

### Recommended scenario

Use an accepted stable worker-held task, e.g. WAIT from the handoff runbook. First, the original control creates the targeted task. The UI shows its task ID, RUNNING state and Worker A. Keep the Gateway/control UI visibly in the foreground while stopping or leaving Worker A through a supporting mechanism; shell may execute this action but must not dominate the shot. The UI then shows the loss, route decision, offer and handoff. Worker B comes online and takes over. The UI proves that the same task ID moves from A to B. B completes it, and the original surface shows the final result.

### Anti-fake assertions

Rule out replacement task creation, A never actually running, B taking task before A owned it, prerecorded UI state, terminal-only success without product fact, or A/B both completing the same task. RESULTS records:


```text
original_task_id
initial_owner
handoff_owner
terminal_owner
terminal_state
result_return_surface
duplicate_terminal_count
```


## 8. Deliverable C — three core screenshots

Deliberately choose three images that explain the project in 10 seconds, not arbitrary video frames.

1. Topology/system: two Windows workers+Android control share canonical City. Prefer Devices/City+Android mirror+Mech share, or a simple truthful composition:


```text
Android control
      ↓
canonical City
↙             ↘
Alien-Win    Mech-Win
```


Label Architecture diagram separately from Runtime screenshot, never disguise drawings as live evidence.

2. Android strict-target: physical mirror, Mech-Win/Alien-Win target, taskID, RUNNING/COMPLETED and actual node wherever possible.
3. Activity/handoff: same task, A→B ownership, terminal completion, result from original surface. If not visible on one page, compose two real screenshots with explicit chronology; do not alter system-state pixels.

## 9. Deliverable D — results table

Fill [RESULTS](../RESULTS.md), short enough for a professor to read in 20 seconds. Minimum rows:

| Capability | Physical setup | Observed result | Evidence |
|---|---|---|---|
| Three-end mesh | Alien+Mech+Android | same canonical City | demo/screenshot |
| Android strict target | Android→Windows worker | target=assigned node, completed | taskID |
| Web strict target | Alien Web→Windows worker | target=assigned node, completed | taskID |
| Remote handoff | A→B | same task transferred/completed | technical demo |
| Result return | original surface | final backend result visible | demo |
| CI/accepted baseline | Utopia main | exact-head green | live City status |

Accepted historical measurements such as MESH-301 convergence may be cited as:


```text
Previously accepted physical validation
```


Current showcase task IDs/take evidence must come from actual current recording. Separate historical experiments from current take results.

## 10. Deliverable E — core technical messages

Fill [CORE_MESSAGES](../CORE_MESSAGES.md), all five levels:

E1 one-sentence definition, 25–40 English words: multi-device personal computing/runtime, canonical state, heterogeneous control surfaces, real workers.

E2 at most three contributions, 1–2 sentences each: canonical multi-device task/device state; strict target execution+result return; guarded remote handoff/ownership transfer.

E3 outreach paragraph, 80–120 English words usable in professor email; do not reduce project to a feature list.

E4 project-page technical abstract, 180–250 English words: motivation, architecture, validated physical setup, interesting failure/handoff, evidence discipline and limits.

E5 three to five restrained research framings: coordinating heterogeneous personal devices around one task truth; exposing routing/handoff without making UI scheduler; measuring bounded cross-surface convergence; reducing human orchestration in long-running AI-assisted engineering; preserving fail-honest state under partial telemetry. These are research questions, not published/proved scientific results.

## 11. Deliverable F — media manifest/provenance

Fill [DELIVERABLE_MANIFEST](../DELIVERABLE_MANIFEST.md). Every artifact records:


```text
artifact_id
artifact_type
title
capture_host
physical_devices
utopia_runtime_sha
utopia_ci
city_control_sha
recorded_at
file_path
file_hash
duration_or_dimensions
task_ids
contains_sensitive_content = false
claims_supported
known_limits
selected_for_outreach = yes/no
```


Never put video in the Utopia repository. Default local layout:


```text
<Owner Documents>/Utopia-Showcase/SHOW-401/
├─ video/
│  ├─ main-demo/
│  └─ technical-handoff/
├─ screenshots/
├─ qc/
└─ exports/
```


Record absolute root at claim. City commits workbook, manifest, RESULTS, CORE_MESSAGES, optional selected safe small PNGs and report. Large MP4s stay local; cloud drive/Release/video publishing requires later Owner direction.

## 12. Construction order — historical specification, not executed here

1. Claim/runtime reconciliation: latest City main/live JSON, accepted MESH-301/UXI-391, exact runtime SHA/CI, read-only Utopia check, local media root.
2. Privacy/desktop: hide permanent tokens, close private alerts/irrelevant tabs, acceptable meeting names, disable lockscreen notifications, no personal paths.
3. Visible surfaces: Alien Web/mirror/switchable meeting foreground; Mech Web/meeting product share. Continue only after QC image passes.
4. Rehearse main path once, record issues. Fix shot layout/fonts/share/windows/timing in recording environment. Product issue: no code edits, record blocker, retry once only if reasonably runtime/session/transient; persistent issue stops scene.
5. At most three final main takes. Select clearest causality/readability, no secrets/terminal dominance/obvious waiting, complete target/assignment/result evidence.
6. Technical rehearsal/final: at most three takes, anti-vacuity required.
7. Select/capture three screenshots from real runtime; never edit product-state text for the image.
8. Results: current task IDs+accepted historical evidence. Every result points to timestamp, screenshot, taskID or City/Utopia acceptance material at least once.
9. Messages from table rather than remembered marketing:


```text
observed facts
→ bounded claim
→ contribution wording
→ email paragraph
```


10. QC each media: full playback, resolution/audio if any, readable labels, secret scan, claims match footage, Android not worker, handoff not arbitrary transparent migration, shell not product substitute.
11. Opposite physical-host review. Reviewer does not record again; checks actual main causal chain, sameID technical demo, standalone-readable screenshots, traceable numbers, no overclaims/secrets/terminal dominance. Edit/media-label problems may be fixed in City outputs; product defects cannot be repaired in Utopia here.
12. Final package selections:


```text
MAIN_DEMO_SELECTED
TECH_DEMO_SELECTED
SCREENSHOT_1_SELECTED
SCREENSHOT_2_SELECTED
SCREENSHOT_3_SELECTED
RESULT_TABLE_FINAL
CORE_MESSAGES_FINAL
MANIFEST_FINAL
```



```text
UTOPIA_SHOWCASE_PACKAGE_READY
```


## 13. Task-specific independent review

At least verify: two real Windows+physical Android; live Mech share, not prerecorded/still; physical-device mirror; UI-readable target/assignment; A actually RUNNING before handoff; B same taskID; original-surface result; no tracked product mutation; shell not main monitor/evidence; no secrets/permanent tokens; no overclaim. Findings:


```text
MEDIA_NARRATIVE_DEFECT
PRODUCT_DEFECT
```


MEDIA_NARRATIVE_DEFECT is repaired within workbook outputs. PRODUCT_DEFECT is recorded and blocks affected scene, never patched in Utopia.

## 14. Completion gate

Only all conditions authorize these historical terminal fields:


```text
development_complete: true
review_complete: true
status: COMPLETE
terminal_marker: UTOPIA_SHOWCASE_PACKAGE_READY
```


1. Select the final main demo.
2. Select the final technical demo.
3. Select all three screenshots.
4. RESULTS has no placeholders.
5. Complete all five message levels.
6. The manifest has no placeholders.
7. Each video has at least one exact task ID.
8. Demonstrate handoff of the same task.
9. Record runtime SHA and CI.
10. Tracked source, tests and docs remain unchanged.
11. Keep the product visible in the foreground throughout.
12. Shell has a supporting role only.
13. Use physical Android hardware.
14. Privacy/secret QC passes.
15. Opposite-host review passes.

Any missing condition prohibits COMPLETE.

## 15. Reports and evolution

Preserve reports/SHOW-401/CAPTURE_REPORT.md,REVIEW_REPORT.md,TAKE_SELECTION.md,PRIVACY_QC.md. Future paper material may cover prototype→quickly understandable evidence package, observed UI versus backend-log hierarchy, same-task ownership distinguishing real handoff from mock, and preventing recording convenience from contaminating product code.

## 16. Standing-rule binding

Inherit atomic claim, two-host independence, typed blocker, event-first wakeup, no-make-work and evidence honesty. Stricter task rules: Utopia is always read-only runtime source without product-edit authority; foreground product required and terminal supporting only; success is traceable real product behavior, not footage that merely looks successful.
