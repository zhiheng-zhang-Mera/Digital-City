# Short-code remote sign-in and remaining naming issue check

Reading translation / 阅读译本：This is a complete reading translation of the historical source, not an additional authoritative record. Status and evidence remain those recorded in the source.

2026-10-05, Alien-codex, currently accepted main `0e9bea3ce739b979e582a428af8fb233045a5e75`; CEX705 does not change the pairing / discovery / enrollment code inspected here.

The short code is not a global City lookup key. Each City Pairing instance stores only its current session and verification-code hash. Exchange must match cityId, sessionId, method, and the current short code together. Windows enrollment requires a City endpoint; Web short-code entry first reads pairing/info at the selected endpoint and binds to the same City. There is no directory or routing mechanism that globally locates a City from only a six-digit code. mDNS/BLE are the existing local discovery entry points; this source inspection does not claim connectivity across regions.

The Windows/Web descriptor/endpoint parser accepts HTTP/HTTPS addresses, and the exchange logic has no region field. This only shows that there is no regional check when the destination is known and transport is reachable; it does not prove completion of the public-internet, cross-region relay, or HTTPS native product path. The current Android PairingProtocol.endpoint accepts only HTTP and reports Invalid LAN endpoint. This native entry point is not an implemented HTTPS remote short-code sign-in. Real cross-region sign-in is NOT_RUN.

A further finding is that the backend lockout error hardcodes “refresh on Alien”. This conflicts with the requirement that different hosts/Cities can use custom names. Neutral instructions referring to the City host were chosen, preserving 429, attempt limits, session logic, and trust logic. An independent fix/Alien-codex-pairing-city-neutral-lockout branch will be created from accepted main, first reproducing the lockout wording with a custom City on a real Gateway, then repairing it. This is not primary-City migration and does not mix in CEX code that has not been formally accepted.

Repair candidate `a7d6f2a9b97e02d5fd10adf3a73eafb4a5f3ef6e` / PR23. A real Gateway red test reproduced the old message. After the fix, 24 pairing/lifecycle/original Review tests passed. The final regression used the canonical PATCH City rename to Luna and passed 1/1; independent technical review passed 1/1 with no blocker. Exact CI37221410664 is in progress. The earlier test-shortcut head `ba49ac55c0d7b488fc3279ec1d4f20c701d6a3e8` has been superseded; its green status is not borrowed. The wording change did not alter 429/attempt count/expiry/identity/role logic. It does not claim that primary-City migration or public-internet remote capability is thereby complete. Original log hashes are in PAIRING_NAME_RECEIPT.json.

语言配对 / Language pair: [原文 / Source](../SHORT_CODE_REMOTE_CHECK.md)
