> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../JOIN-503-device-enrollment-and-tokenless-reconnect.md) 的原始 frontmatter 是唯一元数据来源。

# JOIN-503 — Device Enrollment + Tokenless Routine Reconnect

> [Programme](../README.md) · [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Async relief](../../../../ASYNC_RELIEF_CONSTRUCTION.md).

## 1. Goal

After first successful join, upgrade new PC from browser/process carrying a token to registered canonical-City installation. Normal user pairs once:

```text
first join
→ trust approval
→ existing RF device identity / installation lifecycle enrollment
→ durable local device identity
→ future boot authenticates automatically
```

Routine startup must not request bare-token copy/paste again.

## 2. Identity boundary

Reuse RF-001: device_id stable logical identity; installation_id concrete installation; key/fingerprint cryptographic anchor; display name/OS/IP/MAC metadata. No second user-visible permanent token, second device registry or MAC/IP trust identity.

## 3. User-visible behavior

After join: Devices lists new installation/node; enrollment explicit; app/agent restart auto-reconnects. Internal short-term session credential may be issued without user contact. Settings offers identity summary/revoke/remove; manual token only Advanced/Engineering fallback.

## 4. Credential lifecycle

Durable private material never in repository, URL, ordinary UI or demo/log. One-time pairing secret is not durable credential. Restart proves existing device identity and obtains/restores session; rotation needs no copied token. Revoke prevents old installation reconnect; reinstall/rebind follows RF lifecycle. Choose minimal appropriate secure storage for platform. If system keystore adapter absent, explicitly labelled local secure-store abstraction allowed, but do not return plaintext permanent tokens to UI.

## 5. Relation to Web UI

Web currently has sessionStorage['city-token']/bare-token fallback. No requirement to remove engineering fallback immediately: normal onboarded PC no manual input; launcher/local agent may deliver authenticated session to Web; Web holds session-scoped credential only; device/runtime layer holds durable key, never browser DOM.

## 6. Allowed changes

Enrollment glue, platform/runtime credential-store adapter, launcher/bootstrap, session issuance/reconnect integration, Settings revoke/remove, tests/docs/evidence.

## 7. Prohibited changes

No RF identity-ownership change, copied trust registry, permanent bearer in Web localStorage, token in deep link, expansion into account/cloud sync or task-scheduling change.

## 8. Required tests

1. Approved first join creates/reuses canonical installation identity.
2. Restart reconnects without user token.
3. Expired session internally refreshes/re-authenticates, no token UI prompt.
4. Revoke denies reconnect.
5. Revoked installation cannot silently mint membership.
6. Reinstall/rebind explicit lifecycle.
7. No permanent secret in DOM/log/URL/repo.
8. Engineering fallback isolated from default.

## 9. Physical-device acceptance

At least Alien+Mech: clean/unregistered installation joins once, shut down app/agent, restart without URL/token entry, device automatically ONLINE, trusted endpoint revokes, restart again denies automatic connection and requires approved pairing rather than silently creating trust. Formal Review by opposite physical host.

## 10. Completion gates

DEVICE_ENROLLMENT_RECONNECT_ACCEPTED only after all pass: initial enrollment, restart auto-reconnect, revoke negative, secret sweep, Development/opposite-host Review/exact-head CI.
