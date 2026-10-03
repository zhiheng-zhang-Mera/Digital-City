# SHOW-401 — Alien capture report

Status: PREFLIGHT_IN_PROGRESS. No formal take or completed showcase package is claimed.

## Authorization and storage

The Owner requested SHOW-401 capture on Alien, using the OPPO physical Android device and the Mech desktop shared through Zoom, including remote control and window arrangement. Outputs belong in the local project and the workbook's designated Digital-City paths.

- Local project: `D:/AA-Digital-City`
- Local media root (Git excluded): `D:/AA-Digital-City/.showcase-media/SHOW-401`
- Additional export root: `C:/Users/15601/Documents/Utopia-Showcase/SHOW-401`
- City reports: `mission-book/showcase-material-extraction/reports/SHOW-401/`
- Capture branch: `showcase/SHOW-401-alien-capture`
- Claim commit: `d165ffb`
- Claim-time City main: `9f0eeaf64a8405215ea080458a37506c42fcf0f7`

Large videos remain local, as required by the workbook. No cloud-video publication destination has been specified.

## Runtime reconciliation (2026-10-03)

| Item | Verified evidence |
|---|---|
| Current Utopia main | `959b0aac77ce375a1a7bf43c15e5f15e38692c66`, read live through GitHub API |
| Current-main CI | [37104450534](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37104450534), COMPLETED / SUCCESS; gateway-web and android both SUCCESS; exact head matches |
| Existing runtime source checkout | `D:/utopia-uxi391`, branch `mesh/MESH-301-three-end` |
| Runtime source checkout HEAD | `ed0bf6467b02ae8e77e9da5650bde2bde428cdab` |
| Accepted baseline CI | [37099671088](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37099671088), COMPLETED / SUCCESS on exact `ed0bf64…` |
| Initial source state | No tracked or staged diff. Existing untracked `.city-node-identity.json` and `.runtime-mesh301-city/` retained. |
| Physical device UI | Android Studio mirror tab identifies `OPPO PERM00 API 31`; Utopia is ONLINE and displays Alien-Win and Mech-Win ONLINE. |
| Remote desktop | Zoom exposes Mech-PC's live shared desktop. Product Web window not yet verified on that desktop. |

Checkout HEAD is not a cryptographic attestation of already-running process bytes. This session has not restarted the existing gateway or workers. Historical MESH-301 acceptance is not new showcase-take evidence.

## Preflight observations

- OPPO Devices and Home are accessible through Android Studio Device Mirroring.
- Home exposes explicit Alien-Win / Mech-Win target controls and Run Test Task.
- No new task has been created by this session at this checkpoint.
- Saved internal QC image: `qc/oppo-devices-preflight.png` under the media root. It is not a selected final screenshot.
- The same image was copied to the additional Documents export root. SHA-256 of BOTH copies: `edd400883c069d6c6165a37bf99aec8c1f152089c0f70f7302811c9b60eb3cfb`.
- Three-surface visibility gate is NOT_YET_MET: Alien Web is absent and Mech's product window has not been verified.

## Tool/environment blockers

1. Browser skill initialization returned `Importing module "node:process" is not allowed in node_repl`. No browser connection was obtained.
2. Computer Use launching pre-existing Edge returned `launched app did not expose a targetable window: MSEdge`; a fresh window enumeration still showed no Edge window.
3. A subsequent shell request to launch Edge at the local City URL was rejected by automatic approval review with `blocked by policy`. The rejected action was not rerouted. The Owner was asked to open the already-paired Web surfaces manually.
4. Zoom's transient accessibility indexes expired; subsequent input reported user input detected. App input was paused to avoid competing with the Owner.
5. The advertised Android SDK adb path is unavailable to filesystem tools. A D-drive Android directory is a self-targeting junction. The live mirror remains usable; no SDK/junction repair is authorized or attempted.
6. A local `imageio-ffmpeg` recorder dependency installation produced no output or installed tool directory during the bounded preparation period and was terminated. No recorder installation success is claimed.

These are capture-environment observations, not evidence that Utopia tasks fail.

## Handoff scope requiring honest handling

The accepted UXI-391 review explicitly records that the decline action cannot be submitted from Web/Android and was exercised through an API in historical acceptance. Read-only inspection of the current runtime's `apps/web/scheduler.js` confirms the listed UI action wiring has no switch-declined action. This is an existing product boundary, not a newly measured failed handoff take.

Source: `mission-book/finished/completed-2026-10-03/reports/UXI-391/REVIEW_REPORT.md`, section 5; and `VERIFICATION_MECH_GATE6_RESULT_RETURN.md`.

Do not patch Utopia or describe an API-assisted historical acceptance as a new UI-driven take. Technical-scene feasibility must be settled before stopping any worker.

## Remaining work

Pass three-surface visibility QC; perform one full rehearsal; capture/select the two required demos and three screenshots; bind exact task IDs and media hashes; produce result table and five-level technical messages; complete privacy/playback QC; obtain opposite-physical-host review. All completion fields remain false.

## Owner-requested retry, 2026-10-03 approximately 18:47 local

The Owner reported Mech Web open and explicitly requested a retry, emphasizing that Alien must also have its own Web desktop so that three genuine endpoint surfaces are present.

- Mech Web is now visibly present in the live Zoom share. Saved internal image: `qc/retry-mech-web.png` (not selected for publication; the Zoom participant label is personally identifying).
- OPPO remains ONLINE and displays both Alien-Win and Mech-Win ONLINE. Saved internal image: `qc/retry-oppo-home.png`.
- Alien City root returned HTTP 200 and the Utopia page title. A successful HTTP request is not an open product window and does not satisfy the visibility gate.
- `sky.launch_app({app:'MSEdge'})` again returned `launched app did not expose a targetable window: MSEdge`.
- On this explicit retry instruction, the normal Edge launch command was retried and again rejected with `blocked by policy`. No alternative launch route was used to evade the denial.
- No local Edge process/window was observed by the subsequent checks.
- Mech's visible page currently shows Mech-Win, while OPPO shows both workers. The displayed Mech URL also appears different. Same-canonical-City identity is therefore UNVERIFIED, not asserted false from a cropped viewport or an address alone.
- The Owner was asked to open the already-running Alien City in a local browser and complete pairing if necessary. Three-surface QC and all formal takes remain NOT_RUN.
