# Pharmacology Simulation Centre — 药理模拟中心

```text
STATUS = DESIGN_ONLY_EXISTING_PROJECT
REPOSITORY = https://github.com/zhiheng-zhang-Mera/drug-simulator
SOURCE_SNAPSHOT = 23cbe9b8a416bc1023bd3ddf9e3bfd1629e05c9a
RUNTIME_IMPLEMENTED = FALSE
DOMAIN = HEALTH / PHARMACOLOGY
```

## Role

Own mechanistic simulation for a **fixed user-supplied drug/regimen set**:

```text
physiological baseline
+ compounds / dose / route / formulation / schedule
+ pharmacology evidence
→ PK / ADME
→ effective exposure
→ PK interactions
→ PD targets/pathways
→ physiological endpoints
→ adverse-effect state
→ uncertainty + evidence-governed report
```

It does not diagnose disease, choose drugs, optimize a stack, prescribe treatment or invent unsupported PK/PD parameters.

## Designed capability clusters

1. input/canonicalization and immutable simulation request;
2. physiological baseline projection;
3. administration events / regimen timeline;
4. PK / ADME and active-metabolite exposure;
5. effective exposure state;
6. PK drug-drug interaction resolver;
7. PD target/mechanism/pathway engine;
8. physiological endpoint aggregation;
9. adverse-effect attribution;
10. monotherapy vs combination comparison;
11. structured pharmacology evidence KB/governance;
12. parameter/model/evidence uncertainty;
13. reporting and overlapping validation forest.

## Honest implementation boundary

At snapshot `23cbe9b8a416bc1023bd3ddf9e3bfd1629e05c9a`, the repository contains only:

- `README.md`;
- `idea-structure.md`.

Therefore the City records **design authority/provenance**, not a running pharmacology service.

## Relationship to Parama-Health

The two projects are not merged.

### Input road

```text
Parama PersonalContextSnapshot
→ minimal PhysiologicalBaseline projection
→ Drug Simulator
```

Possible fields include time-valid body composition, renal/hepatic/cardiovascular/metabolic modifiers and pharmacogenomic context when actually available. Missing values remain missing; population defaults must remain tagged as defaults.

### Output road

```text
EffectiveExposureState
+ mechanism/pathway effects
+ physiological endpoints
+ adverse-effect signals
+ uncertainty/evidence
→ Parama Exposure Context / State Estimator
```

These outputs remain simulated/inferred evidence, not clinical truth.

## Boundary

- pharmacology domain knowledge stays in 05;
- generic literature/document infrastructure may be provided through shared roads later;
- “Research OS” methodology reuse does not move this Health-domain kernel into 06 Research;
- no automatic safety, treatment or dosing recommendation is produced.
