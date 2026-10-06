import pathlib,hashlib
root=pathlib.Path('\\\\?\\D:\\Digital-City-REX-20261006');src=root/'mission-book/research-strengthening/README.md';dst=src.parent/'en/README.md';before=src.read_bytes()
t=dst.read_text(encoding='utf8');mark='<!-- READING_REX805_CANDIDATE_PREFLIGHT:START -->';assert mark not in t
addition='''

<!-- READING_REX805_CANDIDATE_PREFLIGHT:START -->
### REX-805 candidate preflight and coexistence with the accepted union

Reading translation of the latest addition to the [canonical programme page](../README.md), source SHA256 `SOURCE_SHA`. This measures a candidate, not acceptance; current workbook state remains authoritative. Earlier measurements and failures above remain historical.

**REX-805 candidate head is now included in the same measurement:** `4b39468`, **not yet accepted**. Against main it is a **fast-forward**: main is its ancestor and the candidate adds 15 commits. Against the accepted REX-803+804 union it produces one union conflict in server.mjs, resolved as an explicit union of all three contributions. `integration/REX-805-candidate-mech-preflight @ 0d8bdce` passes 67/67 focused tests and gives 1423 passes out of 1426 full-suite tests, with the three host-city-launcher failures; tracked state is CLEAN afterward.

**That fast-forward is the sharpest example of the rule requiring accepted identities as integration sources.** Integrating by branch name here would not merely add an extra commit: it would move the whole main branch onto the candidate head. A measured clean union does not accept REX-805 or grant merge authority.
<!-- READING_REX805_CANDIDATE_PREFLIGHT:END -->
'''.replace('SOURCE_SHA',hashlib.sha256(before).hexdigest())
dst.write_text(t+addition,encoding='utf8');assert src.read_bytes()==before
print('VERIFIED REX805 current-candidate preflight complete translation; canonical unchanged')
