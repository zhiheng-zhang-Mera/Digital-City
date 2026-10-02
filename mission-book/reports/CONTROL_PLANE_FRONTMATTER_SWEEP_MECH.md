# CONTROL-PLANE INTEGRITY SWEEP — every workbook frontmatter parsed strictly

```text
PERFORMED BY = Mech, before the RESCHEDULING_BASELINE_FROZEN freeze
METHOD       = PyYAML with a STRICT mapping constructor that REJECTS duplicate keys
               (mission-book/reports/validate_frontmatter.py)
SCOPE        = all 266 markdown files under mission-book/
RESULT       = the entire ACTIVE construction surface is clean; all 9 problems are in the archive
```

## Why this check exists

Having just repaired duplicate frontmatter keys that **I** had introduced into UI-000 and UI-101, the
honest follow-up is not "those two are fixed" but "is anything else malformed". A regex scan for
`^key:` would miss duplicates written with odd spacing or nested inside sub-mappings, so this uses a
real parser with a duplicate-rejecting constructor. It also covers the other frontmatter error classes
I have personally hit on this programme: unterminated quoted values, a consumed field header, and the
UTF-8 BOM.

## Result

```text
scanned 266 markdown files
  valid frontmatter : 63
  no frontmatter    : 194
  PROBLEMS          :  9        <- all nine under finished/
```

**Zero problems in the active surface.** Every workbook in `ui-civilization/`, `rescheduling-vnext/`
and `ui-integration/`, and every report under `reports/`, parses as valid YAML with no duplicate keys.
That is the material result for the freeze: the control plane about to be frozen is well-formed.

## The nine archive problems, reported not fixed

Five are **not valid UTF-8** (invalid continuation byte at ~position 27):

```text
finished/completed-2026-10-01/reports/BA-005/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/EM-002/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/EM-005/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/GAI-003/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/RF-005/CORRECTION_REPORT.md
```

Four have a **YAML error at line 12, column 95** — an unquoted colon+space inside a value, so YAML
reads it as a nested mapping:

```text
finished/replant/MB-002-capability-fabric.md
finished/replant/MB-004-project-foreman.md
finished/replant/MB-005-host-health.md
finished/replant/MB-009-theme-relocation.md
      ... 243e166b112319b1663eebb3d763fcfc: gateway-web success, android s ...
```

**I am reporting these rather than repairing them, deliberately.** §0 scopes `finished/` as
追溯-only — it exists so old rules and dashboards can be read back, not to be maintained — and §9
limits work to workbook scope, an Owner ruling, a real defect in scope, or the minimal fix for an
existing contract. Rewriting archived records is none of those, and unlike the UI-000/UI-101 repair
there is no live claim truth at stake, because nothing in `finished/` participates in claim, review or
freeze. The argument for touching them is archaeology fidelity, which is worth an Owner decision rather
than a unilateral rewrite of historical files.

Their practical effect is bounded and worth stating precisely: the corrupted fields are unreadable to a
strict parser, so a reader cannot rely on the frontmatter of those nine files — but the surrounding
prose is intact, and no current task depends on them.

## Consistency with the earlier finding

The UI-000/UI-101 duplicates were **mine** and are now repaired. This sweep is what should have
preceded that repair, and it confirms the problem was limited to the two files I had touched rather
than being systemic. Recording that ordering honestly: the check came after the damage, again, which is
the same pattern as the BOM and the CRLF anchor problem.

## The validator is committed and re-runnable

`mission-book/reports/validate_frontmatter.py` — run it against `mission-book/` and it exits non-zero
if any frontmatter is malformed, so this becomes a gate that can be run before future freezes rather
than a one-off. It is the instrument that would have caught the UI-000/UI-101 duplicates before they
were committed.
