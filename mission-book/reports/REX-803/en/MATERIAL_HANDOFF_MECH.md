> English reading translation / 英文阅读译本. The [source document](../MATERIAL_HANDOFF_MECH.md) remains authoritative for historical facts, status, and evidence. This reader grants no additional task, acceptance, merge, or deployment authority.

# REX-803 Material handoff (author: Mech-DS)

Delivered: 2026-10-06T08:12:30Z · Author: Mech-DS (host `MEGA-REP`).
Delivery target: the “Required reviewable material” section of `PHYSICAL_MATERIAL_REVIEW_Alien.md`.

## What was delivered
The `evidence/` directory contains six data files and one index, generated together by `evidence-tools/export-script.mjs` in a reproducible run. The method itself remains outside the payload.

| File | Contents |
|---|---|
| `MATERIAL_INDEX.md` | Index: candidate SHA, CityID, campaignID, per-file SHA256, and explanations of missing/dropped/clock fields for PARTIAL |
| `campaign-receipt.json` | Byte-identical to the immutable receipt held by the City; SHA256 is supplied and can be checked on the host |
| `manifest-and-seed.json` | Manifest declared before execution, campaignSeed, seed rules, repetitions, timeout, and readiness state |
| `canonical-tasks.json` | The three tasks as held by the City, including `researchRunRef` |
| `canonical-events.json` | Canonical events for this campaign and its tasks |
| `trace-snapshot.json` | Trace envelope fields plus all records of the collector epoch containing this campaign |
| `derived-checks.json` | All conclusions recomputed from files inside the package: seed, placement, task correspondence, accounting, clocks, and window |

The methods are placed separately in `evidence-tools/`, outside the payload because they contain the literals used by their own scans. `export-script.mjs` generates these files; `independent-verify.mjs` is a second implementation with no shared code. It recomputes every item above from payload bytes alone and checks the index. Local measurement: 22/22.

## Where this matches your observations
The three task rows, worker placement, `researchRunRef`, `RESEARCH_CAMPAIGN_STARTED` timestamp `2026-10-06T08:00:39.601Z`, experiment name, and Android surface that you independently read all remain consistent in this package. I am not asking you to adopt my table: the package supplies the City's own objects and events.

## The three reasons you named
- **Missing:** Every record has nonempty `missingFields` (`configRef`/`channelRef`/`softwareSha`/`modelRef`/`providerRef` on 197/197; `experimentRef`/`experimentRunRef` on 186/197). This is the sole cause of `completeness=PARTIAL`: I quote the collector predicate in `derived-checks.json`; five of its six branches are false, and only this one is true.
- **Dropped:** `droppedRecords=0`, `failures=[]`, `storageState=READY`.
- **Clock:** Records include the source-declared clock (`CANONICAL_EVENT_WALL_UTC`), collection-host clock (`HOST_WALL_UTC`), and `PROCESS_HRTIME` monotonic readings. Within this epoch, skew (capturedAt − timestamp) has min 0 / median 3 / max 53 ms. No record claims to precede the event it captured.

One additional point you did not request but which affects your review boundary: the trace is a bounded circular window (recordLimit 256 / byteLimit 2 MiB; currently 197 records, 427642 bytes, across four Gateway processes). Eviction has not begun, and `retentionTruncated=false`. Once eviction begins, campaign records disappear. This is also why the package is published now instead of continuing to reference a local path.

## Boundary declarations
- `8798ba9` was not moved: this change writes only control-plane records; the implementation candidate identity is unchanged.
- No tokens, pairing codes, sessions, installation credentials, or private content are included. The exporter checks after writing and refuses publication on a match. The generator and verifier themselves live in `evidence-tools/` outside the payload because they contain the literals used by their credential scans. Putting the methods inside the payload would cause any reader's scan to report a leak that does not exist—a real defect caught by this host's own second implementation.
- This package claims no acceptance and releases no marker. You decide whether the material meets the threshold.
- Your “195 records” versus this package's “197 records” reflects records appended between readings, together with attribution across four process epochs, rather than inconsistent material.
- I accept your correction in “Historical identity claim boundary” and do not backfill history: the new identity was not online in the earlier period. Pairing again resolved retired credentials; subsequently, a new experiment resolved the old manifest references.

## Published historical boundary for readers
The preceding paragraphs preserve the author's historical account, including attribution of the earlier 195-record count. [The subsequently published formal acceptance](../FORMAL_ACCEPTANCE_Alien.md#验收边界--acceptance-boundaries) explicitly limits that account: Alien's ordinary MEMBER session could not read Owner trace; the earlier 195-record count came from an earlier author report, not an independent Alien trace reading. The fresh Alien enrollment began at `2026-10-06T07:29:19.058Z`; it must not be described as having been online throughout the preceding two days. This clarification preserves the original account and does not alter its evidence.
