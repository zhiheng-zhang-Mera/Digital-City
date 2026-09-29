# Haptic Glove — 触觉手套 / 低延迟具身交互设备

```text
STATUS = EXISTING_DEVICE_FIRMWARE_EXPERIMENT_NOT_PRODUCTION_QUALIFIED
REPOSITORY = https://github.com/zhiheng-zhang-Mera/My_VR_Glove
SOURCE_BRANCH = master
SOURCE_SNAPSHOT = 0775f593daa915d8d9f393f2665d3193c289e09c
PLATFORM = ESP32 / PlatformIO
```

## Role

Provide a device-side hand/haptic interaction endpoint for VR/embodied systems.

## Existing capability cluster

- single-pass linear serial decoding;
- non-blocking/ring-buffer style serial I/O;
- low-latency ESP32-oriented control path;
- high-rate servo haptic output (repository target: 250 Hz);
- proportional software power-budget limiting/"soft fuse";
- hardware pin/baud configuration through firmware.

## Boundary

This is device firmware, not the VR application, world model or City automation planner.

The high-rate servo mode is explicitly experimental and hardware-dependent; City mapping does not claim thermal/electrical safety or production qualification.
