# PCF-700 Review readiness packet (author side)

This file reduces the FIRST step of the opposite-host review to one command: the author has written every claim as a
recomputable check, so the reviewer can spend effort on JUDGEMENT instead of on rediscovering what was measured.

```text
STATUS             REVIEW_READINESS_ONLY (this is not a review, releases no terminal marker and carries no verdict)
REVIEW TARGET      b8c142277f6425a265e88dcca75a98faf1a47742 (branch and pcf/series-mech both point at it)
AUTHOR HOST        Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
RECORD             data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json (machine-readable, identical bytes in both)
INSTRUMENT         utopia:scripts/pcf700-review-packet.mjs (this file is the baseline of its output)
```

## 1. How the reviewer runs it (two commands, or one)

```bash
# one command: recompute and compare against the published record, field for field
node scripts/pcf700-review-packet.mjs

# if your sandbox forbids capturing a child process's output (this project's Windows confined mode does), split it:
node scripts/pcf700-reuse-audit.mjs --out /tmp/observed.json
node scripts/pcf700-review-packet.mjs --observed /tmp/observed.json --out /tmp/packet.txt
```

Expected output (measured on this host at exact `b8c1422`, verbatim):

```text
PCF-700 review packet (review-readiness recomputation)
published record: data-records/zh-CN/pcf/reuse-wiring-audit.json
observed report: recomputed in place by scripts/pcf700-reuse-audit.mjs

PASS  C1  the published record recomputes field for field (host/node metadata excluded)
        no evidence drift
PASS  C2  exactly four contracts are LIVE_WIRED: execution-backend-v1, node-descriptor-v1, remote-local-discovery-v1, rs-presentation-contract-v1
        observed: execution-backend-v1, node-descriptor-v1, remote-local-discovery-v1, rs-presentation-contract-v1
PASS  C3  no engineering-* or general-ai-* contract has a production referrer
        zero production references, as recorded
PASS  C4  no backend module imports a front-end module
        []
PASS  C5  every /api/v0 literal a user surface names resolves against a gateway route
        unresolved: 0; ui files naming endpoints: 14
PASS  C6  no runtime module refers to the fabric, so this is still an audit
        []
PASS  C7  the candidate PCF directories were not created by this audit
        contracts/personal-compute-fabric-v1 and services/personal-compute-fabric absent
PASS  C8  every single-writer fingerprint (bytes/lines/SHA256) recomputes
        5 files match

8/8 checks pass
This packet recomputes the author's claims; it is not a review and releases no terminal marker.
```

The comparison deliberately EXCLUDES `measuredAt` (the host name and node version legitimately differ on the
reviewer's machine) and sorts every list: **a difference in the report means a difference in the EVIDENCE, not in the
machine.**

## 2. This packet was falsified, otherwise it would just be pretty output

```text
tamper with one single-writer SHA256 (766f7b... -> deadbeef...) -> C1 and C8 FAIL, 6/8, exit 1
change one tier from COMPONENT_TESTED to LIVE_WIRED       -> C1 FAILS, 7/8, exit 1
temporarily create contracts/personal-compute-fabric-v1/  -> C7 FAILS (and C1 with it, via contractDirectoryCount), exit 1
after restoring everything                                -> 8/8, exit 0
```

## 3. What this packet does NOT prove (the reviewer still does it)

```text
* TWO_HOST_VERIFIED and ORIGIN_AGENT_CONSUMED are BOTH EMPTY: the packet only recomputes single-host static evidence.
  The cross-host sample call chain must be genuinely executed by the other physical host (EXECUTION_CONTRACT 14).
* The packet runs no test suite: C1-C7 recompute static and record-level facts, so the 7/7 and 4/4 suites must be run
  and falsified by the reviewer (R2/R3 of REVIEW_HANDOFF_Mech.md).
* The packet does not judge whether the design is right; it judges whether the author's measurements recompute.
```

## 4. The author's two instrument errors on this packet (recorded, not hidden)

```text
E1  the first probe CRASHED on a BOM-prefixed record (Windows PowerShell 5.1's Set-Content -Encoding UTF8 writes one
    by default) and that crash ALSO returned exit code 1 - the right exit code for the wrong reason. Fix: strip a BOM
    when reading; pass or fail is still decided only by C1-C8.
E2  capturing a non-zero-exit node process through a PowerShell pipeline can swallow its stdout (which is why the FAIL
    lines were invisible for a moment). Fix: the packet supports --out and all falsification evidence is read from that
    file; that is also why section 1 documents the --out invocation.
```
