# FINDING — Mech (control plane): four task workbooks are GBK-double-encoded in the repository, including UXI-390's completion gate

```text
FROM = Mech   SCOPE = Digital-City control plane (mission-book)
SEVERITY = high for this phase: the acceptance criteria the UXI-390 review is conducted against are
           unreadable in the repository.
STATUS = finding only. I did NOT repair it - see section 6.
```

## 1. What is wrong

Reading UXI-390's workbook to enumerate its gate items for the review, the Chinese body rendered as
mojibake:

```text
## 鏈€缁堝畬鎴愰棬妲?          <- should be  ## 最终完成门槛  (the completion gate)
## 鏂藉伐姝ラ                 <- should be  ## 施工步骤      (construction steps)
```

This is not a console or tool artifact. The file is **valid UTF-8 with zero replacement characters**
(`U+FFFD` count 0, no BOM, starts `2d 2d 2d`), and the real character `一` (U+4E00) **does not occur anywhere
in the file**. So the text is not mis-displayed — it is stored wrong: the original UTF-8 bytes were decoded as
GBK/CP936 and re-encoded as UTF-8, producing valid UTF-8 made of the wrong characters.

## 2. It is committed, not local

```text
working tree vs HEAD      CLEAN
blob scan of HEAD:mission-book/...   DOUBLE-ENCODED IN COMMIT
```

The mojibake is inside the **git object**, so it is on the remote and in every clone. It is not a checkout,
smudge-filter, or local-edit artifact.

## 3. It is specific, not systemic — and the split is diagnostic

Scanning every `.md` under `mission-book/` for the seven most common Chinese characters (`的 是 一 了 和 在 有`)
against their double-encoded forms (`鐨 鏄 涓 浜 鍜 鍦 鏈`):

| workbook | verdict |
|---|---|
| UI-000, UI-101, UI-103, UI-190 | **healthy** — 40, 28, 26, 29 real occurrences, 0 mojibake |
| **UI-102** | double-encoded (4 mojibake, 0 real) |
| **RS-290** | double-encoded (3, 0) |
| **UXI-301** | double-encoded (48, 0) |
| **UXI-390** | double-encoded (37, 0) |

96 files in the control plane contain Chinese; **92 are healthy**. So the repository is not broken — the
four workbooks that have been **edited most, most recently, during construction** are. That is the signature of
a write path, not of a bad import.

## 4. The repair is known and verified reversible

```text
raw heading        鏂藉伐姝ラ
encode as CP936 -> decode as UTF-8   施工步骤     <- correct
```

So the corruption is a clean, lossless round-trip and can be reversed exactly:
`UTF8.GetString(Encoding.GetEncoding(936).GetBytes(mojibake))`. I verified this on a real heading from the
UXI-390 workbook, not in principle.

## 5. Why this matters for the review specifically

**UXI-390's `最终完成门槛` — the completion gate, i.e. the acceptance criteria the review is conducted
against — is unreadable in the repository.** I was able to enumerate those items only because Alien's records
and the goal statement quote them in English. A review host or an Owner opening the workbook cold would see
`## 鏈€缁堝畬鎴愰棬妲?` and nothing usable beneath it.

That is worse than an inconvenience: an acceptance gate nobody can read is a gate that cannot be checked
against, and this programme's whole discipline is that the workbook, not the report, is the authority.

## 6. What I did NOT do, and why

**I did not repair it.** UXI-301 is `REVIEW_COMPLETE` and was reviewed and closed on specific bytes; UXI-390 is
another host's workbook under active development. Re-encoding the body of a closed, reviewed artefact is a
record alteration, and doing it unilaterally would be the same error as a reviewer editing an author's
workbook — which this programme has already ruled against once. The repair is mechanical and I have verified
it; applying it should be the Owner's call, or the author's per file.

**I also did not name a cause.** The obvious hypothesis is a PowerShell or ANSI-codepage read/write round-trip
on CJK text, which this programme has already recorded as a hazard (`Set-Content -Encoding utf8` under 5.1
writes a BOM; the guidance is `[IO.File]::WriteAllText` with `UTF8Encoding($false)`). But **I did not
reproduce it**, so I am not asserting which tool or which host did it. GUI-102 predates my involvement in
UXI-301/390, so it is not a single recent event either.

## 7. The guard that would have caught it

`mission-book/reports/validate_frontmatter.py` parses these workbooks and reports 62 valid / 10 problems, and
it did not flag this because it validates *structure*, not *text integrity*. A two-line addition — flag any
file whose CJK is present in double-encoded form, or which contains none of the common real characters while
containing their mojibake forms — would catch this class at write time, on the same run that already checks for
duplicate keys. Given that four workbooks drifted without anyone noticing, this belongs in the validator rather
than in a reviewer's head.

[完整中文阅读译本 / Chinese reading translation](./zh-CN/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md)
