# CEX-701 Paper Material Index

| Event | Observation / choice | Evidence | Status |
|---|---|---|---|
| Claim | Web fetch receives cloneFindings but Settings drops it; no normal rebind entry. Choose existing Settings host and preserve authority. | Utopia baseline40e18db4a6cf5bba1490181a473bc62e681edb8a apps/web/app.js:688; server.mjs:586 | INVESTIGATION |

Raw evidence stays Utopia/.runtime/evidence/mission-book/CEX-701/; selected bounded data goes Utopia/evidence/raw/mission-book/CEX-701/. No performance or physical-device result claimed yet.

| Web negative | 缺失clone提示及owner恢复引导，2个浏览器断言超时；新增真实UNBOUND/clone fixture | Utopia .runtime/evidence/mission-book/CEX-701/web-01/red.log | REPRODUCED |
| Integration failure | locale键首次错误插入export对象，语法失败使连接无法完成；已改messages扩展 | web-01/green.log；apps/web/i18n/{en,zh-CN}.js | REPAIRED |
| Scope conflict | owner切换成员时旧roster缓存可残留；generation/credential fence与连接缓存失效修复 | web-01/scope-switch-red.log / scope-switch-green.log | REPAIRED |
| Web validation | 恢复UI及旧权限回归16/16；不默认选设备、不删除clone、错误proof403、自身撤销与跨安装拒绝 | evidence/raw/mission-book/CEX-701/web-recovery-receipt.json；实现f1e1cea（full SHA见development记录） | COMPONENT_PASS |
| Environment | 旧JAVA_HOME/ANDROID_HOME失效，D:/Users/15601/AppData/Local/Android链接指向自身，SDK不可访问；选择独立D盘工具环境，不改系统链接 | android-baseline.log；当前文件属性查询 | TOOL_SETUP_PENDING |
