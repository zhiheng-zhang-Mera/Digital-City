# REX-803 three-end acceptance — material index

Published in answer to `../PHYSICAL_MATERIAL_REVIEW_Alien.md`, which asked for the raw package, the immutable
receipt and a trace snapshot / material index bound to the exact candidate, City and campaign, with the reasons the
trace is PARTIAL. Nothing here is an acceptance and nothing here decides a verdict; the reviewer owns that.

## Identity bindings

```text
candidate SHA declared by the receipt   8798ba9dd37051626033ad72080b2fad3ff66149
candidate SHA this package is bound to  8798ba9dd37051626033ad72080b2fad3ff66149
city ID                                 031fdba6-e94c-4298-a095-6ff04a65481d
campaign ID                             campaign-966cf439-7017-4bb0-88e8-981e59c18322
scenario / state / reason               WAIT / COMPLETED / REPETITIONS_FINISHED
city endpoint read from                 http://172.31.12.151:4391
exported at                             2026-10-06T08:16:03.675Z
```

The two candidate SHA lines must agree; `derived-checks.json` records the comparison as `candidateShaAgrees`.

## Files (SHA256 over the exact bytes written here)

| file | bytes | sha256 |
|---|---|---|
| `campaign-receipt.json` | 3693 | `34bf525779376299d010762fe54009a795239a7cfe16e9a16d1490a18d77c669` |
| `manifest-and-seed.json` | 2286 | `d747d84b7909c96bd62d1dfdf57359fcda667474c6e2a2bed91045389aa65dd1` |
| `canonical-tasks.json` | 2230 | `9244a3f9844887f90366e5d258573429205ac5652e4f3438c3fb73cd4b52665e` |
| `canonical-events.json` | 12441 | `07cd4afb4ca3b07d2dc94fe7856bf2d9e10cc490dc34c25471e367688c0bd9b4` |
| `trace-snapshot.json` | 116085 | `bcec4cff9fda3caf9e2312a5b6dd71100531216863a36a39cf133c0d30d3ca05` |
| `derived-checks.json` | 9896 | `0a509495f632d9b1e679f51ab8122c63b9ba110dcc86eab3b79a5f52d123b8ec` |

`campaign-receipt.json` is a byte-identical copy of the immutable receipt the City holds at
`C:/ProgramData/Utopia/host/city/research/campaigns/campaign-966cf439-7017-4bb0-88e8-981e59c18322.json` (SHA256 of that file: `34bf525779376299d010762fe54009a795239a7cfe16e9a16d1490a18d77c669`); a reader with
access to the host can confirm the copy byte for byte. This index cannot carry its own hash.

`../evidence-tools/` holds the method, outside this payload. `export-script.mjs` is the exact program that produced
every file here. `independent-verify.mjs` is a second implementation, written without shared code, that re-derives
every claim above from the published bytes alone and checks this index against them; run it as
`node evidence-tools/independent-verify.mjs mission-book/reports/REX-803/evidence`. Both live outside the payload
because they contain the literal strings their own credential scans look for, and a payload that makes a reader's scan
report a leak that is not there is worse than one without a bundled generator. They are the author's instruments,
not a review: the reviewer's probes remain the reviewer's, and may reject these.

The export script reads the owner credential from the host reservation at runtime, never writes it, and refuses to
publish if the result would contain the credential, a session id, a pairing code, a claim secret or a token field.

These files are marked `-text` in the repository `.gitattributes`, so a checkout on any host reproduces the exact
bytes hashed above rather than a line-ending-normalized copy: a hash mismatch caused by the reader's checkout would
otherwise be indistinguishable from a hash mismatch caused by the material. Verified by cloning the repository fresh
and hashing the files as the clone materializes them.

## Why the trace is PARTIAL, stated rather than implied

```text
storageState        READY
completeness        PARTIAL
counterScope        CURRENT_COLLECTOR_EPOCH_AND_RETAINED_WINDOW
droppedRecords      0
retentionTruncated  false
failures            []
experimentRunRef    null
experimentRunReason NOT_OBSERVABLE: recording run is not an experiment execution run
records in whole trace 197, in 4 collector epochs; published epoch trace-90320718-ee11-4f00-ac34-0b8918f16820 holds 52
```

The fields above are the whole of what the trace declares about its own boundary. It also declares, per record, which
fields the normalizer could not populate - and that turns out to be the entire cause of `PARTIAL`, which the section
below recomputes instead of leaving as a claim. Because `experimentRef` / `experimentRunRef` are among those missing
fields (the recording run is a collector run, not an experiment execution run), the campaign is bound in the trace by
the canonical task refs the normalizer does populate, inside the collector epoch that contains them - and that
narrowing is stated here instead of being left for the reader to discover.

