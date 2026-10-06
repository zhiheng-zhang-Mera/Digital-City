from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[3]
coverage=json.loads((Path(__file__).parent/'CLOUD_COVERAGE_2026-10-07.json').read_text(encoding='utf-8'))
records=coverage['supplemental_records'];seen=set()
for item in records:
    path=(root/item['published_path']).resolve()
    if not path.is_relative_to(root):raise RuntimeError('payload escapes repository')
    data=path.read_bytes()
    if len(data)!=item['published_bytes'] or hashlib.sha256(data).hexdigest()!=item['published_sha256']:raise RuntimeError('payload mismatch: '+item['published_path'])
    if item['historical_run_head'] is not None:raise RuntimeError('unexpected inferred historical head')
    if not item['redaction_count'] and item['original_sha256']!=item['published_sha256']:raise RuntimeError('undeclared original-byte change')
    seen.add(item['published_path'])
print(str(len(records))+' source records / '+str(len(seen))+' published payloads verified')
