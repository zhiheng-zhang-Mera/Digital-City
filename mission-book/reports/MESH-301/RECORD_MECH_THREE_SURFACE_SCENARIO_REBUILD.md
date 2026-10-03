# RECORD — Mech: I rebuilt the three-surface scenario with my own instruments, and it converged; two defects in my own receipts were found by running it

```text
FROM = Mech (formal reviewer)      TO = Alien (development host), Owner
REVIEW HEAD = 09a5b89ab3040873791957d482814f2aefb7271a         STATUS = gate 10 PAUSED on D-R1, unchanged
EVIDENCE = branch review/MESH-301-mech-formal-review (updated)
```

The workbook's review section asks the reviewing host to *"用你自己的仪器重建三端同 City 的场景（不得只用开发主机的脚本）"*.
The Android device is the development host's to drive, so the third surface cannot be mine — but the whole
MECHANISM can be, and now is.

## 1. Three surfaces of my own, simultaneously, on the canonical City

```text
surface 1   Mech-Scenario-Web-xhtb8      the product's OWN browser UI, labelled before load
surface 2   Mech-Scenario-Probe1-xhtb8   my own stream client, its own clientRef
surface 3   Mech-Scenario-Probe2-xhtb8   my own stream client, its own clientRef

controlSurfaces at the start, de-duplicated by clientRef:
  ["PERM00", "Mech-Scenario-Web-xhtb8", "Mech-Scenario-Probe1-xhtb8", "Mech-Scenario-Probe2-xhtb8"]
  of those, mine: 3 of 3
```

Window: canonical seq `1403..1426`, generated from my side (an untargeted task, a strict task at `Alien-Win`, a
strict task at `Mech-Win`), observed for 75 s.

```text
                          seqs   range        offset    latency min/median/p95/max   breaches
Mech-Scenario-Web-xhtb8    24   1403..1426   -1046 ms   0 /  1 / 11 / 65 ms              0
Mech-Scenario-Probe1       23   1404..1426   -1046 ms   0 /  0 /  3 /  6 ms              0
Mech-Scenario-Probe2       22   1405..1426   -1046 ms   0 /  0 /  3 /  3 ms              0

common seq range 1405..1426 = 22 seqs   ·   missing observations: 0   ·   breaches: 0
VERDICT by the reviewer's own arithmetic (window 5000 ms): CONVERGED
```

And the cross-check, because a verdict computed by one implementation is one implementation's opinion — the
shared merge, run by me over the same three receipts with the offsets declared per surface:

```text
CONVERGED   failures 0   unmeasured 0   CONVERGED 63   BEFORE_OBSERVATION 4215   AFTER_OBSERVATION 9
```

My arithmetic and the development host's instrument agree. That is the point of running both.

## 2. Two defects this found in MY OWN work, both fixed by running it

**(a) Both probes shared one `clientRef`.** I derived the ref with `name.slice(-1)`, which is the last character
of a random tag rather than the probe number — so two sockets connected as the same client, the City listed
**2 of my 3 surfaces**, and my own scenario looked like a product fault. It is the same symptom as D-R1, caused by
me. The instrument now has a `mineListedOfThree` check that fails loudly on exactly this, and the corrected run
reports 3 of 3.

**(b) My receipts omitted the `resync` boundary record.** The shared merge establishes when a surface started
watching from that record, not from its first event, so it treated every canonical seq from 1 to 1376 as *"online
surface never observed seq N"* and returned **FAILED with 4128 failures** against three surfaces that had in fact
missed nothing.

I am recording (b) as a defect in my receipt and **not** as a defect in the merge. The merge failed closed on an
incomplete receipt, which is the behaviour this programme wants: the alternative is a tool that treats an
unreadable boundary as "nothing to report". What it does mean is that "the vocabulary is shared" is a claim about
the REQUIRED record set, not about the record set my own reader happens to need — a receipt that only satisfies
its author's reader is not a receipt.

## 3. What this adds, and what it does not

```text
ADDS    an independent reconstruction of "three surfaces, one City, bounded convergence" built entirely from
        the reviewer's instruments, with the verdict computed twice by two implementations.
DOES NOT replace the Android row. All three of these surfaces are on the Mech host; the Android surface is on
        wifi with a ~600 ms skew and is the development host's to drive. This strengthens gate 8's independence;
        it does not substitute for the device.
DOES NOT move gate 10. D-R1 is still open and still the one required repair.
```

## 4. Status, unchanged

```text
gate 10   PAUSED on D-R1 - no repair commit on mesh/MESH-301-three-end yet (tip is still 09a5b89)
gates 1-9, 11   MET
Endpoint A      resident City + worker up, visible console window, shared City shows Mech-Win online
```
