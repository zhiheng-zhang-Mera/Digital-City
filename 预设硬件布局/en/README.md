# Preset hardware layout — full English reading

[Chinese source and navigation](../README.md). PRESET / NON-BINDING. Scope: personal Utopia/Digital-City workbench topology and purchasing anchors. Prices are the original 2026-10 China-market snapshot, not refreshed quotations; reprice and inspect condition before ordering. This translation does not activate hardware construction.

## 1. Design positioning

A dual-node personal computing workbench designed for long unattended, independent operation and temporary laptop maintenance. The two nodes have equivalent performance/capability. Either must independently host all Utopia core services. Normal mode is Primary+Warm Secondary; the secondary stays online for replication, backup, health and modest background work. Both can compute under high load. Switch primary monthly A→B/B→A as a real disaster-recovery drill. Windows/Mac laptops serve initial setup, occasional inspection and repair, without becoming runtime dependencies. Phones/PCs/Macs do not count toward this computing baseline.

## 2. Target capability

Recommended per-node target: 24–32 physical server CPU cores, 256GB ECC RAM, 24–48GB CUDA VRAM, roughly 8TB mirrored high-speed working space depending on ZFS/mirror layout, independent BMC/IPMI, 10GbE external network and direct 25GbE interconnect. Each node independently sustains all core services.

Engineering capacity anchors: recommended node about 3 mid/high-end development/gaming PCs in aggregate CPU/RAM multitasking; low-cost node about 2–3; recommended dual-node operation about 5–6 in practical parallel engineering. Equivalence refers to combined Agent/CI/build/VM/browser automation/Computer Use/vision/local AI/database/background throughput, not treating one GPU as three gaming GPUs.

Typical recommended-node allocation:

| Resource area | CPU | RAM | Typical responsibility |
|---|---:|---:|---|
| Utopia / Host | 8C | 80–112GB | Core、Scheduler、DB、Cache、monitoring、base services |
| Heavy Worker A | 8C | 48GB | Agent / CI / VM |
| Heavy Worker B | 8C | 48GB | Agent / Browser / Computer Use |
| Heavy Worker C | 8C | 48GB | compilation / tests / VM / background tasks |

Scheduler allocation is dynamic; fixed slices are not required.

## 3. Two-node topology

~~~text
                    Home LAN / Internet
                          │
                ┌─────────┴─────────┐
                │                   │
             Node A              Node B
          Primary/Secondary   Primary/Secondary
                │                   │
                ╞════ 25GbE ════════╡
                │   Direct Fabric   │
                │                   │
              BMC A               BMC B
                └──── Management ───┘
                          │
                  Temporary Laptop
                    Win / macOS
~~~

Network planes: business (terminals, Utopia Client, Internet, LAN); direct A↔B 25GbE SFP28 DAC (replication, migration, models, VMs, artifacts and primary workload handoff); independent BMC/IPMI management (power, POST/BIOS, installation media, remote console even after OS failure). Use standard IP abstractions so future 50/100GbE/fiber/switched fabric upgrades do not require Utopia architecture changes.

## 4. Long-term hardware principles

### Avoid generational churn

Expect 4–6 years of stable core-platform use after initial construction. Upgrade only for sustained workload exceeding safe headroom, definite VRAM bottlenecks, insufficient storage capacity/endurance, failure/unsafe support lifetime, or a meaningful maintenance-cost reduction rather than benchmark scores.

### Prefer standard components

Standard PCIe GPUs, DDR5 ECC RDIMM, U.2/U.3/M.2 NVMe, SFP28/Ethernet, ATX/EEB/server power interfaces, BMC/IPMI and replaceable fans/backplanes/cables. Avoid binding the architecture to one OEM's proprietary motherboard, PSU, riser, drive tray or irreplaceable backplane.

### Chinese supply-chain policy

