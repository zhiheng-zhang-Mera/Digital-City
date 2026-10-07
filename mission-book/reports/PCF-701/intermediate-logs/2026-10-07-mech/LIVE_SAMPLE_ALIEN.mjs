import {createSystemAdapter,UNSUPPORTED_ON_THIS_ADAPTER} from '../services/personal-compute-fabric/adapters.mjs';
import {createTelemetryCollector} from '../services/personal-compute-fabric/telemetry.mjs';
import {hostname,platform} from 'node:os';
import {writeFileSync} from 'node:fs';
const adapter=createSystemAdapter();
const collector=createTelemetryCollector({sample:async()=>(await adapter.sample()).sample,minIntervalMs:0,budgetMs:500,unsupported:UNSUPPORTED_ON_THIS_ADAPTER,bootId:'sampling-process-'+process.pid,source:'pcf701-live-review'});
const samples=[];
for(let i=0;i<4;i++){
 const r=await collector.collect();samples.push({index:i,status:r.status,overheadMs:r.overheadMs,receivedAt:r.observation.receivedAt,dimensions:r.observation.dimensions});
 await new Promise(resolve=>setTimeout(resolve,250));
}
const result={host:hostname(),platform:platform(),sourceHead:process.env.PCF_REVIEW_HEAD??null,observedAt:new Date().toISOString(),samples,stats:collector.stats(),remoteReturnConsumption:'NOT_RUN'};
const out=process.argv[2];if(out)writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({host:result.host,platform:result.platform,samples:samples.map(s=>({cpu:s.dimensions.cpu.value,cpuPresence:s.dimensions.cpu.presence,memoryTotal:s.dimensions['memory.total'].value,memoryFree:s.dimensions['memory.free'].value,overheadMs:s.overheadMs})),remoteReturnConsumption:result.remoteReturnConsumption},null,2));
