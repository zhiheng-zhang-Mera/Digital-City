#!/usr/bin/env python3
"""Exercise relocated discovery and explicit planning exclusions without touching real planning files."""
from pathlib import Path
import sys,tempfile,unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parent))
import check_record_consistency as records
import sync_dependency_state as dependencies
import sync_documentation_navigation as navigation

class MissionLayoutTests(unittest.TestCase):
    def test_dgx_dependencies_wait_for_independent_accepted_head(self):
        with tempfile.TemporaryDirectory() as folder:
            mission=Path(folder)
            source=mission/'DGX-001.md';target=mission/'DGX-002.md'
            source.write_text('---\nworkbook_id: DGX-001\nreview_complete: false\ndevelopment_head_sha: '+'a'*40+'\n---\n',encoding='utf-8')
            target.write_text('---\nworkbook_id: DGX-002\nexecution_enabled: true\nowner_gate: NONE\nstatus: WAITING_DEPENDENCIES\nbaseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM\ndependencies: ["DGX-001"]\ndevelopment_baseline_sha: null\n---\n',encoding='utf-8')
            with patch.object(dependencies,'MISSION',mission):
                changes,errors=dependencies.planned_changes();self.assertEqual(errors,[]);self.assertEqual(len(changes),1)
                self.assertIn('DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE',changes[0][1]);self.assertNotIn('status: READY',changes[0][1])
                source.write_text('---\nworkbook_id: DGX-001\nstatus: COMPLETE\nterminal_marker: CONTROLLED_TEST_ACCEPTED\nreview_complete: true\nreview_head_sha: '+'b'*40+'\n---\n',encoding='utf-8')
                changes,errors=dependencies.planned_changes();self.assertEqual(errors,[]);self.assertIn('b'*40,changes[0][1]);self.assertIn('status: READY',changes[0][1])
    def test_discovery_keeps_foreground_and_archive_but_never_reads_planning(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder); mission=root/'mission-book'
            for sub,wid in [('mission-group/research-strengthening','REX-806'),('finished/completed-2026-10-06/closeout','CEX-790')]:
                p=mission/sub/(wid+'.md');p.parent.mkdir(parents=True,exist_ok=True)
                p.write_text('---\nworkbook_id: '+wid+'\nstatus: COMPLETE\nexecution_enabled: true\nreview_complete: true\nreview_head_sha: "'+'a'*40+'"\n---\n',encoding='utf-8')
            excluded=mission/'future-plans'/'UNREADABLE.md';excluded.parent.mkdir();excluded.write_bytes(bytes([255,254,0]))
            read=Path.read_text
            def guarded(path,*args,**kwargs):
                if 'future-plans' in path.parts:raise AssertionError('excluded planning was read')
                return read(path,*args,**kwargs)
            with patch.object(records,'MISSION',mission),patch.object(dependencies,'MISSION',mission),patch.object(Path,'read_text',guarded):
                found,unreadable=records.load();self.assertEqual(set(found),{'REX-806','CEX-790'});self.assertEqual(unreadable,[])
                changes,errors=dependencies.planned_changes();self.assertEqual(changes,[]);self.assertEqual(errors,[])
            self.assertNotIn(excluded,navigation.documents(root))
            self.assertEqual(len(navigation.documents(root)),2)

if __name__=='__main__':unittest.main()
