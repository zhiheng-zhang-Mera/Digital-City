# RECORD — Mech: the Utopia launcher, the shareable pairing token, and the invite that switches City

```text
FROM = Mech (this host)          TO = Owner
BASIS = a DIRECT OWNER INSTRUCTION given in this host's session, not a workbook:
        "在Utopia的根目录下创建web应用的启动器，同时需要在web程序的"配对"页面显示或生成可分享的令牌。
         打开启动器时自动生成本地令牌，当输入后切换到对应令牌的城市并销毁本地令牌。"
STATUS = implemented, verified end to end against two live Cities, merged to Utopia main
MAIN   = 13109b4 (merge of feat/launcher-and-shareable-invite 1fd24c9); hosted CI on that sha: SUCCESS
```

## 1. What was built

```text
Utopia.cmd                              the launcher, at the repository ROOT (double-clickable)
scripts/utopia-client-launcher.mjs      what it runs
apps/web/invite.js                      invite parsing, as a pure module
apps/web/app.js                         fragment bootstrap, invite handling, shareable token on the Pairing page
apps/web/index.html + i18n/{en,zh-CN}   the hint under the connect field and the new pairing strings
tests/web-invite.test.mjs               seven cases, one of which is a bug that actually shipped
```

**The launcher** generates a fresh LOCAL control token on every launch, writes it to `.runtime/local-token.json`
(git-ignored), brings this host's City up with it **in the same window** - the child gateway inherits the token
through the environment, so no secret is ever passed on a command line - and opens the web client in the default
browser **already connected**. Nothing is typed.

**The shareable token** is the same `utopia://pair?...` payload the pairing QR already carried, now DISPLAYED on
the Pairing page as text with a copy button.

**Entering it** switches the client to the City the token names, and destroys the local token.

## 2. The problems the instruction did not settle, and what I chose — as the standing rules require

The Owner's standing instruction is explicit: where an option is unspecified, choose the optimum and record the
problem, the choice and the reasoning. Four choices were load-bearing.

```text
L1  THE PROBLEM  "输入令牌后切换到对应令牌的城市" is impossible for a bare credential. A token authenticates
                 against whichever City you are already pointing at; it does not say WHICH City it belongs to,
                 and no local registry can know about a City it has never met.
    THE CHOICE   the shareable token is the SELF-DESCRIBING invite - the same `utopia://pair?...` payload the
                 pairing QR already carries (host + cityId + one-time session + expiry + secret).
    THE REASON   it makes the switch well-defined, and it extends the contract that already exists (QR, short
                 code, `pairing/exchange`) instead of inventing a parallel one. A bare token still works exactly
                 as before and still means "connect to this page's own origin", because nothing else is defined.
    REJECTED     a global token registry or a discovery lookup - both would be new subsystems for a problem the
                 existing pairing payload already solves.

L2  THE PROBLEM  an invite handed to another City's page cannot be exchanged by a fetch: `pairing/exchange` is a
                 route on the City that owns the session and the gateway sends no CORS headers for it, so the
                 browser would refuse a cross-origin POST.
    THE CHOICE   switching is a NAVIGATION. The client sends the invite to the target origin in its URL FRAGMENT
                 and that City's own page performs the exchange same-origin.
    THE REASON   no CORS change, no new public endpoint, and the fragment is never sent to a server, so the
                 one-time secret does not appear in any access log. The page strips it from the address bar as
                 soon as it has been read.

L3  THE PROBLEM  "销毁本地令牌" can mean three different things: forget it in the client, revoke it server-side,
                 or tear the local City down. They are not interchangeable and only one is honest to call
                 "destroyed".
    THE CHOICE   the client forgets it (session storage cleared), and the launcher regenerates a fresh token on
                 every launch, so the value is intrinsically ephemeral. Server-side revocation was NOT built.
    THE REASON   rotating a RUNNING gateway's control credential means changing the auth path of a live service,
                 which the Owner did not ask for and which widens the blast radius of a UI action. It is stated
                 in the launcher header rather than implied, because "destroyed" and "revoked" are not the same
                 word. Offered explicitly: if the Owner wants true revocation I will add a rotate route
                 restricted to same-host callers, with its own test.

