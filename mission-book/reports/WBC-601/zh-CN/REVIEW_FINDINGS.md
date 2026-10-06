# WBC-601 独立复核问题

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留历史失败、未知边界和原证据，不新增验收。

审核者Alien-codex在真实MERA-ALIANWARE，开发者Mech在MEGA-REP。记录原头d65dbd3af2d8903aca13726f74110e1f2f6b9b65，重新验证原CI37205291447 SUCCESS；这不能证明缺失的负面情况。

P1：公开dispatch只检查端点就绪和终态，遗漏严格目标及交接守卫。为Mech排队的任务可分给Alien，在Mech运行的任务可重新分给空闲Alien。规范claim已有这些守卫，此接口暴露绕过。P2：关闭共享或忙时claim返回task:null，却readiness.ready=true，新元数据与实际接受矛盾。

相反主机独立测试在记录源重现三个负面情况（review-red2.log）。首轮审核夹具用了错误默认ID（Q-a/Alien而非Q-1/Mech），得到404而不是有效缺陷证据；纠正夹具并保留review-red.log为INVALID_INSTRUMENT，不把第一次失败算产品失败。

依§3选择直接Review/Correction：仅QUEUED可dispatch、分配前用相同严格／交接守卫、claim readiness与真实门一致。不新增调度器／存储，不改变已接受规范claim/report决定。当时纠正CI及注册回填待定，review_complete仍false。原始证据在Utopia .runtime/evidence/mission-book/WBC-601，不把日志复制到City。

纠正专项23/23通过；独立旧612c344f9f2b06a67b2645b4662d97750dd7c44e Gateway与纠正Gateway的HTTP轨迹在启动／无目标／持有者／进度／离线严格／未知／取消10/10等价。这是相反真实主机上的受控规范端点夹具，不是新分布式硬件活动。另P2空端口抛TypeError而非类型INVALID_BACKEND，红／绿后修复。最终审核纠正无冲突集成已接受main0e9bea3ce739b979e582a428af8fb233045a5e75，审核源11e59e71a2aaf00a03bb95d1f6d6a9a600191dd0。精确纠正CI当时待定，开发头仍不可变d65dbd3af2d8903aca13726f74110e1f2f6b9b65。

语言配对 / Language pair: [English](../REVIEW_FINDINGS.md) · [中文](./REVIEW_FINDINGS.md)
