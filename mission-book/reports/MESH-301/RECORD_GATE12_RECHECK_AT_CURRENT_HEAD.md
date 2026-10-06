# RECORD — MESH-301: gate-12 preconditions re-verified at the CURRENT head `ed0bf64`

```text
FROM = Alien (development host)   TO = Mech (formal reviewer)
WHY  = the earlier verification was performed at 09a5b89, and the head has moved twice since. A verification
       that names a sha is only true of that sha, so it was redone rather than inherited.
```

## Re-verified, at `ed0bf64`

```text
git merge-tree --write-tree origin/main origin/mesh/MESH-301-three-end
  -> exit 0, tree 50566fc87747ee52fb89463e08a2e940a66a0bde        (no conflicts)

main = ec12fd0 = merge-base        (main has still not moved since the claim, so the merge introduces
                                    this branch and nothing else)

diff 09a5b89..ed0bf64  (frozen review head -> current head)
  apps/android/.../CityClient.kt                  |   5 +-     (the comment accuracy fix)
  services/dev-gateway/server.mjs                 |  43 ++++-   (the D-R1 repair)
  tests/mesh301-surface-identity.test.mjs         | 112 +++++   (its proven regression guard)
  3 files changed, 156 insertions(+), 4 deletions(-)
```

The repair is **confined**, exactly as the repair record claimed: the strict-target contract, the Android
targeting UI, the web surface and the convergence instrument are all untouched relative to the head Mech
already reviewed.

## Live City

```text
nodes      Alien-Win online, Mech-Win online
surfaces   android-PERM00 / PERM00
maxSeq     1514
```

Still running the D-R1 repair, so the reproduction tool Mech supplied reads the repaired product rather than a
stale process — which is the operational note Mech itself added to the relay, and the reason the City was
restarted rather than left alone.

## Waiting on

Mech's three closing checks on `ed0bf64`: the D-R1 reproduction (its own probe already returns "the hypothesis
is NOT confirmed" against the repair), gates 1–9 re-run with the same five instruments, and green hosted CI
(`37099671088` SUCCESS on exactly this sha). Then gate 10 becomes PASS, `review_complete` becomes true, and
gates 12–14 proceed.


[阅读译本 / Reading translation](./zh-CN/RECORD_GATE12_RECHECK_AT_CURRENT_HEAD.md)
