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
