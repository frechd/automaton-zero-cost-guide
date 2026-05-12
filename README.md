# Automaton Zero-Cost Guide

> 📚 **Research Note**: Source-level analysis of Conway Automaton — 67,096 lines analyzed.
> Patch compiles but full runtime not yet verified. **Use as reference, not production.**
> 
> 源码级研究笔记：Conway Automaton 完整架构分析。Patch 可编译但运行时未完整验证。
> **用于参考学习，不建议生产环境使用。**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Lines Analyzed](https://img.shields.io/badge/Lines%20Analyzed-67k-green.svg)](#architecture)
[![Status](https://img.shields.io/badge/Status-Research%20Note-orange.svg)](#project-status)

---

## ⚠️ Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Source Code Analysis** | ✅ Complete | 67,096 lines across 186 files |
| **Architecture Map** | ✅ Complete | 22 modules, 34 tools fully documented |
| **Economic Model** | ✅ Verified | x402 client-only, no built-in revenue |
| **Patch Compilation** | ✅ Passes | `pnpm build` succeeds with verified patch |
| **Patch Verification** | ✅ Verified | Patch applies cleanly to v0.2.1 source |
| **Patch Runtime** | ⚠️ Partial | Compiles but agent loop not fully tested |
| **Setup Wizard Skip** | ❌ Not Done | Still triggers interactive setup |
| **End-to-End Run** | ❌ Not Verified | `node dist/index.js --run` needs more testing |

**Bottom line**: This repo is a **verified research asset**, not a drop-in replacement.
The analysis is real. The patch logic is sound. But making Automaton run smoothly in local mode requires more work.

---

## 🎁 What You Get (Today)

### 1. Architecture Analysis
[`docs/ARCHITECTURE_ANALYSIS.md`](docs/ARCHITECTURE_ANALYSIS.md) — Complete source map:

- **22 modules** with responsibility breakdown
- **34 built-in tools** with risk levels and execute implementations
- **Survival tiers**: high → normal → low_compute → critical → dead
- **Economic model**: Startup cost $5, no built-in revenue, x402 client-only
- **Security boundaries**: Path confinement, protected files, 403 no-fallback
- **Self-replication**: Spawn cost = 1 sandbox ($5+/month per child)

### 2. Verified Patch
[`patches/0001-zero-cost-skip-api.patch`](patches/0001-zero-cost-skip-api.patch) — Only 4 line changes:

```typescript
// src/index.ts:199 — Allow empty API key when sandboxId is empty
-  const apiKey = config.conwayApiKey || loadApiKeyFromConfig();
-  if (!apiKey) { ... }
+  const apiKey = config.conwayApiKey || loadApiKeyFromConfig() || "";
+  const isLocalMode = !config.sandboxId || !apiKey;
+  if (!apiKey && config.sandboxId) { ... }

// src/index.ts:250 — Skip registration in local mode
-  if (registrationState !== "registered") { ... }
+  if (!isLocalMode && registrationState !== "registered") { ... }

// src/index.ts:341 — Skip bootstrap topup in local mode
-  try { bootstrapTopup(...) }
+  if (!isLocalMode) try { bootstrapTopup(...) }

// src/index.ts:372 — Skip heartbeat in local mode
-  const heartbeat = createHeartbeatDaemon({...});
+  const heartbeat = isLocalMode ? null : createHeartbeatDaemon({...});
```

**Compiles**: ✅ `pnpm build` passes  
**Runtime**: ⚠️ Needs `automaton.json` + wallet pre-configured to skip wizard

### 3. Hermes Skill Definition
[`SKILL.md`](SKILL.md) — Load this repo as a Hermes Agent skill:

```bash
git clone https://github.com/frechd/automaton-zero-cost-guide.git \
  ~/.hermes/profiles/YOUR_PROFILE/skills/automaton-zero-cost-guide
```

Triggers: "零成本启动 Automaton", "Automaton 本地模式", "零成本 agent"

---

## 📊 Key Findings (From Source)

### Automaton's 34 Tools

| Category | Tools |
|---------|-------|
| VM | `exec`, `write_file`, `read_file`, `edit_own_file`, `revert_last_edit` |
| Network | `expose_port`, `remove_port` |
| Finance | `check_credits`, `check_usdc_balance`, `topup_credits` |
| Sandbox | `create_sandbox`, `delete_sandbox`, `list_sandboxes` |
| Git | `reset_to_upstream`, `pull_upstream`, `review_upstream_changes` |
| System | `sleep`, `system_synopsis`, `heartbeat_ping`, `distress_signal` |
| Config | `modify_heartbeat`, `update_genesis_prompt`, `install_mcp_server` |

### Economic Reality

```
Startup: $5 USDC minimum (bootstrap topup)
Tier 1 (high):     > $5.00  → GPT-4/Claude
Tier 2 (normal):   > $0.50  → GPT-4-mini
Tier 3 (low_compute): $0.10  → GPT-3.5 / Ollama
Tier 4 (critical):  $0.00  → Ollama only (still runs!)
Tier 5 (dead):      < $0   → Stopped, heartbeat continues
```

**Revenue**: ❌ No built-in revenue tools. `x402` is client-only (agent pays others).  
**To earn**: Need external traffic + `expose_port` + manual x402 server integration.

---

## 🚀 Quick Start (If You Want to Try)

### Prerequisites
- Node.js 20+
- pnpm
- Git

### Step 1: Clone Automaton

```bash
git clone https://github.com/Conway-Research/automaton.git
cd automaton
pnpm install
```

### Step 2: Apply Patch

```bash
curl -fsSL https://raw.githubusercontent.com/frechd/automaton-zero-cost-guide/main/patches/0001-zero-cost-skip-api.patch | patch -p1
```

### Step 3: Build

```bash
pnpm build
```

### Step 4: Configure (⚠️ Manual)

Write `~/.automaton/automaton.json` with empty `sandboxId` and `conwayApiKey`.
See [`scripts/setup-zero-cost.js`](scripts/setup-zero-cost.js) for template.

### Step 5: Run (⚠️ May Need More Setup)

```bash
node dist/index.js --run
```

**Note**: The setup wizard may still trigger. This is the part that needs more work.

---

## 🆚 Automaton vs Frech (Hermes Agent)

| Capability | Automaton | Frech (This Analysis) |
|-----------|-----------|----------------------|
| Source Analysis | — | ✅ 67k lines mapped |
| `exec` | ✅ | ✅ `terminal()` |
| `read/write_file` | ✅ | ✅ `read_file()` / `write_file()` |
| `edit_file` | ✅ | ✅ `patch()` |
| `ollama_chat` | ✅ (needs setup) | ✅ (Hermes built-in) |
| `spawn_child` | ✅ (needs $5) | ✅ `delegate_task()` |
| `heartbeat` | ✅ (needs Conway) | ✅ `cronjob()` |
| `semantic_search` | ✅ (SQLite) | ✅ `session_search()` |
| Cost to Analyze | $5+ | $0 |
| Cost to Run | $5+/month | $0 |

**Frech already has all core capabilities** — without needing to run Automaton.

---

## 🤝 Contributing

This is a research project. Contributions welcome:

- [ ] Fix setup wizard skip (auto-answer or bypass)
- [ ] Add Docker one-liner
- [ ] Test with local Ollama instance
- [ ] Add LM Studio / vLLM provider support
- [ ] Windows compatibility

---

## 📜 License

MIT © 2026 frechd

---

*Last updated: 2026-05-08*  
*Automaton version analyzed: v0.2.1*  
*Status: Research Note — verified analysis, partial runtime verification*