Prefer mature Chinese suppliers for large 4U/pedestal chassis, hot-swap backplanes, redundant PSUs, fans/cables, DAC, UPS/power distribution, racks/brackets/mechanical structures. Current core ecosystem defaults to AMD EPYC/x86-64 CPUs and NVIDIA CUDA GPUs. Full domestic sourcing is not a goal. Any CPU/GPU replacement must first demonstrate that Linux/KVM/Docker/CUDA-equivalent software does not increase Owner maintenance burden.

### Used enterprise components

Mature retired GPUs, 25GbE NICs, enterprise U.2/U.3 NVMe and ECC RDIMM are allowed/encouraged to reduce TCO. Acceptance gates: GPU full-VRAM stress, ECC/errors, temperature, power and long stress; SSD full SMART, Percentage Used, Media Error, writes, power-on time and firmware; NIC firmware, SR-IOV, link stability and actual 25GbE throughput; RAM full MemTest/ECC-event checks.

## 5. Recommended plan

Goal: long-term use after one build; stable aggregate three-PC capacity per node; expansion headroom for a second GPU and faster network.

| Component | Recommended model / plan | Key specifications | Quantity | 2026-10 reference price | Per-node subtotal | Notes |
|---|---|---|---:|---:|---:|---|
| CPU | **AMD EPYC 8324P** | 32C/64T；2.65GHz Base；3.0GHz Boost；180W；SP6；6-channel DDR5-4800；96×PCIe 5.0 | 1 / node | ¥13,500–16,500 | ¥13,500–16,500 | CPU anchor for a three-PC-equivalent node |
| Motherboard | **ASRock Rack SIENAD8-2L2T** or equivalent SP6 server board | ATX；8×RDIMM；4×PCIe 5.0 x16 + 1×x8；2×10GbE；independent IPMI/BMC | 1 / node | ¥5,500–7,500 | ¥5,500–7,500 | Prioritize multi-GPU/expansion space and BMC |
| RAM | 64GB DDR5-4800 ECC RDIMM ×4 | 256GB / node；ECC；expandable later | 4 / node | ¥2,500–3,400 / module | ¥10,000–13,600 | May expand to 384/512GB later; not an initial requirement |
| GPU | **NVIDIA RTX A6000 48GB accepted used unit** | 48GB GDDR6 ECC；PCIe 4.0 x16；300W；CUDA；active blower cooling | 1 / node | ¥8,000–13,500 | ¥8,000–13,500 | Prioritize 48GB VRAM over newest GPUs; acceptance testing required |
| System drives | 1.92/2TB enterprise NVMe ×2 | Mirror；Host, Core, DB metadata, critical systems | 2 / node | ¥900–1,400 / drive | ¥1,800–2,800 | Prefer enterprise drives with PLP |
| Working drives | 3.84TB enterprise U.2/U.3 NVMe ×4 | Enterprise TLC; Mirror+Mirror/ZFS suggested; about 7.68TB effective mirrored capacity | 4 / node | ¥1,000–1,600 / drive | ¥4,000–6,400 | Prefer retired enterprise drives with excellent SMART health |
| Inter-node NIC | Mellanox/NVIDIA ConnectX-4 Lx dual-port 25GbE | 2×SFP28；PCIe 3.0 x8；SR-IOV；mature Linux/Proxmox support | 1 / node | ¥500–900 | ¥500–900 | Second port reserved for redundancy/expansion |
| 25GbE DAC | SFP28 DAC | 25Gbps；point-to-point direct link | 2 / workbench | ¥100–250 / cable | about ¥100–250 amortized per node | One production cable and one spare |
| CPU cooling | SP6 4U / Tower Server Cooler | Supports ≥180W TDP; replaceable standard fan | 1 / node | ¥400–800 | ¥400–800 | Avoid irreplaceable proprietary cooling |
| Chassis + PSU | Chinese-made 4U GPU/pedestal chassis with 1200W redundant PSU | ATX/EEB, full-height GPU, hot-swap bays, redundant power | 1 / node | ¥3,200–4,500 | ¥3,200–4,500 | Seek quotations from established Chinese server suppliers such as Gooxi |
| UPS | **Santak C3K(G7) or equivalent 3kVA online UPS** | 3000VA / 3000W；sine wave; unattended server shutdown support | 1 / node | ¥3,800–5,000 | ¥3,800–5,000 | Independent A/B UPS units reduce shared failure domains |
| Management switch | Basic 1GbE/2.5GbE management switch | BMC A/B and temporary laptop management network | 1 / workbench | ¥300–800 | — | Does not carry high-volume inter-node traffic |
| Cables/spares | Ethernet cables, spare SFP28, fans, brackets, etc. | Keep basic on-site repair spares | 1 set / workbench | ¥500–1,000 | — | Store together with the workbench |

