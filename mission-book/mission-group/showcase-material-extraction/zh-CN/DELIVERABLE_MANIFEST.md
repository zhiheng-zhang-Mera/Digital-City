[English source / 英文原稿](../DELIVERABLE_MANIFEST.md)

# SHOW-401 — 交付物清单

> **状态：模板。所有选定产物均在此登记后，最终包才可收口。**

## 运行时绑定

- Digital-City控制SHA: `TODO`
- Utopia运行时SHA: `TODO`
- Utopia CI: `TODO`
- 录制主机: `TODO`
- 复检主机: `TODO`
- 本地导出根目录: `TODO`

## 选定产物

### MAIN-DEMO-01

- artifact_type: video
- title: TODO
- capture_host: TODO
- physical_devices: TODO
- recorded_at: TODO
- file_path: TODO
- sha256: TODO
- duration: TODO
- task_ids: TODO
- contains_sensitive_content: false / TODO
- claims_supported: TODO
- known_limits: TODO
- selected_for_outreach: yes

### TECH-DEMO-01

- artifact_type: video
- title: TODO
- capture_host: TODO
- physical_devices: TODO
- recorded_at: TODO
- file_path: TODO
- sha256: TODO
- duration: TODO
- task_ids: TODO
- contains_sensitive_content: false / TODO
- claims_supported: TODO
- known_limits: TODO
- selected_for_outreach: yes

### SCREENSHOT-01

- artifact_type: image
- title: TODO
- file_path: TODO
- sha256: TODO
- dimensions: TODO
- task_ids: TODO
- claims_supported: TODO
- selected_for_outreach: yes

### SCREENSHOT-02

- artifact_type: image
- title: TODO
- file_path: TODO
- sha256: TODO
- dimensions: TODO
- task_ids: TODO
- claims_supported: TODO
- selected_for_outreach: yes

### SCREENSHOT-03

- artifact_type: image
- title: TODO
- file_path: TODO
- sha256: TODO
- dimensions: TODO
- task_ids: TODO
- claims_supported: TODO
- selected_for_outreach: yes

## 隐私质量检查

- [ ] 没有可见的永久bearer令牌。
- [ ] 没有可见的 `.runtime/local-config.json`。
- [ ] 没有可见的私人账号、邮件或通知内容。
- [ ] 若画面中出现临时配对材料，录制后已使其失效。
- [ ] 没有不必要地暴露个人文件系统路径。
- [ ] Android通知内容已清理。
- [ ] 会议参与者标签适合公开发布。

## UI／运行时可见性检查

- [ ] Alien的Utopia产品窗口清晰可见。
- [ ] Mech共享桌面显示Utopia产品UI，不能只有终端。
- [ ] Android Studio显示实体设备镜像。
- [ ] CMD／PowerShell只作辅助。
- [ ] RUNNING／分配／交接／完成证据来自产品UI。

## 产物字段说明

字段键与英文模板一致，以保留登记格式：artifact_type＝产物类型（video视频／image图像）；title＝标题；capture_host＝录制主机；physical_devices＝实体设备；recorded_at＝录制时间；file_path＝文件路径；sha256＝SHA256；duration＝时长；task_ids＝任务ID；contains_sensitive_content＝是否含敏感内容（false／TODO仍待确认）；claims_supported＝支持的主张；known_limits＝已知局限；selected_for_outreach＝是否选用于对外联系（yes）；dimensions＝图像尺寸。所有TODO保持未观测占位。
