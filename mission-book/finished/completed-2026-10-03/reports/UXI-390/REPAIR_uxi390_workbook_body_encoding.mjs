// REPAIR — restore the UXI-390 workbook body from the Owner's original revision 2a319ce.
//
// Why: this workbook's Chinese body is GBK-double-encoded in the repository. Mech found it and correctly left it
// unrepaired (reports/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md), rating it high severity
// because the completion gate the Review is conducted against was unreadable, and deferring the fix to the
// Owner or to each file's AUTHOR. This file's author is Alien: the corruption entered in Alien's own claim
// commit 1199229 and persisted through every later commit, so the repair is Alien's to make — and it is made
// BEFORE Review rather than after it.
//
// Why a verbatim restore is EXACT rather than reconstructive: PROBE_uxi390_workbook_encoding.mjs proves that
// every one of the 53 re-encoded body lines is the corresponding original line with only multi-byte characters
// destroyed (53/53 lines, 83 characters). Encoding damage of that shape cannot conceal a legitimate edit.
//
// Usage: node REPAIR_uxi390_workbook_body_encoding.mjs <origBlob.bin> <headBlob.bin> <target.md>
//
// The script never writes an unverified file: it asserts its preconditions first and re-reads the result after.

import { readFileSync, writeFileSync } from 'node:fs';

const [origFile, headFile, target] = process.argv.slice(2);
if (!origFile || !headFile || !target) {
  console.error('usage: node REPAIR_uxi390_workbook_body_encoding.mjs <origBlob> <headBlob> <target.md>');
  process.exit(2);
}

const origText = readFileSync(origFile, 'utf8');
const headText = readFileSync(headFile, 'utf8');

const iO = origText.indexOf('\n---');
const iH = headText.indexOf('\n---');
if (iO < 0 || iH < 0) throw new Error('frontmatter delimiter not found');
const origBody = origText.slice(iO);        // includes the closing delimiter and the body
const headFront = headText.slice(0, iH);    // excludes the closing delimiter

// ---- preconditions: asserted, not assumed ------------------------------------------------------------
if (!origBody.includes('最终完成门槛')) throw new Error('original revision lacks the completion-gate heading');
if (!origBody.includes('施工步骤')) throw new Error('original revision lacks the steps heading');
const origBodyLines = origBody.split('\n').length;
if (origBodyLines !== 53) throw new Error(`original body line count changed: ${origBodyLines}`);
if (headText.includes('最终完成门槛')) throw new Error('HEAD body is unexpectedly already healthy');
if (/^owner_ruling_uxi390_handoff_decision:/m.test(headFront)) {
  throw new Error('the ruling key is already present; this repair would duplicate it');
}