Budget: node body ¥50,800–72,000; dual nodes plus shared management/spares ¥102,000–146,000; planning anchor roughly ¥100,000–145,000 per complete workbench. Excludes shipping, special taxes, room HVAC/ventilation, Internet and long-term off-site backup.

## 6. Lower-cost alternative

Preserve dual nodes, ECC, BMC, direct physical links and monthly switching while reducing initial price. Trade-offs: CPU concurrency headroom, VRAM/enterprise GPU features, some system-drive endurance and expansion slots.

| Component | Lower-cost alternative | Key specifications | Quantity | 2026-10 reference price | Per-node subtotal | Trade-off against recommendation |
|---|---|---|---:|---:|---:|---|
| CPU | **AMD EPYC 8224P** | 24C/48T；2.55GHz Base；3.0GHz Boost；160W；SP6；96×PCIe 5.0 | 1 / node | ¥6,500–8,500 | ¥6,500–8,500 | Less CPU concurrency; same SP6 platform |
| Motherboard | **ASRock Rack SIENAD8UD-2L2Q** or equivalent | 8×RDIMM；2×PCIe 5.0 x16 + 1×x8；onboard dual 25GbE SFP28；IPMI | 1 / node | ¥4,800–6,500 | ¥4,800–6,500 | Fewer slots, but primary and second GPUs can still be planned |
| RAM | used/pulled 64GB DDR5-4800 ECC RDIMM ×4 | 256GB / node；ECC | 4 / node | ¥1,300–2,000 / module | ¥5,200–8,000 | Full memory stress and ECC checks required |
| GPU | **RTX 3090 24GB accepted used unit** | 24GB GDDR6X；CUDA；about 350W | 1 / node | ¥7,500–8,500 | ¥7,500–8,500 | Half VRAM; no professional ECC/vGPU advantages; greater space/cooling needs |
| System drives | 2TB TLC NVMe ×2 | Mirror；consumer/near-enterprise drives | 2 / node | ¥600–900 / drive | ¥1,200–1,800 | May lack PLP; mirrored drives and node replication mitigate risk |
| Working drives | Used 3.84TB enterprise U.2/U.3 NVMe ×4 | Enterprise TLC; acceptable SMART; ZFS/mirror | 4 / node | ¥850–1,300 / drive | ¥3,400–5,200 | Accept only healthy drives with full SMART reports |
| Inter-node NIC | Use onboard dual 25GbE | 2×SFP28 | 0 additional | ¥0 | ¥0 | Saves separate NIC; reassess interface when changing motherboard |
| 25GbE DAC | Chinese-made SFP28 DAC | 25Gbps | 2 / workbench | ¥100–250 / cable | about ¥100–250 amortized per node | Same as recommendation |
| CPU cooling | Chinese-made SP6 4U server cooler | ≥160W TDP | 1 / node | ¥300–500 | ¥300–500 | Consider fan lifespan and noise |
| Chassis + PSU | Chinese-made 4U GPU chassis with 1200W PSU/basic redundant PSU | Full-height GPU; 4U airflow | 1 / node | ¥2,800–3,500 | ¥2,800–3,500 | Retain 4U airflow and basic hot-swap capability |
| UPS | Kehua KR3000L-J/equivalent 3kVA online | about 2700W; online | 1 / node | ¥1,700–2,900 | ¥1,700–2,900 | Confirm batteries, communications and automatic shutdown before ordering |
| Management switch | Basic gigabit switch | BMC A/B and maintenance laptop | 1 / workbench | ¥200–400 | — | Management plane only |
| Cables/spares | Basic Chinese-made spares | DAC/Ethernet cables/fans/brackets | 1 set / workbench | ¥300–800 | — | Keep critical cable redundancy |

