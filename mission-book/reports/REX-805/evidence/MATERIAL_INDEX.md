# REX-805 实体开发门槛材料索引 / Physical development-gate material index

执行者 / executed by: Mech-DS (`MEGA-REP`), on the resident City, from the author's handoff
`PHYSICAL_GATE_HANDOFF_Alien.md`. **这不是正式复检结论**；它把开发门槛的原始材料交回作者核验。 / This is not the
formal review verdict: it hands the development gate's raw materials back to the author to verify.

## 绑定 / Bindings

```text
candidate SHA     4b3946868d4083285da8a8d99eac2642890b37c4
city ID           031fdba6-e94c-4298-a095-6ff04a65481d
exported at       2026-10-06T10:02:55.657Z
source campaign   campaign-966cf439-7017-4bb0-88e8-981e59c18322  run index 1
source seed       414121415
deployment        worktree D:/utopia-rex805-candidate at the candidate SHA -> gateway pid 33420 -> City 031fdba6-e94c-4298-a095-6ff04a65481d
topology at run   workers ["dev-031fdba6e94c4298a0956ff04a65481d","dev-8128a1ef25c5c4b7f66fc31b21705858"] surfaces ["dev-be7832e35fc34b85966c3bb43a992e1d"]
```

The City was stopped and restarted from the candidate worktree with its data directory retained, so it kept its identity
and the registered source experiment and receipt. Before the restart the replay surface answered 404 on the running City
(it was the old candidate `8798ba9`); after it, `research/replays` answers 200.

## 门槛结果 / The gate result

| run | campaign | seed | state | canonical task | worker | controlledInputsMatch | differences | placementChanged |
|---|---|---|---|---|---|---|---|---|
| REPLAY | `campaign-4a1919b0-d99e-4085-ac50-4600bef555b1` | 414121415 | MEASURED | `Q-422d18b5-45ed-40f5-81eb-e1cd95b4890d` | dev-8128a1ef25c5c4b7f66fc31b21705858 | true | [] | false |
| ABLATION | `campaign-bad9f272-c7e6-4b0e-aa39-7752cf47a76f` | 414121415 | MEASURED | `Q-474aca57-43cf-4231-a279-d85911cd2d56` | dev-031fdba6e94c4298a0956ff04a65481d | true | [] | true |

```text
original (source run 1)  worker dev-8128a1ef25c5c4b7f66fc31b21705858  seed 414121415
REPLAY                                                     worker dev-8128a1ef25c5c4b7f66fc31b21705858
ABLATION (alternate-device disabled)                       worker dev-031fdba6e94c4298a0956ff04a65481d
all three seeds equal                                      true
fresh identities  replay experiment replay-30b2450b-f78a-4145-af9b-e5f94e65578e (VALIDATED) / ablation experiment replay-00dbd47c-cf2c-4154-a67f-f447196f7566 (VALIDATED)
```

The handoff predicted exactly this placement: the original and its Replay on the Alien host, and the Ablation on Mech
under the exact disabled policy. That is what was measured. Each run executed as a real canonical task on a real host
worker and reached `MEASURED`, so these are physical outcomes and not synthetic ones.

## Files

| file | bytes | sha256 | provenance |
|---|---|---|---|
| `ablation-comparison.json` | 3568 | `9d5372798dcd1727a1630efd6b698141ae600f2741556ce943c4714c750040bc` | API response / run log |
| `ablation-receipt.json` | 4047 | `8c2d028cb517e464e6c0b1effcc2e9433b5ff1bcd9fc17e377817f5f844ff8f7` | byte copy of the City's campaign-bad9f272-c7e6-4b0e-aa39-7752cf47a76f.json |
| `canonical-tasks.json` | 2144 | `ff55630882c672765ea20bc171975e026c5a0106ab0d44e12696ba9aec8cf4a0` | API response / run log |
| `deployment-and-topology.json` | 720 | `27dcb9e961b81848cd235bc9c23fca8c8a6a26e906d9c28e30f7001b234e0a6b` | API response / run log |
| `experiment-registry.json` | 19116 | `55c79bce7a550449948287919e283d24cdd0055df6783dd47866c8450277c057` | API response / run log |
| `replay-comparison.json` | 3537 | `2e1f002a58aec3fd9af004109d4878a6f70101fc27a2ca11ebfd85da379cb017` | API response / run log |
| `replay-receipt.json` | 3956 | `cf7047dd5fc5a3216a1c5977ccd4daf2fa036c1e5cdc26dfaef4bfdc5c4404c0` | byte copy of the City's campaign-4a1919b0-d99e-4085-ac50-4600bef555b1.json |
| `RUN_LOG.txt` | 1770 | `a677eb45b562d4d2ca7a21d2af6435d9e554fe26e0d584868c02f07b3e50bf60` | API response / run log |
| `source-receipt.json` | 3693 | `34bf525779376299d010762fe54009a795239a7cfe16e9a16d1490a18d77c669` | byte copy of the City's campaign-966cf439-7017-4bb0-88e8-981e59c18322.json |

The receipts are byte copies, so a reader can compare them with the City. The source receipt was **not** rewritten into
a synthetic run - the handoff is explicit about that, and the synthetic instrument built earlier is deliberately not
evidence for this gate.

## 一处对既有记录的更正 / A correction to what this programme recorded earlier

The synthetic-source instrument reported `controlledInputsMatch:false` with `controlledInputDifferences:["limits"]`, and
that was recorded as a located finding pending a physical test. The physical test answers it: on a **really recorded**
source the comparison reports `controlledInputsMatch:true` with **no** differences. The `limits` difference therefore
belongs to the synthetic fixture - a patched run whose limits came from another derivation - and is not a property of
replays of physically recorded campaigns.

## 未观测项 / NOT observed

```text
not observed   the handset-rendered view of either comparison on the physical device (no adb device on this host)
not observed   any claim about duration differences as performance: the comparison reports durationDeltaMs and the
               engine itself declines a causal performance claim (causalPerformanceClaim false)
not claimed    development completion, acceptance, or any merge authority - all three belong to the author or the Owner
```
