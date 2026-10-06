# PCF-714 — Origin-surface continuity

[Canonical state](../PCF-714-origin-surface-continuity.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose origin-projection.mjs and tests/pcf714-origin.test.mjs; coordinate existing-client changes with 700/715. Reuse canonical Action/Attention and server sequence/cursors, not another notification authority.

Remote execution/recovery changes attempts, not original task/action/origin identity. The originating surface receives progress, placement reasons, results/artifacts, errors and attention, and can cancel/respond. Offline origins later catch up from bounded canonical event history; gaps trigger reconciliation and duplicate events do not duplicate results or alerts.

Authorized interaction handoff uses existing assistant/attention rules without creating tasks or exposing unauthorized context. Resolve cancel/approval/completion races through one terminal truth; late cancellation cannot claim to undo external effects. Preserve existing recent-device notification policy rather than broadcast everywhere.

Run `node --test tests/pcf714-origin.test.mjs` for disconnect/reconnect, duplicate/reordered events, rebinding, expired access, result/cancel races and concurrent attention responses. Unauthorized surfaces receive neither results nor protected metadata.

On physical Alien Web, Mech Web and Android, initiate lawful cross-worker tasks, retrieve results on the origin and demonstrate cancellation/failure. Android remains a control client. Bind screenshots and backend traces to the same task/attempt rather than accepting mock dashboards.