const keys = `owner_ruling_uxi390_handoff_decision: "OWNER RULED OPTION 1 ON THE REMOTE-HANDOFF DEFERRAL, ASKED AND ANSWERED THROUGH THE OWNER GUI IN THIS ROUND, AND RECORDED HERE AS THE TASK-TRACKING UPDATE THE OWNER ASKED FOR IN THE SAME ANSWER. THE DECISION PUT TO THE OWNER WAS THE ONE THE GATE AUDIT AND THE DISPATCH REPORT HAD ALREADY REDUCED THE QUESTION TO: OPTION 1, KEEP THE DEFERRAL WITH ITS REASON CORRECTED TO THE CITY PUBLISHES NO FIVE-DIMENSION LOAD VECTOR AND UNMEASURED LOAD IS DELIBERATELY INELIGIBLE AS AN ALTERNATE, WITH THE HANDOFF SUB-ITEM OF GATE ITEM 3 STAYING EXPLICITLY NOT MET; OR OPTION 2, RULE THAT THE CITY SHOULD BEGIN REPORTING A REAL LOAD VECTOR AND GAIN A SWITCH-DECLINE PATH ON THE SURFACES. THE OWNER CHOSE OPTION 1. OPTION 2 WAS PUT TO THE OWNER AS WHAT IT IS RATHER THAN AS A REPAIR INSIDE THIS TASK: A NEW PRODUCT CAPABILITY SPANNING FROZEN-CONTRACT VOCABULARY (ALLOWED_ACTIONS IS EXACTLY CANCEL, RETRY, KEEP_WAITING, CHOOSE_PROVIDER AND CONFIRM, WITH NO DECLINE TOKEN), A GATEWAY ROUTE THAT NO SURFACE CALLS, AND BOTH SURFACES. WHAT THIS RULING CHANGES AND WHAT IT DOES NOT, RECORDED BECAUSE THE DIFFERENCE IS EASY TO OVERSTATE IN BOTH DIRECTIONS: IT REMOVES THE OUTSTANDING OWNER DECISION FROM THIS TASK'S PATH AND TURNS AN OPEN QUESTION INTO A DEFERRAL ACCEPTED BY THE OWNER; IT DOES NOT CONVERT THE DEFERRAL INTO A PASS AND DOES NOT MARK MET ANY ITEM THAT WAS NOT MET. development_complete REMAINS false AFTER THIS RULING, FOR A REASON UNRELATED TO THE DEFERRAL AND NAMED IN development_uxi390_remaining_alien_step."
owner_ruling_uxi390_recorded_at: 2026-10-02T10:47Z
owner_ruling_uxi390_source: "Owner, through the harness GUI, answering the merged handoff decision this round. In the same answer the Owner asked that mission-book README task tracking be updated, which is done in the same commit."
owner_ruling_uxi390_reconciliation: "SECTION 7 RECONCILIATION DONE BEFORE ACTING ON THE RULING RATHER THAN AFTER IT: origin/main was re-read (c028e4a, and no other host had pushed), all four remote heads were enumerated, and every workbook under mission-book was re-scanned for status, so the ruling was applied to the measured pool rather than to a remembered one."
development_uxi390_remaining_alien_step: "STEP 5 IS THE REMAINING DEVELOPMENT-HOST STEP: THE MINIMAL OWNER-FACING PACKAGE THE WORKBOOK ASKS FOR - WEB HOME / ASK / TOOLS, ANDROID HOME / ASK / TOOLS, ONE ROOM, AND ONE PROVIDER SWITCH OR REMOTE-HANDOFF STATE - SO THAT THE OWNER'S ONLY TASK IS TO SAY WHETHER IT LOOKS RIGHT. IT IS OWED AND NOT YET DELIVERED, AND IT IS THE NEXT STEP THIS HOST TAKES. STEP 4'S VISUAL-CRITIC LOOP BELONGS TO THE REVIEW HOST UNDER SECTION 3 AND NOT TO ALIEN, SINCE ALIEN IS THIS TASK'S DEVELOPMENT HOST AND MUST NOT CRITIQUE ITS OWN OUTPUT. THE DEFERRAL RULING ABOVE DOES NOT DISCHARGE STEP 5."
workbook_body_encoding_restored: "THIS WORKBOOK'S CHINESE BODY WAS GBK-DOUBLE-ENCODED IN THE REPOSITORY AND HAS BEEN RESTORED, AND THE REPAIR IS AN EXACT RESTORE RATHER THAN A RECONSTRUCTION. THE DEFECT WAS FOUND AND CORRECTLY LEFT UNREPAIRED BY MECH IN reports/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md, WHICH RATED IT HIGH SEVERITY FOR THIS PHASE BECAUSE THE COMPLETION GATE THE REVIEW IS CONDUCTED AGAINST WAS UNREADABLE, AND WHICH DEFERRED THE FIX TO THE OWNER OR TO EACH FILE'S AUTHOR. THIS FILE'S AUTHOR IS ALIEN: THE CORRUPTION ENTERED IN ALIEN'S OWN CLAIM COMMIT 1199229 AND PERSISTED THROUGH EVERY LATER COMMIT, SO THE REPAIR IS ALIEN'S TO MAKE AND IS MADE BEFORE REVIEW RATHER THAN AFTER IT. THE REPAIR RESTORES THE BODY OF THE OWNER'S ORIGINAL REVISION 2a319ce VERBATIM AND TOUCHES NOTHING ELSE - THE FRONTMATTER, ALL OF WHICH IS ALIEN'S OWN ENGLISH WORK ADDED AFTER 2a319ce, IS BYTE-UNCHANGED APART FROM THIS ROUND'S THREE NEW KEYS. WHY A VERBATIM RESTORE IS EXACT RATHER THAN A GUESS, MEASURED RATHER THAN ASSUMED: THE RE-ENCODED BODY AND THE ORIGINAL BODY BOTH HAVE 53 LINES, AND PROBE_uxi390_workbook_encoding.mjs PROVES THAT EVERY ONE OF THE 53 REPAIRED LINES CAN BE DERIVED FROM THE CORRESPONDING ORIGINAL LINE BY REPLACING ONE OR TWO CONSECUTIVE CHARACTERS WITH THE DESTROYED-BYTE TOKEN AND NOTHING ELSE - 53/53 LINES EXPLAINED, 83 ORIGINAL CHARACTERS DESTROYED BY THE ROUND-TRIP - WHICH IS THE SIGNATURE OF ENCODING DAMAGE RATHER THAN OF AN EDIT, SO THE BODY CARRIES NO LEGITIMATE CHANGE THAT A RESTORE COULD DISCARD. A REVERSED REPAIR WAS REJECTED ON MEASUREMENT: RE-ENCODING THE DAMAGED TEXT AS CP936 AND DECODING IT AS UTF-8 LEAVES 59 REPLACEMENT CHARACTERS, SO THAT ROAD WOULD HAVE FABRICATED 59 PUNCTUATION MARKS. THIS WORKBOOK'S FRONTMATTER WAS CHECKED TOO AND IS CLEAN: EXACTLY ONE NON-ASCII CHARACTER IN IT, A MIDDLE DOT IN ALIEN'S OWN PROSE, AND NO MOJIBAKE. THE SAME DEFECT REMAINS IN THREE OTHER WORKBOOKS - UI-102, RS-290 AND UXI-301 - ALL OF THEM CLOSED, TWO OF THEM FROZEN OR REVIEWED AT SPECIFIC BYTES, SO THEY ARE LEFT ALONE AND NAMED IN THE README RATHER THAN SILENTLY REWRITTEN."`;

