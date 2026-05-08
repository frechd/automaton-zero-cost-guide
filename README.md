# Automaton Zero-Cost Starter

> Universal Hermes Skill for running Conway Automaton at zero cost. No SIWE, No API Key, No USDC.
> 
> 通用 Hermes Skill —— 让 Conway Automaton 零成本跑起来。无需 SIWE、无需 API Key、无需 USDC。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Skill: Hermes](https://img.shields.io/badge/Skill-Hermes-blue.svg)](#as-hermes-skill)

---

## What is this?

Conway Automaton is a sovereign AI Agent Runtime, but its official startup requires:
- SIWE login (Sign-In With Ethereum)
- Conway API Key
- $5 USDC bootstrap

**This repo lets you skip ALL barriers** and run Automaton in local mode with remote Ollama — completely free.

### Zero-Cost Capabilities

| Capability | Zero-Cost Mode | Savings |
|-----------|---------------|---------|
| LLM Inference | Ollama remote endpoint | ~$0.03/call |
| Sandbox Execution | Local shell | $5+/month |
| File Operations | Local disk | $0 |
| Git Operations | Local git | $0 |
| Heartbeat | Local cron | $0 |

---

## Quick Start (3 Steps)

### Step 1: Clone Automaton

```bash
git clone https://github.com/Conway-Research/automaton.git
cd automaton
pnpm install
```

### Step 2: Apply Patch

```bash
# Use this repo's patch script
curl -fsSL https://raw.githubusercontent.com/frechd/automaton-zero-cost-guide/main/patch.sh | bash
```

Or manually: `patch -p1 < patches/0001-zero-cost-skip-api.patch`

### Step 3: Configure & Run

```bash
# Generate zero-cost config
node scripts/setup-zero-cost.js

# Run
node dist/index.js --run
```

---

## What Gets Patched?

| File | Change | Reason |
|------|--------|--------|
| `src/index.ts` | Skip API Key check | Not needed for local mode |
| `src/index.ts` | Skip Conway registration | No SIWE needed |
| `src/index.ts` | Skip bootstrap topup | No credits needed |
| `src/conway/client.ts` | Skip API calls in local mode | Avoid errors |
| `src/inference/provider-registry.ts` | Add Ollama Provider | Zero-cost inference |

**Detailed patch guide**: see `docs/PATCH_GUIDE.md`

---

## Configuration

### `automaton.json` (Zero-Cost Edition)

```json
{
  "name": "ZeroCostBot",
  "genesisPrompt": "You are a zero-cost agent. Use only local tools. Write open-source code and push to GitHub.",
  "registeredWithConway": false,
  "sandboxId": "",
  "conwayApiUrl": "",
  "conwayApiKey": "",
  "ollamaBaseUrl": "http://YOUR_OLLAMA_URL/v1",
  "inferenceModel": "llama3.1:8b",
  "maxChildren": 0,
  "treasuryPolicy": {
    "maxSingleTransferCents": 0,
    "maxHourlyTransferCents": 0,
    "maxDailyTransferCents": 0,
    "minimumReserveCents": 0,
    "maxX402PaymentCents": 0,
    "x402AllowedDomains": [],
    "maxTransfersPerTurn": 0,
    "maxInferenceDailyCents": 0,
    "requireConfirmationAboveCents": 0
  }
}
```

---

## Limitations in Zero-Cost Mode

| Feature | Available | Alternative |
|---------|-----------|-------------|
| `exec` | ✅ | Local shell |
| `read_file`/`write_file` | ✅ | Local disk |
| `git_commit`/`git_push` | ✅ | Local git |
| `web_fetch` | ✅ | Direct internet |
| `ollama_chat` | ✅ | Ollama remote endpoint |
| `update_soul` | ✅ | Self-reflection |
| `expose_port` | ⚠️ | Localhost only (no public internet) |
| `register_domain` | ❌ | N/A |
| `spawn_child` | ❌ | `maxChildren: 0` |
| `x402_fetch` | ❌ | Zero credits |
| `topup_credits` | ❌ | Zero-cost mode |

---

## How to Earn? (Starting from $0)

### Stage 1: Open Source Contributor ($0)

1. Write code with zero-cost Automaton
2. Push to GitHub
3. Gain stars and reputation
4. Enable GitHub Sponsors

### Stage 2: Service Provider ($5+)

1. Top up $5 USDC → Enter Conway Cloud sandbox
2. `expose_port` to expose services
3. Earn USDC via x402
4. Service examples: API, data scraping, automation

### Stage 3: Autonomous Economy ($50+)

1. Deploy multiple agents
2. Spawn child agents for specialized tasks
3. Build automated revenue streams

---

## As Hermes Skill

This repository is also a **Hermes Skill** that can be loaded by any Hermes Agent.

### Installation

```bash
git clone https://github.com/frechd/automaton-zero-cost-guide.git \
  ~/.hermes/profiles/YOUR_PROFILE/skills/automaton-zero-cost-guide
```

### Triggers

The skill auto-loads when you say:
- "零成本启动 Automaton" / "zero cost automaton"
- "Automaton 本地模式" / "automaton local mode"
- "跳过 SIWE" / "skip SIWE"
- "无需 USDC 运行 agent" / "run agent without USDC"
- "automaton setup"

### Skill Capabilities

1. **Patch Scripts**: One-click modification of Automaton source to skip auth
2. **Config Templates**: Generate `automaton.json` + `providers.json`
3. **Economy Analysis**: $0 → $5 → $50 earning roadmap
4. **Limitation Matrix**: What's available/unavailable in local mode

---

## File Structure

```
.
├── SKILL.md                          # Hermes Skill definition
├── README.md                         # Project intro (this file)
├── LICENSE                           # MIT License
├── .gitignore
├── patches/
│   └── 0001-zero-cost-skip-api.patch # Core patch file
├── scripts/
│   ├── setup-zero-cost.js            # Config generator
│   └── setup-zero-cost.sh            # Bash version
├── docs/
│   ├── PATCH_GUIDE.md                # Detailed patch docs
│   ├── ECONOMY_ANALYSIS.md           # Revenue model analysis
│   └── ZERO_COST_SETUP.md            # Setup guide
└── config/
    └── providers.json.example        # Ollama provider config
```

---

## Docs

- `docs/PATCH_GUIDE.md` — Detailed patch explanation
- `docs/ECONOMY_ANALYSIS.md` — Revenue model deep-dive
- `docs/ZERO_COST_SETUP.md` — Zero-cost setup guide
- `SKILL.md` — Hermes Skill definition (for agents)

---

## Contributing

PRs welcome! Help make zero-cost startup smoother.

### Wishlist

- [ ] More provider support (LM Studio, vLLM, local Ollama)
- [ ] Docker one-liner startup
- [ ] Better sandbox isolation
- [ ] Auto-detect Automaton version and adapt patch
- [ ] Windows support

---

## License

MIT © 2026