### The cause of PARTIAL, recomputed rather than accepted

The collector decides completeness with a predicate (quoted in `derived-checks.json`, `traceCompleteness`): PARTIAL if
the storage is not READY, or anything was dropped, or retention truncated, or a failure was recorded, or any record
carries annotations or missing fields. Evaluated over the records returned:

```text
storageState READY                     -> does not hold
droppedRecords 0                       -> does not hold
retentionTruncated false               -> does not hold
failures []                            -> does not hold
records with annotations   0 of 197   -> does not hold
records with missingFields 197 of 197   -> HOLDS
```

So `PARTIAL` has exactly one cause here: every record declares the fields the normalizer could not populate. The counts
per field are in `derived-checks.json`; `experimentRef` and `experimentRunRef` are absent on most records because the
recording run is a collector run and not an experiment execution run, which is also what `experimentRunReason` says.
Nothing was dropped, nothing was truncated, the storage is READY and no failure was recorded - so the campaign records
in this package are complete as captured, while the trace as a whole is honestly reported as partial.

### The retained window is bounded, and how close it is

```text
recordLimit 256, held 197 (59 more records before the oldest is evicted)
byteLimit 2097152 bytes, held 427642 bytes (20.4%)
queueLimit 64
epochs in the window: trace-d2b8f040-f618-47bf-badc-05f8dc4e3f46=55 trace-0dd5f8c9-eb46-4a4e-8a77-29373bbe371c=76 trace-9f58bbc8-7764-4895-b27e-48dd98d0eca6=14 trace-90320718-ee11-4f00-ac34-0b8918f16820=52
```

The window spans four Gateway processes, which is why the records carry four run ids. The limits are the collector's
defaults, since the live Gateway configures only the directory and the source stream. Eviction has not started, and
`retentionTruncated` would flip to true when it does: the material here is intact, and it is inside a window that
will eventually evict it, which is the reason it is published now rather than referenced.

### Clocks

```text
declared source clock   CANONICAL_EVENT_WALL_UTC, EXTERNAL_DECLARED_WALL_UTC, HOST_WALL_UTC (event occurrence as declared by source)
capturing host clock    HOST_WALL_UTC
monotonic source        PROCESS_HRTIME
collector process epoch epoch-4dcb9fe9-7126-40aa-8f5d-6cc4c4279f04
capture skew (capturedAt - timestamp) over the published epoch: min 0ms, median 3ms, max 53ms
records captured before the occurrence they capture: 0
```

The two clocks are separate on purpose: an occurrence timestamp is the source event's own declared wall time, while
`capturedAt` is when this host recorded it, so their difference is transport and observation delay and not a
correction. No record in the published epoch claims to have been captured before it occurred.

### Why the published window is a snapshot of a live store

Alien counted 195 records at 2026-10-06T08:02:32.979Z; this export read 197. That is why the material is
published as hashed files naming their own epoch rather than as a count a reader would have to trust. The campaign
epoch is named above and its records are published whole.

The campaign window itself is closed and does not move: the receipt ran
2026-10-06T08:00:39.594Z to 2026-10-06T08:01:00.167Z, and every run task was created and
reached a terminal state inside it (`derived-checks.json`, `campaignWindow`).

Metrics with no retained measurement stay `available: false` with their reason (see `metricsAvailability`), rather
than being reported as zero. `latencyMs`, `cpuPercent` and `memoryBytes` are available; `backoffMs`,
`autonomousSpanMs` and `taskTransitionCount` are not.

## What a reviewer can check from this package alone

`derived-checks.json` recomputes each of these from the other files, quoting the seed function and the placement rule
from the candidate rather than restating a result:

```text
seeds           each run.seed re-derived from campaignSeed and index; recorded vs recomputed per run
placement       each run predicted as workers[seed % workers.length] (targetDeviceRef was null) vs assignedNodeId
end-to-end      each run task looked up in canonical-tasks.json: state COMPLETED and researchRunRef <campaignId>:<index>
accounting      receipt.summary re-counted against the runs array, including terminalAccountingComplete
clocks          the declared source clock vs the capturing host clock, with the skew distribution and a count of
                records captured before they occurred
window          every run task created and finished inside the receipt window; the campaign-start event inside it too
api agreement   the City's own /research/campaigns view of this receipt vs the receipt on disk
```

## What this package does NOT contain

This answers the part of the request that was a publication problem: the raw material sat only on the author's drive
and a reviewer on another host could not see it. Still outside it, and not claimed: the physical handset's own logs,
and anything read from the Alien host's filesystem. No token, session, pairing code, installation credential or
private content is present; the export script refuses to publish a package that contains any of them.
