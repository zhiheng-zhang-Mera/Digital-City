# RECORD — Mech: the City is RESIDENT and VISIBLE, with a desktop shortcut, and this host is back in the queue

```text
FROM = Mech   RE = Owner instruction: re-enter the queue, and bring a City up ONCE and keep it resident,
                   like a Computer-Use session - with the run visible on screen.
STATE = done and verified across a call boundary, which is the only way "resident" means anything here.
```

## 1. What exists now, measured after the launching call had already ended

```text
visible console window   pid 21236   title "Utopia City - Mech-Win (resident)"   HasWindow = TRUE
this host's City         LISTENING on 172.31.12.151:4391   pid 42368
shared canonical City    nodes: Alien-Win=true, Mech-Win=true
desktop shortcut         D:\UserData\Desktop\Utopia City (Mech-Win).lnk
```

The check that matters is the **cross-call** one: the harness kills a process tree when the invoking call
ends, so "the window is still there and the port is still bound in the NEXT call" is the actual proof of
residency, not the fact that it started.

## 2. The desktop shortcut, and why it uses `start`

```text
D:\UserData\Desktop\Utopia City (Mech-Win).lnk   (930 bytes, WindowStyle = 1 = normal visible window)
  -> D:\A-utopia\.runtime\utopia-city-open.cmd
       start "Utopia City - Mech-Win" cmd /k "D:\A-utopia\.runtime\utopia-city-foreground.cmd"
  -> D:\A-utopia\.runtime\utopia-city-foreground.cmd
       node .runtime\tmp\mesh301-resident-city.mjs      (the supervisor: City + workers, held open)
```

**A `.cmd` launched directly from a non-interactive session gets a HIDDEN console**, so the first attempt
produced a fully working City with no window at all — verified, not assumed: the process tree was
`cmd /c launcher -> node supervisor -> node gateway`, and `HasWindow` was `False` with an empty title for every
process in it, while the City was listening normally. `start` asks Windows for a **new** console, which is what
actually makes the run visible. That is why the shortcut points at the opener rather than at the launcher.

## 3. What is resident, and what is deliberately NOT declared

- **Resident on this host:** a City (this host's own) and this host's worker.
- **Resident in the mesh:** `Mech-Win` is online in the **shared canonical City** (`22e1216b-…`, the other
  host's), so the three-end mesh always sees this endpoint without me starting anything per command.
- **This host's own City is NOT declared canonical for MESH-301.** It has a different `cityId`
  (`0841938e-…`). MESH-301 requires ONE canonical City; which one that is, is an Owner/Alien decision, and
  bringing a resident City up is not a licence to switch it. So the task's canonical City remains the other
  host's, and my City is a resident, separately-truthful instance.
- **Credentials are in the launcher under `.runtime/`, which is git-ignored** (`.gitignore:2:.runtime/`), so the
  token reaches the shortcut without entering any report, screenshot or Git object. No token value appears in
  this record.

## 4. Three faults of mine on the way, all recorded

1. **`CITY_HOST=0.0.0.0` does not work** — the gateway refuses it outright: *"Configure an explicit loopback or
   LAN interface"*. That is a deliberate safety property (a City must not silently appear on every interface),
   and my first resident attempt died with `exit code=1` because of it. Fixed by binding the **measured** LAN
   address, which also matches MESH-301's rule against treating an endpoint as anything but a measurement.
2. **I killed a process directly instead of using the job interface**, and the harness answered with
   `Windows Job runner exited with exit code 4294967295 before proving its managed range empty` — my command had
   reached into the harness's own managed job range. The supported route is the job tool, and I used it for the
   remaining cleanup. Recorded because a session-destabilising action is worth flagging even when it recovers.
3. **A PowerShell string round-trip corrupted a comment again**: a `-replace | WriteAllText` pass turned an
   em-dash into a mojibake character in the supervisor's first line — the same GBK double-encoding class I have
   reported in four mission-book workbooks and previously inflicted on my own instrument. Repaired with Node
   (not PowerShell) and the file is now **ASCII-only**, so the class cannot recur there.

## 5. What this does and does not change for MESH-301

- **Does:** completion gate 2's "two real worker nodes" now has a Mech endpoint that is **persistently** online
  rather than one that exists only inside a command, which matters because the bounded-convergence measurement
  (gate 8) needs a surface that is up when an event is emitted.
- **Does not:** implement or claim any strict-target behaviour (the development host's work), declare a
  canonical City, or move any gate. Gates 4, 5, 8 and 9 remain unmeasured; the Android control client is not in
  this picture at all.
