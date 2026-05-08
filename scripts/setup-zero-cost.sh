#!/usr/bin/env bash
# Usage: bash scripts/setup-zero-cost.sh
# Generates ~/.automaton/ configuration files for zero-cost local mode

set -euo pipefail

AUTOMATON_DIR="${HOME}/.automaton"
mkdir -p "$AUTOMATON_DIR"
mkdir -p "$AUTOMATON_DIR/skills"
mkdir -p "$AUTOMATON_DIR/providers"

# Determine Ollama URL from env or use default public endpoint
OLLAMA_URL="${OLLAMA_BASE_URL:-http://66.78.183.151:11434/v1}"

cat > "$AUTOMATON_DIR/automaton.json" <<'EOF'
{
  "name": "ZeroCostBot",
  "genesisPrompt": "You are a zero-cost autonomous agent running entirely on Ollama. Your mission: write useful open-source tools, push to GitHub, and build reputation. Constraints: 1. Never call topup_credits, expose_port, or register_domain. 2. Use only local tools: exec, read_file, write_file, git_commit. 3. All inference goes through Ollama (cost=0). 4. Write code that attracts GitHub sponsors.",
  "creatorAddress": "0x0000000000000000000000000000000000000000",
  "registeredWithConway": false,
  "sandboxId": "",
  "conwayApiUrl": "",
  "conwayApiKey": "",
  "ollamaBaseUrl": "OLLAMA_URL_PLACEHOLDER",
  "inferenceModel": "llama3.1:8b",
  "maxTurnsPerCycle": 10,
  "maxTokensPerTurn": 4096,
  "version": "0.2.1",
  "logLevel": "info",
  "dbPath": "~/.automaton/state.db",
  "heartbeatConfigPath": "~/.automaton/heartbeat.yml",
  "skillsDir": "~/.automaton/skills",
  "maxChildren": 0,
  "childSandboxMemoryMb": 0,
  "socialRelayUrl": "",
  "modelStrategy": {
    "defaultModel": "llama3.1:8b",
    "lowComputeModel": "llama3.1:8b"
  },
  "treasuryPolicy": {
    "maxSingleTransferCents": 0,
    "maxHourlyTransferCents": 0,
    "maxDailyTransferCents": 0,
    "minimumReserveCents": 0,
    "maxX402PaymentCents": 0,
    "x402AllowedDomains": [],
    "transferCooldownMs": 0,
    "maxTransfersPerTurn": 0,
    "maxInferenceDailyCents": 0,
    "requireConfirmationAboveCents": 0
  }
}
EOF
sed -i "s|OLLAMA_URL_PLACEHOLDER|$OLLAMA_URL|g" "$AUTOMATON_DIR/automaton.json"

cat > "$AUTOMATON_DIR/providers/providers.json" <<'EOF'
{
  "providers": [
    {
      "id": "local",
      "name": "Ollama (Zero Cost)",
      "baseUrl": "OLLAMA_URL_PLACEHOLDER",
      "apiKeyEnvVar": "LOCAL_API_KEY",
      "maxRequestsPerMinute": 1000,
      "maxTokensPerMinute": 1000000,
      "priority": 1,
      "enabled": true,
      "models": [
        {
          "id": "llama3.1:8b",
          "tier": "cheap",
          "contextWindow": 131072,
          "maxOutputTokens": 4096,
          "costPerInputToken": 0,
          "costPerOutputToken": 0,
          "supportsTools": true,
          "supportsVision": false,
          "supportsStreaming": true
        },
        {
          "id": "llama3.1:8b",
          "tier": "fast",
          "contextWindow": 131072,
          "maxOutputTokens": 4096,
          "costPerInputToken": 0,
          "costPerOutputToken": 0,
          "supportsTools": true,
          "supportsVision": false,
          "supportsStreaming": true
        }
      ]
    }
  ],
  "tierDefaults": {
    "reasoning": {"preferredProvider": "local", "fallbackOrder": ["local"]},
    "fast": {"preferredProvider": "local", "fallbackOrder": ["local"]},
    "cheap": {"preferredProvider": "local", "fallbackOrder": ["local"]}
  },
  "globalRateLimits": {"emergencyStopCredits": 0}
}
EOF
sed -i "s|OLLAMA_URL_PLACEHOLDER|$OLLAMA_URL|g" "$AUTOMATON_DIR/providers/providers.json"

cat > "$AUTOMATON_DIR/heartbeat.yml" <<'EOF'
version: "1"
heartbeat:
  enabled: true
  defaultIntervalMs: 60000
  lowComputeMultiplier: 2
  criticalIntervalMs: 3600000
EOF

# Generate a mock wallet (local mode only, no real funds)
WALLET_ADDR="0x$(openssl rand -hex 20)"
cat > "$AUTOMATON_DIR/wallet.json" <<EOF
{
  "address": "${WALLET_ADDR}",
  "chainType": "evm",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "note": "Mock wallet for zero-cost local mode. No real funds."
}
EOF

echo "✅ Zero-cost configuration written to ~/.automaton/"
echo ""
echo "Files created:"
ls -la "$AUTOMATON_DIR"
echo ""
echo "Next steps:"
echo "  1. cd path/to/automaton-repo"
echo "  2. Apply patch: patch -p1 < path/to/zero-cost.patch"
echo "  3. pnpm build"
echo "  4. node dist/index.js --run"
