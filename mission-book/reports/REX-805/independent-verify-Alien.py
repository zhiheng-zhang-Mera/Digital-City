"""Read-only packet verification / 只读材料核验; never invokes the product engine."""
from pathlib import Path
import hashlib
import json
import re


def verify(base, expected_candidate="4b3946868d4083285da8a8d99eac2642890b37c4"):
    results = []
    def check(name, value):
        results.append({"check": name, "pass": bool(value)})
    def read(name):
        return json.loads((base / name).read_text(encoding="utf-8-sig"))
    index = (base / "MATERIAL_INDEX.md").read_text(encoding="utf-8-sig")
    for name, size, sha in re.findall(r"\| `([^`]+)` \| (\d+) \| `([0-9a-f]{64})`", index):
        data = (base / name).read_bytes()
        check(name + ": bytes", len(data) == int(size))
        check(name + ": SHA256", hashlib.sha256(data).hexdigest() == sha)
    source = read("source-receipt.json")
    prior = base.parent.parent / "REX-803" / "evidence" / "campaign-receipt.json"
    check("source bytes equal accepted REX803 receipt", (base / "source-receipt.json").read_bytes() == prior.read_bytes())
    selected = next(run for run in source["runs"] if run["index"] == 1)
    serialized = json.dumps(source, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    source_digest = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
    check("independent canonical source digest", source_digest == "1390b60885d52bf1284b7b57f0a94a3db67d39ecedfb271a94d9c119035ed67a")
    seed = 2166136261
    for char in source["campaignSeed"] + ":1":
        seed = ((seed ^ ord(char)) * 16777619) & 0xffffffff
    check("independently derived seed", seed == selected["seed"] == 414121415)
    tasks = {task["id"]: task for task in read("canonical-tasks.json")["tasks"]}
    registry = read("experiment-registry.json")
    source_task = tasks[selected["result"]["taskRef"]]
    check("original canonical task completed", source_task["state"] == "COMPLETED")
    check("original canonical task placement", source_task["assignedNodeId"] == selected["result"]["assignedNodeId"])
    workers = source["context"]["manifest"]["workers"]
    identities = {source["campaignId"]}
    experiments = {source["context"]["experimentId"]}
    for mode, prefix, worker in (("REPLAY", "replay", workers[seed % len(workers)]), ("ABLATION", "ablation", workers[0])):
        receipt = read(prefix + "-receipt.json")
        comparison = read(prefix + "-comparison.json")["comparison"]
        context = receipt["context"]
        lineage = context["replay"]
        run = receipt["runs"][0]
        check(prefix + ": terminal measured run", receipt["state"] == "COMPLETED" and len(receipt["runs"]) == 1 and run["state"] == "MEASURED" and run["measured"] is True and run["warmup"] is False)
        check(prefix + ": fresh campaign", receipt["campaignId"] not in identities)
        identities.add(receipt["campaignId"])
        check(prefix + ": fresh experiment", context["experimentId"] not in experiments)
        experiments.add(context["experimentId"])
        check(prefix + ": selected seed and offset", run["seed"] == seed and receipt["seedIndexOffset"] == 1 and receipt["campaignSeed"] == source["campaignSeed"])
        check(prefix + ": source lineage", lineage["sourceCampaignId"] == source["campaignId"] and lineage["sourceRunIndex"] == 1 and lineage["sourceRunRef"] == source["campaignId"] + ":1" and lineage["sourceExperimentId"] == source["context"]["experimentId"])
        check(prefix + ": source digest", lineage["sourceReceiptDigest"] == source_digest and lineage["sourceDigestKind"] == "CANONICAL_PARSED_RECEIPT_SHA256")
        disabled = [] if mode == "REPLAY" else ["alternate-device"]
        check(prefix + ": exact mechanism", lineage["mode"] == mode and lineage["disabledMechanisms"] == disabled and comparison["disabledMechanisms"] == disabled)
        check(prefix + ": original controls", receipt["scenarioId"] == source["scenarioId"] == "WAIT" and receipt["timeout"] == source["timeout"] == 30000 and receipt["limits"] == source["limits"] == {"maxFailures": 3})
        check(prefix + ": worker placement", run["result"]["assignedNodeId"] == worker == comparison["expectedTarget"])
        task = tasks[run["result"]["taskRef"]]
        check(prefix + ": task binding", task["state"] == "COMPLETED" and task["assignedNodeId"] == worker and task["researchRunRef"] == receipt["campaignId"] + ":0")
        registered = registry[context["experimentId"]]["experiment"]
        original = registry[source["context"]["experimentId"]]["experiment"]
        check(prefix + ": registered experiment", registered["status"] == "VALIDATED" and registered["experimentId"] == context["experimentId"])
        expected_manifest = json.loads(json.dumps(source["context"]["manifest"]))
        expected_manifest["repetitions"] = 1
        for condition in expected_manifest["stopConditions"]:
            if condition["kind"] in ("MAX_REPETITIONS", "MIN_SUCCESSFUL_RUNS"):
                condition["value"] = 1
        check(prefix + ": manifest controls independently match", context["manifest"] == expected_manifest)
        check(prefix + ": registry corresponds to receipt", all(registered["manifest"][key] == value for key, value in context["manifest"].items()))
        check(prefix + ": registry source references preserved", registered["manifest"]["softwareRefs"] == original["manifest"]["softwareRefs"] and registered["manifest"].get("references") == original["manifest"].get("references"))
        check(prefix + ": registry manifest identity", hashlib.sha256(registered["digest"].encode("utf-8")).hexdigest()[:32] == context["manifestIdentity"])
        check(prefix + ": reported comparison", comparison["controlledInputsMatch"] is True and comparison["controlledInputDifferences"] == [] and comparison["original"] == selected and comparison["replayed"] == run)
        check(prefix + ": placement delta", comparison["placementChanged"] == (worker != selected["result"]["assignedNodeId"]))
        check(prefix + ": duration delta", comparison["durationDeltaMs"] == run["durationMs"] - selected["durationMs"] and comparison["causalPerformanceClaim"] is False)
        check(prefix + ": provenance remains unobserved", lineage["currentProcessSoftwareSha"] is None and lineage["determinism"] == "CONTROL_INPUTS_ONLY")
    deployment = read("deployment-and-topology.json")
    check("published deployment candidate matches requested exact head", deployment["candidate"] == expected_candidate)
    check("canonical City binding", deployment["cityId"] == "031fdba6-e94c-4298-a095-6ff04a65481d")
    return {"scope": "Published physical packet only; no formal acceptance or independent remote-process attestation", "published_candidate": deployment["candidate"], "expected_candidate": expected_candidate, "checks": results, "passed": sum(row["pass"] for row in results), "total": len(results)}


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--packet", choices=("evidence", "evidence-repaired"), default="evidence")
    parser.add_argument("--candidate", default="4b3946868d4083285da8a8d99eac2642890b37c4")
    args = parser.parse_args()
    result = verify(Path(__file__).parent / args.packet, args.candidate)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(result["passed"] != result["total"])