const assembled = `${headFront}\n${keys}${origBody}`;

// ---- verification before the write, and again after it ------------------------------------------------
const mojibake = /鏈€|鏂藉伐|鐩爣|瀹屾垚|鍙屾満/;
if (mojibake.test(assembled)) throw new Error('assembled text still contains mojibake');
if (!assembled.includes('最终完成门槛')) throw new Error('assembled text lost the completion-gate heading');
if (!assembled.includes('施工步骤')) throw new Error('assembled text lost the steps heading');
if (assembled.includes('\uFFFD')) throw new Error('assembled text contains a replacement character');

writeFileSync(target, assembled, 'utf8'); // utf8 here is BOM-less

const back = readFileSync(target, 'utf8');
const report = {
  written: target,
  bytes: Buffer.byteLength(back, 'utf8'),
  bom: back.charCodeAt(0) === 0xFEFF,
  mojibake_tokens: (back.match(/鏈€|鏂藉伐|鐩爣|瀹屾垚|鍙屾満/g) || []).length,
  replacement_chars: (back.match(/\uFFFD/g) || []).length,
  completion_gate_readable: back.includes('最终完成门槛'),
  steps_readable: back.includes('施工步骤'),
  body_lines: origBodyLines,
  frontmatter_keys: (back.slice(0, back.indexOf('\n---')).match(/^[a-z_]+:/gm) || []).length,
  body_is_verbatim_original: back.slice(back.indexOf('\n---')) === origBody,
};
console.log(JSON.stringify(report, null, 2));
if (!report.body_is_verbatim_original || report.bom || report.mojibake_tokens !== 0 || report.replacement_chars !== 0) {
  console.error('RESULT: FAIL - the written file does not satisfy the repair contract');
  process.exit(1);
}
console.log('RESULT: PASS - body restored verbatim from 2a319ce, frontmatter preserved, UTF-8 without BOM');
