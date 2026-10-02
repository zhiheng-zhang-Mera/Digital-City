"""Strict frontmatter validation for every workbook in mission-book.

Authoritative rather than regex-based: PyYAML parses the block, and a custom mapping constructor
REJECTS duplicate keys, which is stronger than scanning for `^key:` because it also catches duplicates
written with odd spacing or nested inside sub-mappings. This is the check that would have caught the
UI-000 / UI-101 duplicates before they were committed, and it covers the error class I have hit
repeatedly: unterminated quoted values, consumed field headers, and tabs in YAML.

Usage: python validate_frontmatter.py <mission-book root>
"""
import sys
import pathlib
import yaml


class StrictLoader(yaml.SafeLoader):
    """SafeLoader that refuses duplicate mapping keys instead of silently keeping the last."""


def _construct_mapping(loader, node, deep=False):
    seen = set()
    for key_node, _ in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in seen:
            raise yaml.constructor.ConstructorError(
                None, None, f"DUPLICATE KEY {key!r}", key_node.start_mark
            )
        seen.add(key)
    return yaml.SafeLoader.construct_mapping(loader, node, deep=deep)


StrictLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _construct_mapping
)


def frontmatter(text):
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return None, 0
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i]), i + 1
    return None, 0  # opening fence never closed


def main(root):
    root = pathlib.Path(root)
    ok = bad = skipped = 0
    problems = []
    for path in sorted(root.rglob("*.md")):
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError as e:
            problems.append((path, f"NOT UTF-8: {e}"))
            bad += 1
            continue
        if text.startswith("\ufeff"):
            problems.append((path, "BOM at start of file"))
            bad += 1
            continue
        block, closed = frontmatter(text)
        if block is None:
            skipped += 1
            continue
        if closed == 0:
            problems.append((path, "opening --- never closed"))
            bad += 1
            continue
        try:
            data = yaml.load(block, Loader=StrictLoader)
        except yaml.YAMLError as e:
            msg = str(e).replace("\n", " ")[:200]
            problems.append((path, f"YAML ERROR: {msg}"))
            bad += 1
            continue
        if data is not None and not isinstance(data, dict):
            problems.append((path, f"frontmatter is {type(data).__name__}, not a mapping"))
            bad += 1
            continue
        ok += 1

    print(f"scanned {ok + bad + skipped} markdown files")
    print(f"  valid frontmatter : {ok}")
    print(f"  no frontmatter    : {skipped}")
    print(f"  PROBLEMS          : {bad}")
    for path, why in problems:
        rel = path.as_posix().split("mission-book/")[-1]
        print(f"    {rel}\n        {why}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "mission-book"))
