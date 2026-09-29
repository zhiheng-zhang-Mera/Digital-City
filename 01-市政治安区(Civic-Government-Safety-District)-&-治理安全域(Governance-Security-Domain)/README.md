# 市政治安区 Civic Government & Safety District — Governance & Security Domain

```text
STATUS = PROJECT_FIRST_REVIEWED_PARTIAL
EXISTING_BUILDING = 03 Qualification Control Plane
PLANNED_BUILDINGS = 01 Customs Security + 02 Runtime Compliance
```

01 owns qualification, admission and runtime hard-boundary governance. City Core itself remains in 00.

## Existing building

### [03 Qualification Control Plane](./03-资格控制平面(Qualification-Control-Plane)-&-可信候选认证服务(Trusted-Candidate-Attestation-Service)/)

Backed by private `Boss-Qualification-Control` @ `24bf31e7beee5adb0e94e6496a7114769b3b21f4`.

It isolates the trusted real-host runner from public Codex-Boss workflows, qualifies an immutable candidate SHA and emits redacted attestation/evidence.

## Planned Customs / ADMIT

Future city-wide admission remains the Boss+Hns functional target already recorded: Boss contributes authority/permission semantics; Hns contributes reusable plugin install/compatibility/lifecycle mechanics.

## Planned Runtime Compliance / ENFORCE

Future city-wide runtime enforcement remains primarily Boss-derived and consumes authority facts from Core.

## Boundary

```text
00 Core: authority facts
01 Qualification/Admission/Compliance: qualify, admit or enforce using those facts
```

Qualification Control does not become Root Authority merely because Owner approval gates its workflow.
