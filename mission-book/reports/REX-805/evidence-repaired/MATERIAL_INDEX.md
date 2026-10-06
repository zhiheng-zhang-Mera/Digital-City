# REX-805 瀹炰綋寮€鍙戦棬妲涙潗鏂欑储寮?/ Physical development-gate material index

鎵ц鑰?/ executed by: Mech-DS (`MEGA-REP`), on the resident City, from the author's handoff
`PHYSICAL_GATE_HANDOFF_Alien.md`. **杩欎笉鏄寮忓妫€缁撹**锛涘畠鎶婂紑鍙戦棬妲涚殑鍘熷鏉愭枡浜ゅ洖浣滆€呮牳楠屻€?/ This is not the
formal review verdict: it hands the development gate's raw materials back to the author to verify.

## 缁戝畾 / Bindings

```text
candidate SHA     0261a9ed1cec88df3ab4675623d422b37b33f270
city ID           031fdba6-e94c-4298-a095-6ff04a65481d
exported at       2026-10-06T10:13:14.436Z
source campaign   campaign-966cf439-7017-4bb0-88e8-981e59c18322  run index 1
source seed       414121415
deployment        worktree D:/utopia-rex805-candidate at the candidate SHA -> gateway pid 33420 -> City 031fdba6-e94c-4298-a095-6ff04a65481d
topology at run   workers ["dev-031fdba6e94c4298a0956ff04a65481d","dev-8128a1ef25c5c4b7f66fc31b21705858"] surfaces ["dev-be7832e35fc34b85966c3bb43a992e1d"]
```

The City was stopped and restarted from the candidate worktree with its data directory retained, so it kept its identity
and the registered source experiment and receipt. Before the restart the replay surface answered 404 on the running City
(it was the old candidate `8798ba9`); after it, `research/replays` answers 200.

## 闂ㄦ缁撴灉 / The gate result

| run | campaign | seed | state | canonical task | worker | controlledInputsMatch | differences | placementChanged |
|---|---|---|---|---|---|---|---|---|
| REPLAY | `campaign-cdf39b7f-f6ff-4ddf-b611-4139f64c57d5` | 414121415 | MEASURED | `Q-bb06cb49-8cf4-498a-999b-77dd399a3a33` | dev-8128a1ef25c5c4b7f66fc31b21705858 | true | [] | false |
| ABLATION | `campaign-481a1761-1b5d-440d-a5a0-1743599b512a` | 414121415 | MEASURED | `Q-c2681877-d9a7-43b7-a127-1ead05e6edcb` | dev-031fdba6e94c4298a0956ff04a65481d | true | [] | true |

```text
original (source run 1)  worker dev-8128a1ef25c5c4b7f66fc31b21705858  seed 414121415
REPLAY                                                     worker dev-8128a1ef25c5c4b7f66fc31b21705858
ABLATION (alternate-device disabled)                       worker dev-031fdba6e94c4298a0956ff04a65481d
all three seeds equal                                      true
fresh identities  replay experiment replay-ed2c6feb-56d9-4e75-8140-6504727012da (VALIDATED) / ablation experiment replay-db5f006c-aa4f-4612-b361-5721732f01f7 (VALIDATED)
```

The handoff predicted exactly this placement: the original and its Replay on the Alien host, and the Ablation on Mech
under the exact disabled policy. That is what was measured. Each run executed as a real canonical task on a real host
worker and reached `MEASURED`, so these are physical outcomes and not synthetic ones.

## Files

| file | bytes | sha256 | provenance |
|---|---|---|---|
| `ablation-comparison.json` | 3566 | `177f137886e74cf6c5ae4abad23b0c0b1d90b826ff2bb61a35707582c5a7b84e` | API response / run log |
| `ablation-receipt.json` | 4047 | `732c0d12c8fceebb9693c2f2d38eef04539d8f0f35a687c27092213dfc7a2b60` | byte copy of the City's campaign-481a1761-1b5d-440d-a5a0-1743599b512a.json |
| `canonical-tasks.json` | 2144 | `7e5a737dc37fe9b0c199b9d4fab646d9574c149a40aa73e825679943ea967a2d` | API response / run log |
| `deployment-and-topology.json` | 720 | `e2631def2cdeeef31161b009043594f9414077316d9df9b9d0ee6a49fa2c18c5` | API response / run log |
| `experiment-registry.json` | 19116 | `98ceb88979ff3d0266453be7b1ff10da972cbbe564a53ad2f47be91601271d44` | API response / run log |
| `replay-comparison.json` | 3537 | `c3148523f0f5191a82b7b75a055255fbca6fdbd9d27bccd81cbd86406c82b7c3` | API response / run log |
| `replay-receipt.json` | 3956 | `f74f725a564bbda21c15068f7e27319f42d28e74dcc2a974592893eef127f34f` | byte copy of the City's campaign-cdf39b7f-f6ff-4ddf-b611-4139f64c57d5.json |
| `RUN_LOG.txt` | 1770 | `a0b6fcb8bfa00c5f78c24e355b6878cf8b4d18502a0745f044ed98e797213a44` | API response / run log |
| `source-receipt.json` | 3693 | `34bf525779376299d010762fe54009a795239a7cfe16e9a16d1490a18d77c669` | byte copy of the City's campaign-966cf439-7017-4bb0-88e8-981e59c18322.json |

The receipts are byte copies, so a reader can compare them with the City. The source receipt was **not** rewritten into
a synthetic run - the handoff is explicit about that, and the synthetic instrument built earlier is deliberately not
evidence for this gate.

## 涓€澶勫鏃㈡湁璁板綍鐨勬洿姝?/ A correction to what this programme recorded earlier

The synthetic-source instrument reported `controlledInputsMatch:false` with `controlledInputDifferences:["limits"]`, and
that was recorded as a located finding pending a physical test. The physical test answers it: on a **really recorded**
source the comparison reports `controlledInputsMatch:true` with **no** differences. The `limits` difference therefore
belongs to the synthetic fixture - a patched run whose limits came from another derivation - and is not a property of
replays of physically recorded campaigns.

## 鏈娴嬮」 / NOT observed

```text
not observed   the handset-rendered view of either comparison on the physical device (no adb device on this host)
not observed   any claim about duration differences as performance: the comparison reports durationDeltaMs and the
               engine itself declines a causal performance claim (causalPerformanceClaim false)
not claimed    development completion, acceptance, or any merge authority - all three belong to the author or the Owner
```
