// REX-806 defect check: what does the exporter CLI's REFUSAL path actually exit with?
//
// Found by the REX-890 rehearsal: pointed at a City that holds no readable campaign receipt, the CLI prints the
// right refusal and then the process dies with a libuv assertion on Windows, so the exit code is a crash code
// (0xC0000409 / 3221226505) rather than 1. A caller scripting the exporter - a study runner, CI, the reviewer's
// automation - cannot distinguish "no source, by design" from "the exporter crashed".
//
// HOW TO RUN (imports Utopia modules, so it must live inside the checkout):
//   copy to <checkout>/.rex806-refusal-check.mjs && node .rex806-refusal-check.mjs
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {createGateway} from './services/dev-gateway/server.mjs';

const OUT = process.env.REX806_OUT ?? 'D:/utopia-chat/evidence/REX-806/refusal-check-artifact';
const runChild = args => new Promise(resolve => {
  const child = spawn(process.execPath, args, {stdio: ['ignore', 'pipe', 'pipe']});
  let stdout = '', stderr = '';
  child.stdout.on('data', d => { stdout += d; });
  child.stderr.on('data', d => { stderr += d; });
  const timer = setTimeout(() => child.kill(), 60000);
  child.on('close', code => { clearTimeout(timer); resolve({code, stdout, stderr}); });
});

const dir = await mkdtemp(join(tmpdir(), 'rex806-refusal-'));
const app = await createGateway({dir, port: 0, token: 'refusal-owner', nodeToken: 'refusal-node', roomsDisabled: true});
try {
  const configPath = join(dir, 'config.json');
  await writeFile(configPath, JSON.stringify({token: 'refusal-owner'}), 'utf8');
  const result = await runChild(['scripts/export-research-artifact.mjs', '--city', app.url, '--out', OUT, '--config', configPath]);
  const refusalPrinted = /no campaign receipt is readable/.test(result.stdout + result.stderr);
  console.log('refusal message printed : ' + refusalPrinted);
  console.log('exit code               : ' + result.code + '  (0x' + (result.code >>> 0).toString(16).toUpperCase() + ')');
  console.log('stderr tail             : ' + result.stderr.trim().split('\n').slice(-2).join(' | '));
  console.log('');
  console.log(refusalPrinted && result.code === 1
    ? 'PASS  the refusal path exits 1 as its message implies'
    : `FAIL  the refusal path exits ${result.code} instead of 1 - a caller cannot tell "refused by design" from "crashed"`);
  process.exit(refusalPrinted && result.code === 1 ? 0 : 1);
} finally {
  await app.close();
  await new Promise(r => setTimeout(r, 250));
  await rm(dir, {recursive: true, force: true});
}