Budget: node body ¥33,500–46,000; dual nodes with shared management/spares ¥68,000–93,000; planning anchor roughly ¥70,000–95,000.

## 7. Capability differences

| Item | Recommendation | Lower-cost alternative |
|---|---|---|
| Per-node overall positioning | About 3 mid/high-end development/gaming PCs | About 2–3 |
| Two-node high-load capacity | About 5–6 equivalent PCs in practical parallel engineering | About 4–5 |
| CPU | 32C/64T | 24C/48T |
| RAM | 256GB ECC | 256GB ECC |
| VRAM per GPU | 48GB ECC | 24GB |
| Local AI headroom | High | Medium |
| BMC/IPMI | Retained | Retained |
| Direct dual-node 25GbE | Retained | Retained |
| Monthly primary-workload switch | Retained | Retained |
| Independent node survival | Required | Required |
| Future second GPU | Strong | Possible; confirm slots/cooling |
| Long-term platform lifespan | High | High; same SP6 |

## 8. Operating modes

Daily:

~~~text
Node A = PRIMARY
Node B = WARM SECONDARY
~~~

Secondary continuously replicates data/state, database, artifacts/key configuration, monitors health, runs minor background tasks and prepares takeover.

High load:

~~~text
Node A + Node B = ACTIVE COMPUTE
~~~

Control must always identify the Primary; dual-node computation must not produce concurrent primary writes.

Monthly switch:1 secondary health check;2 replication lag→0;3 current Primary stops accepting new tasks;4 finish/checkpoint remaining tasks;5 promote Secondary;6 core-service smoke test;7 demote old Primary;8 record outcome. The purpose is to keep proving actual disaster-recovery takeover, rather than letting a server rest.

## 9. Laptop maintenance

A Windows/Mac laptop is not a permanent controller. First connect management network and configure BIOS/BMC, Linux/hypervisor, Utopia, networks/direct 25GbE, storage, GPU, UPS, autostart, watchdog and failover. Afterwards perform independent-operation acceptance with the laptop unplugged.

Occasional inspections: BMC/IPMI, temperatures/fans/voltages, SMART, ECC events, logs, firmware, manual disaster recovery and BIOS/OS rescue when needed. Even if Linux, SSH, Utopia or business networking fails, BMC should still support power control, POST/BIOS console and installation media.

## 10. Purchasing and price updates

Models are purchasing anchors, not permanent locks. Substitutions must satisfy the same capability contract: equivalent CPU core class/server virtualization/PCIe lanes; ECC RDIMM at least baseline capacity; preferably CUDA GPU with no unassessed VRAM reduction; BMC/IPMI motherboard; independent high-speed physical interconnect; mirrored system drives and node replication; preferably redundant power for unattended operation; UPS safe-shutdown/restart path. Recollect prices before real purchasing rather than constantly changing models to make this README appear live.

## 11. Original 2026-10 specification/price reference baseline

The source cites AMD EPYC 8004 official specifications/1kU prices, ASRock Rack EPYC 8004/SP6 specifications, 2026 used RTX A6000/3090 quotations, retired 3.84TB enterprise NVMe ranges, used Mellanox ConnectX-4 Lx 25GbE, Chinese 4U GPU chassis/1200W redundant PSU public quotes, and Santak/Kehua 3kVA online UPS quotes. These are architecture-budget references. Actual purchasing must prioritize exact model, firmware, health, warranty, invoices/taxes and shipping. This translation preserves those historical claims and does not assert refreshed source verification.
