// REX-806: attest WHICH REVISION the City that produced the artifact is actually running - from outside, and with
// the credential kind a reviewer actually holds.
//
// Why this exists: environment.json says the deployed candidate was "observed by the operator", i.e. the package
// cannot attest the revision it came from. Route presence can: each head serves a different capability set
// (main has experiments/trace/monitor/execution-profile; the REX-805 head adds campaigns and replays; the REX-806
// head adds faults and artifacts). A request to a missing route answers 404, while a present owner-only route
// answers 401 unauthenticated and 403 for a member session - so a member can fingerprint a City without any
// privileged credential, which is exactly what the opposite host has.
//
// MEASURED against the City that produced the published artifact (172.31.12.151:4391, 2026-10-06):
//
//   owner statuses   experiments=200 trace=200 campaigns=200 replays=200 faults=404 artifacts=404 monitor=200
//                    execution-profile=200
//   member statuses  experiments=200 trace=403 campaigns=403 replays=403 faults=404 artifacts=404 monitor=200
//                    execution-profile=403
//   fingerprint      matches the REX-805 head (0261a9e): campaigns + replays present, no fault controller and no
//                    artifact surface - corroborating from outside what the records assert, and something
//                    environment.json itself cannot state (it says the candidate was "observed by the operator")
//   member vs owner  identical presence on every route: a member sees 403 for a present owner-only route and 404
//                    for an absent one, so the opposite host can run this with the credential it holds
//   side effects     the throwaway enrollment minted for the member probe was revoked (HTTP 200), so a run
//                    against a live City leaves no member behind
//
// BOUNDARY, stated rather than implied: this attests CAPABILITY PRESENCE, not a commit SHA. Two heads serving the
// same route set are indistinguishable here, and an UNAUTHENTICATED client cannot do it at all - the City answers
// 401 for every route before matching, present or not (also measured).
//
// It mints a throwaway member enrollment (owner credential required for that one step), probes as that member,
// and REVOKES the enrollment again, so a run against a live City leaves no member behind.
//
// RUN: copy into <checkout>/.deployment-fingerprint.mjs && node .deployment-fingerprint.mjs [--city URL] [--config PATH]
import {readFileSync} from 'node:fs';
import {enrollWithCity, openDeviceSession} from './apps/client/device-enrollment.mjs';

const arg = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
};
const CITY = arg('city', 'http://172.31.12.151:4391').replace(/\/$/, '');
const CONFIG = arg('config', 'C:/ProgramData/Utopia/host/city/local-config.json');
const ownerToken = JSON.parse(readFileSync(CONFIG, 'utf8')).token;
const V = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const line = (l, v) => console.log(String(l).padEnd(30), v);

const ROUTES = [
  ['research/experiments', 'REX-801 experiment registry'],
  ['research/trace', 'REX-802 trace collector'],
  ['research/campaigns', 'REX-803 campaign runner'],
  ['research/replays', 'REX-805 replay/ablation'],
  ['research/faults', 'REX-804 fault controller'],
  ['research/artifacts', 'REX-806 artifact export'],
  ['monitor', 'MON observation'],
  ['execution-profile', 'WBC-604 execution profile'],
];

const probe = async (credential, label) => {
  const rows = [];
  for (const [route] of ROUTES) {
    const response = await fetch(`${CITY}/api/v0/${route}`, {headers: credential ? {...V, Authorization: `Bearer ${credential}`} : V});
    rows.push({route, status: response.status});
  }
  line(`${label} statuses`, rows.map(r => `${r.route.replace('research/', '')}=${r.status}`).join(' '));
  return rows;
};

const call = async (path, credential, body) => {
  const response = await fetch(`${CITY}/api/v0/${path}`, {method: body ? 'POST' : 'GET', headers: {...V, ...(credential ? {Authorization: `Bearer ${credential}`} : {})}, body: body ? JSON.stringify(body) : undefined});
  const text = await response.text(); let json = null; try { json = JSON.parse(text); } catch {}
  return {status: response.status, body: json};
};

console.log(`city ${CITY}`);
const ownerRows = await probe(ownerToken, 'owner');
let memberRows = null;
let member = null;
try {
  const pairing = (await call('pairing/session', ownerToken, {})).body;
  // The exchange checks the City identity, and the pairing response's own cityId is not always populated - the
  // test helper this recipe comes from reads it from the local store instead. Read it from the City snapshot.
  const cityId = (await call('city', ownerToken)).body?.cityId ?? pairing.cityId;
  const enrolled = await enrollWithCity({endpoint: CITY, invite: {cityId, sessionId: pairing.pairingSessionId, method: 'mdns', shortCode: pairing.shortCode}, displayName: `fingerprint-${Date.now()}`});
  member = {...enrolled.record, ...(await openDeviceSession(enrolled.record, {endpoint: CITY}))};
  memberRows = await probe(member.credential ?? member.session?.credential, 'member');
} catch (error) {
  line('member probe', `unavailable: ${String(error.message).slice(0, 90)}`);
}

const present = rows => rows ? rows.filter(r => r.status !== 404).map(r => r.route) : null;
const ownerPresent = present(ownerRows);
const memberPresent = present(memberRows);
const routeKnown = name => ownerPresent.includes(name);
console.log('');
for (const [route, capability] of ROUTES) line(`  ${route.replace('research/', '')}`, `${routeKnown(route) ? 'PRESENT' : 'ABSENT '}  ${capability}`);
console.log('');
const matches = [];
if (routeKnown('research/campaigns') && routeKnown('research/replays') && routeKnown('research/faults') && routeKnown('research/artifacts')) {
  matches.push('the REX-806 head (3950d47): campaigns + replays + faults + artifact export');
} else if (routeKnown('research/campaigns') && routeKnown('research/replays')) {
  matches.push('the REX-805 head (0261a9e): campaigns + replays, no fault controller and no artifact surface');
} else if (!routeKnown('research/campaigns')) {
  matches.push('main alone: experiments/trace/monitor/execution-profile only');
}
line('fingerprint matches', matches[0] ?? 'no known head');
if (memberPresent) {
  const disagreements = ROUTES.map(([r]) => r).filter(r => memberPresent.includes(r) !== ownerPresent.includes(r));
  line('member vs owner', disagreements.length === 0
    ? 'identical presence for every route (403 for present owner-only routes, 404 for absent ones)'
    : `differs on ${disagreements.join(', ')}`);
}
if (member) {
  const installationId = member.installationId ?? member.installation?.installationId ?? member.session?.installationId ?? null;
  if (installationId) {
    const revoked = await call(`device/installations/${encodeURIComponent(installationId)}/revoke`, ownerToken, {reason: 'revoked_by_fingerprint_probe'});
    line('enrollment revoked', `HTTP ${revoked.status}`);
  } else {
    line('enrollment revoked', 'NOT REVOKED (no installation id on the record)');
  }
}
