import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('D:/Utopia-tree/REX-801-890/Utopia-REX890-Alien-final-20261008/package.json');
const {chromium}=require('playwright');
const dir='D:/Utopia-tree/REX-801-890/REX890-Alien-final-evidence-20261008';
const config=JSON.parse(await readFile('C:/Users/15601/Desktop/REX-890-transfer-2026-10-08/01-credential/city-owner-config.FOR-ALIEN.json','utf8'));
const browser=await chromium.launch({channel:'msedge',headless:true});
const checks=[];
try{
  const page=await browser.newPage({locale:'en-US',viewport:{width:1360,height:900}});
  page.setDefaultTimeout(15000);
  await page.goto('http://172.31.12.151:4310');
  await page.locator('#token').fill(config.token);await page.locator('#connect').click();
  await page.locator('#connection.online').waitFor();
  for(const [name,prefix] of [['RemoteOperation','rop'],['AgentJobs','aj']]){
    const entry=page.locator(`nav [data-page="${name}"]`);
    await entry.click();await page.locator(`#${prefix}-state`).waitFor();
    await page.waitForFunction(id=>document.getElementById(id)?.textContent.includes('Enabled'),`${prefix}-state`);
    const state=await page.locator(`#${prefix}-state`).innerText();
    const disabled=await page.locator(`#${prefix}-dispatch`).isDisabled();
    await page.screenshot({path:`${dir}/live-${name}.png`,fullPage:true,mask:[page.locator('#token')]});
    checks.push({name,entryCount:await entry.count(),enabledState:state,emptyConfirmationDispatchDisabled:disabled,screenshot:`live-${name}.png`,pass:(await entry.count())===1&&disabled&&state.includes('DIRECT_CONTROL')});
  }
  await page.locator('nav [data-page="Settings"]').scrollIntoViewIfNeeded();
  checks.push({name:'Settings navigation reachable',pass:await page.locator('nav [data-page="Settings"]').isVisible()});
}finally{await browser.close()}
await writeFile(`${dir}/live-ui-review.json`,JSON.stringify({host:'Mera-Alianware',at:new Date().toISOString(),checks,pass:checks.every(c=>c.pass)},null,2));
console.log(JSON.stringify(checks));process.exitCode=checks.every(c=>c.pass)?0:1;
