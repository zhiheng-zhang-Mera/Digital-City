"""Regression: evidence bytes must survive checkout unchanged / 原始证据字节不得随检出改变。"""
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sync_documentation_navigation as navigation


class EncodingEvidenceTests(unittest.TestCase):
    def test_original_bytes_pass_but_checkout_newline_conversion_is_detected(self):
        with tempfile.TemporaryDirectory(prefix="city-preimage-check-") as directory:
            original_root = navigation.ROOT
            navigation.ROOT = Path(directory)
            try:
                base = navigation.ROOT / "docs" / "encoding-evidence"
                base.mkdir(parents=True)
                path = base / "original.bin"
                original = b"historical\r\n\xffinvalid-encoding\r\n"
                path.write_bytes(original)
                index = base / "PREIMAGE_INDEX.json"
                record = {"preimage_ref": "docs/encoding-evidence/original.bin", "original_bytes": len(original), "original_sha256": hashlib.sha256(original).hexdigest()}
                index.write_text(json.dumps({"records": [record]}), encoding="utf-8")
                self.assertEqual(navigation.check_encoding_preimages(), [])
                before_index = index.read_bytes()
                converted = original.replace(b"\r\n", b"\n")
                path.write_bytes(converted)
                self.assertEqual(navigation.check_encoding_preimages(), [record["preimage_ref"]])
                self.assertEqual(path.read_bytes(), converted, "the checker must not silently repair evidence")
                self.assertEqual(index.read_bytes(), before_index, "the checker must not replace the declared hash")
                same_length_change = original.replace(b"historical", b"HISTORICAL")
                path.write_bytes(same_length_change)
                self.assertEqual(len(same_length_change), len(original))
                self.assertEqual(navigation.check_encoding_preimages(), [record["preimage_ref"]])
                path.unlink()
                self.assertEqual(navigation.check_encoding_preimages(), [record["preimage_ref"]])
            finally:
                navigation.ROOT = original_root


if __name__ == "__main__":
    unittest.main()