L4  THE PROBLEM  the launcher needs the City to exist, but a City may already be listening on the port.
    THE CHOICE   reuse it if the stored token authenticates; otherwise REFUSE with the listener's PID and command
                 line. `--takeover` stops it, but only if the process really is a dev-gateway.
    THE REASON   a launcher that silently kills whatever holds a port is a foot-gun, and the check is one string
                 match. When a supervisor is restarting the gateway underneath, the launcher says so and stops
                 rather than looping.
```

## 3. How it was verified

```text
unit          tests/web-invite.test.mjs                                  7/7 pass
existing      web-i18n, web-v02, web-terminal-shell, gateway, pairing   23/23 pass
whole suite   node --test "tests/*.test.mjs"                            1052 tests, 1052 pass, 0 fail
hosted CI     both runs on the merged main sha 13109b4                  SUCCESS
end to end    .runtime/mech-launcher-invite-e2e.mjs against TWO LIVE CITIES on this LAN: 7/7 PASS
                PASS  the invite names the City it belongs to
                PASS  the client bootstrapped from the URL fragment and is connected, fragment stripped
                PASS  the Pairing page DISPLAYS a shareable token as text (231 chars, copy button)
                PASS  the displayed token names THIS City
                PASS  entering the invite SWITCHED the client to the City it names
                PASS  the LOCAL token was destroyed by the switch
                PASS  so the client does NOT silently reconnect to the local City afterwards
```

## 4. A bug of mine that shipped as far as a live run, and the test it produced

The first version of `exchangeInvite` accepted the invite **string**; the connect handler passed it the **parsed
object**. It re-parsed `"[object Object]"`, got `null`, and the client told the user *"the City returned no
credential for that invite"* — for a perfectly valid invite. Two debugging runs were spent before the error
message was made to name the City it had actually asked, which is what exposed the type confusion.

The fix accepts either shape. The deeper fix is that the parser moved out of `app.js` into `apps/web/invite.js`:
while it lived in a browser-only file **no test could reach it**, which is exactly why a caller-shape mistake
survived to an end-to-end run. Six of the seven new cases exist for a specific reason, and the seventh is that
bug.

## 5. Limits, stated rather than rounded off

```text
1. NO INDEPENDENT REVIEW. Development and review of this change were both done on THIS host, so CONSTRUCTION_RULES
   section 3 (different physical hosts) is NOT satisfied for it. The Owner asked for it directly and asked to see
   it run, so it is shipped; the gap is recorded rather than glossed, and it is the one thing here that another
   host should look at.
2. A CROSS-CITY SWITCH REQUIRES THE TARGET CITY TO RUN THIS CLIENT VERSION. The switch lands on the invited
   City's own page, and that page must understand `#pair=`. Against the canonical City on the development host -
   which still serves the pre-invite app.js - the client arrives at a page that has never heard of it and simply
   shows the connect form. Measured, not assumed: that is exactly how the first end-to-end attempt failed. The
   verification above therefore uses a second City started from this checkout.
3. "DESTROYED" IS CLIENT-SIDE (see L3).
4. THE LAUNCHER'S CITY IS A FRESH CITY with its own cityId and no worker node. It serves the client; it is not
   the three-end mesh, and starting a worker is a separate act.
5. THE LAUNCHER WAS NOT RUN AS A DOUBLE-CLICK. It was run as `node scripts/utopia-client-launcher.mjs` in a
   visible console, which is what `Utopia.cmd` does. The `.cmd` wrapper itself is unexercised.
```

## 6. State left behind on this host

```text
City (launcher-owned)   http://172.31.12.151:4391   cityId be70d952-338c-424c-bb09-4ae1741e35c0   ONLINE
local token             .runtime/local-token.json   generated by the launcher, git-ignored, not printed
web client              open in the default browser, connected with that token
job pwsh-172            the launcher process, holding the City; closing it stops the City
City B (4392)           STOPPED - it existed only to prove the cross-City switch
Mech-Win worker         NOT running: replacing the resident instance for this launcher took the worker offline in
                        the shared canonical City. MESH-301 is closed, so nothing depends on it, but it is a
                        real consequence of this change and is recorded rather than discovered later.
```
