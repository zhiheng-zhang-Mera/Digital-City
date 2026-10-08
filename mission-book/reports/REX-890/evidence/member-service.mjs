import {readDeviceFile} from '../Utopia-REX890-Alien-final-20261008/apps/client/device-enrollment.mjs';
import {startMemberAgent} from '../Utopia-REX890-Alien-final-20261008/services/dev-gateway/member-runtime.mjs';
const record=readDeviceFile('D:/Utopia-local-readonly-inspection-20261007/client/device-enrollment.json');
if(record?.deviceId!=='dev-1428bce5297146df88720f270af71bc3'||record.cityId!=='544adda1-3059-4c6f-ae7d-71ddfd0f3b8c')throw Error('Canonical identity mismatch');
const agent=await startMemberAgent({record,workspace:'D:/Utopia-tree/REX-801-890/REX890-Alien-final-evidence-20261008/agent-workspace'});
console.log(JSON.stringify({at:new Date().toISOString(),pid:process.pid,cityId:record.cityId,deviceId:record.deviceId,sourceHead:'0e63c2a0ca723f7d8d0b6ad41abff33bee2ea744',state:'ONLINE'}));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await agent.stop();process.exitCode=0});
