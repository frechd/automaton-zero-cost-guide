#!/usr/bin/env node
/**
 * Zero-Cost Setup Script for Conway Automaton
 * Generates ~/.automaton/ configuration for local-zero-cost mode
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const AUTOMATON_DIR = path.join(os.homedir(), '.automaton');
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://66.78.183.151:11434/v1';

// ─── Helpers ────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Written: ${filePath}`);
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log(`Written: ${filePath}`);
}

// ─── Generate Configurations ────────────────────────────────────────

const automatonConfig = {
  name: "ZeroCostBot",
  genesisPrompt:
    "You are a zero-cost autonomous agent running entirely on Ollama. Your mission: write useful open-source tools, push to GitHub, and build reputation. Constraints: 1. Never call topup_credits, expose_port, or register_domain. 2. Use only local tools: exec, read_file, write_file, git_commit. 3. All inference goes through Ollama (cost=0). 4. Write code that attracts GitHub sponsors.",
  creatorAddress: "0x0000000000000000000000000000000000000000",
  registeredWithConway: false,
  sandboxId: "",
  conwayApiUrl: "",
  conwayApiKey: "",
  ollamaBaseUrl: OLLAMA_URL,
  inferenceModel: "llama3.1:8b",
  maxTurnsPerCycle: 10,
  maxTokensPerTurn: 4096,
  version: "0.2.1",
  logLevel: "info",
  dbPath: "~/.automaton/state.db",
  heartbeatConfigPath: "~/.automaton/heartbeat.yml",
  skillsDir: "~/.automaton/skills",
  maxChildren: 0,
  childSandboxMemoryMb: 0,
  socialRelayUrl: "",
  modelStrategy: {
    defaultModel: "llama3.1:8b",
    lowComputeModel: "llama3.1:8b",
  },
  treasuryPolicy: {
    maxSingleTransferCents: 0,
    maxHourlyTransferCents: 0,
    maxDailyTransferCents: 0,
    minimumReserveCents: 0,
    maxX402PaymentCents: 0,
    x402AllowedDomains: [],
    transferCooldownMs: 0,
    maxTransfersPerTurn: 0,
    maxInferenceDailyCents: 0,
    requireConfirmationAboveCents: 0,
  },
};

const providersConfig = {
  providers: [
    {
      id: "local",
      name: "Ollama (Zero Cost)",
      baseUrl: OLLAMA_URL,
      apiKeyEnvVar: "LOCAL_API_KEY",
      maxRequestsPerMinute: 1000,
      maxTokensPerMinute: 1000000,
      priority: 1,
      enabled: true,
      models: [
        {
          id: "llama3.1:8b",
          tier: "cheap",
          contextWindow: 131072,
          maxOutputTokens: 4096,
          costPerInputToken: 0,
          costPerOutputToken: 0,
          supportsTools: true,
          supportsVision: false,
          supportsStreaming: true,
        },
        {
          id: "llama3.1:8b",
          tier: "fast",
          contextWindow: 131072,
          maxOutputTokens: 4096,
          costPerInputToken: 0,
          costPerOutputToken: 0,
          supportsTools: true,
          supportsVision: false,
          supportsStreaming: true,
        },
      ],
    },
  ],
  tierDefaults: {
    reasoning: { preferredProvider: "local", fallbackOrder: ["local"] },
    fast: { preferredProvider: "local", fallbackOrder: ["local"] },
    cheap: { preferredProvider: "local", fallbackOrder: ["local"] },
  },
  globalRateLimits: { emergencyStopCredits: 0 },
};

const heartbeatConfig = `version: "1"
heartbeat:
  enabled: true
  defaultIntervalMs: 60000
  lowComputeMultiplier: 2
  criticalIntervalMs: 3600000
`;

// ─── Generate Mock Wallet ─────────────────────────────────────────

const walletAddress = "0x" + crypto.randomBytes(20).toString("hex");
const wallet = {
  address: walletAddress,
  chainType: "evm",
  createdAt: new Date().toISOString(),
  note: "Mock wallet for zero-cost local mode. No real funds.",
};

// ─── Write All Files ────────────────────────────────────────────────

ensureDir(AUTOMATON_DIR);
ensureDir(path.join(AUTOMATON_DIR, "skills"));
ensureDir(path.join(AUTOMATON_DIR, "providers"));

writeJson(path.join(AUTOMATON_DIR, "automaton.json"), automatonConfig);
writeJson(path.join(AUTOMATON_DIR, "providers", "providers.json"), providersConfig);
writeFile(path.join(AUTOMATON_DIR, "heartbeat.yml"), heartbeatConfig);
writeJson(path.join(AUTOMATON_DIR, "wallet.json"), wallet);

console.log("");
console.log("✅ Zero-cost configuration complete!");
console.log("");
console.log("Next steps:");
console.log("  1. Apply patch:  patch -p1 < patches/0001-zero-cost-skip-api.patch");
console.log("  2. Build:        pnpm build");
console.log("  3. Run:           node dist/index.js --run");
console.log("");
console.log("⚠️  Note: This is zero-cost mode. No credits will be spent.");
console.log("     Expose_port, register_domain, and x402 are disabled.");
