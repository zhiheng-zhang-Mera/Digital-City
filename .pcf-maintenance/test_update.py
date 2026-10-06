import unittest
from update import set_field, append_section, validate_graph, assert_parked

class PlanningSafety(unittest.TestCase):
    def test_frontmatter_only(self):
        source='---\nworkbook_id: PCF-708\nexecution_enabled: false\nspec_revision: 1\n---\n# spec_revision: 1\n'
        changed=set_field(source,'spec_revision','2')
        self.assertIn('spec_revision: 2\n---',changed)
        self.assertIn('# spec_revision: 1',changed)
    def test_new_field(self):
        self.assertIn('dependencies: ["PCF-725"]',set_field('---\nworkbook_id: URA-002\n---\n','dependencies','["PCF-725"]'))
    def test_no_active_rewrite(self):
        with self.assertRaises(ValueError): assert_parked('---\nexecution_enabled: true\n---\n')
    def test_no_claim_rewrite(self):
        with self.assertRaises(ValueError): assert_parked('---\nexecution_enabled: false\ndevelopment_host: Alien\n---\n')
    def test_accept_empty_anchor(self):
        assert_parked('---\nexecution_enabled: false\ndevelopment_host: null\ndevelopment_baseline_sha: null\n---\n')
    def test_history_before_generated_navigation(self):
        result=append_section('# title\n\n<!-- DOCUMENT_NAVIGATION:START -->\nold\n<!-- DOCUMENT_NAVIGATION:END -->\n','## MIG-X\nrecord')
        self.assertLess(result.index('MIG-X'),result.index('DOCUMENT_NAVIGATION'))
    def test_cycle(self):
        with self.assertRaises(ValueError): validate_graph({'PCF-1':['PCF-2'],'PCF-2':['PCF-1']})
    def test_missing_local(self):
        with self.assertRaises(ValueError): validate_graph({'PCF-1':['PCF-2']})
    def test_external_allowed(self): validate_graph({'PCF-1':['WBC-601'],'PCF-2':['PCF-1']})
if __name__=='__main__': unittest.main()
