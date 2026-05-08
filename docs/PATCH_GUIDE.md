# Patch Guide: Zero-Cost Mode

## Overview

Conway Automaton's default runtime assumes Conway Cloud connectivity. These patches allow zero-cost local execution without SIWE, API keys, or USDC.

## Patch Files

### `0001-zero-cost-skip-api.patch`

Modifies `src/index.ts` and `src/conway/client.ts`:

**`src/index.ts` changes:**

```diff
- const apiKey = config.conwayApiKey || loadApiKeyFromConfig();
+ const apiKey = config.conwayApiKey || loadApiKeyFromConfig() || "";
+ const isLocalMode = !config.sandboxId || !apiKey;

- if (!apiKey) {
+ if (!apiKey && config.sandboxId) {
    logger.error("No API key found");
    process.exit(1);
  }
```

**Rationale**: When `sandboxId` is empty, the agent operates in local mode and doesn't need an API key.

```diff
- if (registrationState !== "registered") {
+ if (config.sandboxId && registrationState !== "registered") {
```

**Rationale**: Skip Conway registration when not using Conway Cloud.

```diff
-    const topupResult = await bootstrapTopup({
+    if (config.sandboxId) {
+      const topupResult = await bootstrapTopup({
         apiUrl: config.conwayApiUrl,
         account,
         creditsCents,
         chainType: resolvedChainType,
       });
+    }
```

**Rationale**: Skip automatic topup in local mode.

```diff
-  const heartbeat = createHeartbeatDaemon({
+  const heartbeat = isLocalMode ? null : createHeartbeatDaemon({
```

**Rationale**: Disable heartbeat when not connected to Conway Cloud.

**`src/conway/client.ts` changes:**

```diff
   async function request(method, endpoint, payload?, options?) {
+    if (isLocal) {
+      logger.debug(`[local] Skipping API call: ${endpoint}`);
+      return { data: {} };
+    }
```

**Rationale**: Skip API calls when in local mode, returning empty responses.

## Alternative: Environment Variable Trick

Without patching source code, you can use:

```bash
export CONWAY_API_KEY="dummy"
export CONWAY_API_URL="http://localhost:9999"
```

The register/topup calls will fail silently, but local exec continues working. **Not recommended** — produces error logs.

## Minimal Patch Approach

If you prefer minimal invasiveness, only patch these 2 lines:

1. `src/index.ts:200` — wrap `if (!apiKey)` with `config.sandboxId` check
2. `src/conway/client.ts:45` — add `if (isLocal) return { data: {} }`

This is all that's needed for zero-cost local execution.
