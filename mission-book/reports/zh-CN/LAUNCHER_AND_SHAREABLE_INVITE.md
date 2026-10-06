# 记录——Mech：Utopia启动器、可分享配对token及切换City的邀请

阅读译本 / Reading translation：历史完整阅读译本，不是第二份权威验收记录。原始证据块原样保留并逐项解释。

```text
FROM = Mech (this host)          TO = Owner
BASIS = a DIRECT OWNER INSTRUCTION given in this host's session, not a workbook:
        "在Utopia的根目录下创建web应用的启动器，同时需要在web程序的"配对"页面显示或生成可分享的令牌。
         打开启动器时自动生成本地令牌，当输入后切换到对应令牌的城市并销毁本地令牌。"
STATUS = implemented, verified end to end against two live Cities, merged to Utopia main
MAIN   = 13109b4 (merge of feat/launcher-and-shareable-invite 1fd24c9); hosted CI on that sha: SUCCESS
```

发送者Mech（本主机），接收者Owner。依据是本会话直接Owner指示，不是工作簿：“在Utopia的根目录下创建web应用的启动器，同时需要在web程序的‘配对’页面显示或生成可分享的令牌。打开启动器时自动生成本地令牌，当输入后切换到对应令牌的城市并销毁本地令牌。”历史状态：已实现、对两个活跃City端到端验证、合入Utopia main；main13109b4为feat/launcher-and-shareable-invite1fd24c9的合并，精确SHA托管CI SUCCESS。

## 1. 实现内容

```text
Utopia.cmd                              the launcher, at the repository ROOT (double-clickable)
scripts/utopia-client-launcher.mjs      what it runs
apps/web/invite.js                      invite parsing, as a pure module
apps/web/app.js                         fragment bootstrap, invite handling, shareable token on the Pairing page
apps/web/index.html + i18n/{en,zh-CN}   the hint under the connect field and the new pairing strings
tests/web-invite.test.mjs               seven cases, one of which is a bug that actually shipped
```

根目录Utopia.cmd可双击启动，运行scripts/utopia-client-launcher.mjs；apps/web/invite.js负责纯模块邀请解析；app.js负责fragment引导、邀请处理、Pairing页可分享token；index.html和en/zh-CN翻译负责连接字段下提示及新配对文案；web-invite.test.mjs包含7项，其中一项对应实际上线过的缺陷。

**启动器**每次启动生成新的本地控制token，写入git忽略的.runtime/local-token.json，在同一窗口启动本机City。子Gateway经环境继承token，secret不会进入命令行。随后在默认浏览器打开已经连接的Web客户端，无需输入。

**可分享token**与原配对QR携带的utopia://pair?...载荷相同，现在在Pairing页以文本及复制按钮展示。

**输入token**会将客户端切换到token指向的City，并销毁本地token。

## 2. 指示未明确的问题、选择与理由

Owner常驻指示明确要求：未指定选项时选择最佳方案，并记录问题、选择及理由。四个关键选择如下。

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

L1问题：仅有裸凭据无法“输入token切到对应City”。token只对当前所指City认证，不说明归属City，本地registry无法了解从未遇到的City。选择：使用自描述邀请，即原QR的utopia://pair?...载荷，包含host、cityId、一次性session、expiry及secret。理由：使切换定义明确，扩展已有QR/short-code/pairing-exchange契约，而不创造平行契约。裸token行为保持原样，仅连接当前页origin。拒绝全球token registry或discovery查询，两者都是已有配对载荷已经解决的问题所不必新增的子系统。

L2问题：另一City页面无法fetch交换邀请，因为pairing/exchange属于会话所在City且Gateway无该路由CORS头，浏览器会拒绝跨origin POST。选择：切换采用导航，把邀请放在目标origin的URL FRAGMENT，再由目标自身页面进行same-origin交换。理由：无需CORS改动或新公共endpoint，fragment不发送服务器，一次性secret不进入access log；页面读完立即从地址栏移除。

L3问题：“销毁本地token”可能指客户端忘记、服务端撤销或关闭本地City，三者不同。选择：清空session storage使客户端忘记；每次启动器生成新token，使值本身短暂。未实现服务端撤销。理由：轮换运行中Gateway控制凭据会改变活跃服务认证路径，Owner未要求且扩大UI动作影响。启动器头明确说明，销毁不等于撤销。明确提出：若Owner要真正撤销，将增加仅同主机调用的rotate路由并单独测试。

L4问题：启动器需要City，但端口可能已有监听。选择：存储token能认证则复用，否则拒绝并显示监听者PID/命令行；--takeover仅在确实为dev-gateway进程时停止它。理由：静默杀掉占端口进程危险，验证只需字符串匹配。若supervisor在底层持续重启Gateway，启动器说明并停止，而非循环。

## 3. 验证方式

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

单元web-invite7/7通过；旧web-i18n、web-v02、web-terminal-shell、gateway、pairing共23/23；node --test tests/*.test.mjs整套1052测试全部通过、0失败。合并main13109b4的两次托管CI SUCCESS。本LAN两个活跃City的.runtime/mech-launcher-invite-e2e.mjs共7/7 PASS：邀请指出归属City；URL fragment引导后已连接且fragment移除；Pairing展示231字符可分享token及复制按钮；显示token指向当前City；输入邀请切换目标City；切换销毁本地token；因此客户端不会之后静默重连本地City。

## 4. 实际进入运行的作者缺陷及由此产生的测试

首版exchangeInvite接收邀请字符串，但connect handler传入已解析对象，重新解析“[object Object]”得到null，对完全有效邀请错误显示“the City returned no credential for that invite”。经历两次调试，错误消息改为指出实际询问的City，才暴露类型混淆。

修复接受两种输入形态。更深层修复把parser从app.js移入apps/web/invite.js：原先浏览器专属文件内测试无法访问，调用形态错误因而存活到端到端运行。七项新测试中六项各有具体缘由，第七项覆盖此缺陷。

## 5. 明确边界

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

1. 没有独立审查：开发与审查均在本主机，未满足CONSTRUCTION_RULES第3节不同物理主机要求。Owner直接要求并要求看运行，所以交付；保留该缺口，供另一主机检查。
2. 跨City切换要求目标City运行此客户端版本：导航落在目标自身页面，必须理解#pair=。开发主机canonical City仍提供旧app.js，落地后只显示连接表单。此为首轮端到端失败的实测，不是猜测，因此上文验证使用从当前checkout启动的第二City。
3. “销毁”仅客户端侧，见L3。
4. 启动器City是新City，有自身cityId且无worker node；负责提供客户端，不是三端mesh。启动worker是独立动作。
5. 没有实际双击启动：在可见console执行node scripts/utopia-client-launcher.mjs，即Utopia.cmd所执行内容；.cmd包装本身尚未验证。

## 6. 本主机遗留状态

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

启动器拥有的City在172.31.12.151:4391、cityId be70d952-338c-424c-bb09-4ae1741e35c0、ONLINE。本地token在git忽略的.runtime/local-token.json，由启动器生成且未打印；默认浏览器Web客户端已用它连接。job pwsh-172持有City，关闭该进程则停止City。4392的City B已经STOPPED，仅用于跨City证明。Mech-Win worker未运行：替换常驻实例启动本启动器，使共享canonical City中的worker离线。MESH-301已关闭所以没有依赖，但这是真实后果，特此记录而非留待后续发现。

语言配对 / Language pair: [原文 / Source](../LAUNCHER_AND_SHAREABLE_INVITE.md)
