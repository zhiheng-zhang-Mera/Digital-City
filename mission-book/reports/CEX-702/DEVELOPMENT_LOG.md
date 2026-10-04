# CEX-702 development log / 开发日志

Alien-codex · 2026-10-05. Baseline 0e9bea3ce739b979e582a428af8fb233045a5e75; plan commit 120244712c608ec065b0c0c00c0ab41504c81cef. Development remains IN_PROGRESS; uncommitted candidate is not accepted or deployed.

- Choice: add versioned userChoices metadata beside the frozen scheduler DTO. Clients display backend choices and submit explicit ALTERNATE_DEVICE through the existing switch-declined route; they do not rank devices locally. Generic CONFIRM remains disabled.
- Found: canonical sharingEnabled=false was absent from candidate eligibility. Corrected candidate enablement so a device that stops sharing cannot be offered as a new alternate.
- Guard decisions: reject stale revision, strict-target conflict and no eligible alternate before mutation. Repeat accepted alternate intent must not create another event or transfer. Legacy empty-body switch-declined behavior remains compatible.
- Web lifecycle: retain pending state across navigation/rerender, fence callbacks by credential/City context. Native lifecycle: hoist pending state above navigation, dispose its callback fence only when client/City changes.
- Measured: actual local Gateway + browser + filesystem worker test transferred one WAIT task to B, completed it and displayed its result on the original Web surface. Other tests reject strict/no-alternate/stale/offline/withdrawn-sharing cases. Three new tests PASS; existing scheduler/Android parity/action/handoff checks 47/47 PASS.
- Native parser test first failed because SchedulerChoice did not exist; subsequent unit-test/build command succeeded. Android online alternate-device interaction and multi-physical-host resource execution remain NOT_RUN.
- Retained failures: first browser run exposed missing translation keys (2/3 pass); repaired and rerun 3/3 pass. A Python WindowsApps alias did not execute the planned edit; inspection found unchanged files, then explicit Node/apply_patch edits corrected it. Shell brace-expansion command was incompatible with PowerShell; no product conclusion drawn from it.
- Relationship to City roles: choosing an execution device does not appoint or migrate a City primary agent. User-directed primary-agent designation is still pending; joining must demote only local host and leave remote primary untouched.
- Research: worker output is functional evidence, not a throughput benchmark. Token/context-window counts, intervention timing and physical network performance NOT_OBSERVABLE unless measured separately. Local technical review requested; different-physical-host Formal Review pending.
