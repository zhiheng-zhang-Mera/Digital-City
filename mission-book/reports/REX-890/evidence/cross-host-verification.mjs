import {readFile, writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {openDeviceSession, readDeviceFile} from '../Utopia-REX890-Alien-final-20261008/apps/client/device-enrollment.mjs';
const out = 'D:/Utopia-tree/REX-801-890/REX890-Alien-final-evidence-20261008';
const config = JSON.parse(await readFile('C:/Users/15601/Desktop/REX-890-transfer-2026-10-08/01-credential/city-owner-config.FOR-ALIEN.json', 'utf8'));
const record = readDeviceFile('D:/Utopia-local-readonly-inspection-20261007/client/device-enrollment.json');
const session = await openDeviceSession(record);
const results = [];
const request = async (path, body, credential = config.token) => {
  const r = await fetch(record.endpoint + '/api/v0/' + path, {method: body ? 'POST' : 'GET', headers: {Authorization: 'Bearer ' + credential, 'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'}, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000)});
  return {status: r.status, json: await r.json()};
};
const check = (name, ok, detail) => {results.push({name, ok, detail}); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);};
const before = await request('city');
check('same canonical City on opposite physical host', before.json.cityId === record.cityId && record.cityId === '544adda1-3059-4c6f-ae7d-71ddfd0f3b8c', {cityId: before.json.cityId, nodes: before.json.nodes.map(n => ({id:n.id, online:n.online, capabilities:n.capabilities}))});
for (const path of ['node/operations', 'node/jobs']) {
  const member = await request(path, null, session.credential);
  check(`real member session cannot read ${path}`, member.status === 403, member);
}
const body = {route:'CITY_TASK',target:'city.task',operation:'OWNER_REMOTE_OPERATION',input:{targetDeviceRef:record.deviceId,operation:{executable:'node',argv:['-e',"console.log(JSON.stringify({hostname:require('os').hostname(),platform:process.platform,head:require('child_process').execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()}))"],cwd:'D:/Utopia-tree/REX-801-890/Utopia-REX890-Alien-final-20261008',purpose:'REX-890 independent cross-physical-host execution identity verification',timeoutMs:10000,maxOutputBytes:4096}},idempotencyKey:randomUUID()};
const denied = await request('actions', body, session.credential);
check('real member cannot dispatch owner remote operation', denied.status === 403, denied);
const dispatched = await request('actions', {...body,idempotencyKey:randomUUID()});
const taskId = dispatched.json.action?.backendRef?.taskId;
check('Owner City dispatches to named Alien device', Boolean(taskId), dispatched);
let operation;
if(taskId) {
  const until=Date.now()+90000;
  do {operation=(await request('node/operations')).json.operations?.find(row=>row.taskId===taskId); if(['COMPLETED','FAILED','CANCELLED','REFUSED'].includes(operation?.taskState ?? operation?.state))break; await new Promise(r=>setTimeout(r,1000));}while(Date.now()<until);
  const task=(await request('tasks')).json.tasks.find(row=>row.id===taskId);
  check('named Alien execution completes with canonical evidence', task?.state==='COMPLETED', {task,operation});
  const text=task?.result?.stdout ?? operation?.result?.stdout ?? operation?.receipt?.stdout;
  let identity;try{identity=JSON.parse(text);}catch{}
  check('execution output independently names opposite host and exact checkout', identity?.hostname==='Mera-Alianware' && identity?.head==='0e63c2a0ca723f7d8d0b6ad41abff33bee2ea744', {identity,taskId});
}
const report={at:new Date().toISOString(),host:'Mera-Alianware',cityId:record.cityId,targetDeviceId:record.deviceId,results,authority:'OBSERVED_HERE',pass:results.every(r=>r.ok)};
await writeFile(out+'/cross-host-verification.json',JSON.stringify(report,null,2));
process.exitCode=report.pass?0:1;
