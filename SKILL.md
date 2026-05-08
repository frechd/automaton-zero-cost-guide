---
name: automaton-zero-cost-guide
title: Automaton 零成本启动指南
description: >
  让 Conway Automaton 零成本跑起来的通用 Skill。无需 SIWE、无需 API Key、无需 USDC，
  通过 patch 脚本 + 配置模板，将 Automaton 切换为本地模式 + 远程 Ollama 推理。
  适合所有希望零门槛体验主权 AI Agent Runtime 的开发者。
triggers:
  - "零成本启动 Automaton"
  - "Automaton 本地模式"
  - "跳过 SIWE 运行 Automaton"
  - "无需 USDC 运行 agent"
  - "零成本 agent"
  - "automaton setup"
  - "本地运行 automaton"
category: devops
version: "1.0.0"
---

# Automaton 零成本启动指南

> 无需 SIWE、无需 API Key、无需 USDC —— 让 Conway Automaton 零成本跑起来。
> 
> No SIWE, No API Key, No USDC — run Conway Automaton at zero cost.

## 核心洞察

Conway Automaton 是一个主权 AI Agent Runtime，但它的官方启动方式需要：
- SIWE 登录（Sign-In With Ethereum）
- Conway API Key
- $5 USDC bootstrap

**这个仓库让你跳过所有门槛**，直接用本地模式 + 远程 Ollama 零成本运行 Automaton。

### 核心能力

| 能力 | 零成本模式 | 节省 |
|------|-----------|------|
| LLM 推理 | Ollama 远程端点 | ~$0.03/次 |
| 沙箱执行 | 本地 shell | $5+/月 |
| 文件操作 | 本地磁盘 | $0 |
| Git 操作 | 本地 git | $0 |
| 心跳监控 | 本地 cron | $0 |

## 适用场景

- **学生/研究者**：想研究 Automaton 架构但不想花钱
- **开发者**：想在本地调试 agent 行为
- **零 USDC 用户**：余额为 0，想先体验再决定是否投入
- **安全研究者**：想审计 Automaton 源码，不暴露真实身份

## 快速开始（3 步）

### Step 1: 克隆 Automaton

```bash
git clone https://github.com/Conway-Research/automaton.git
cd automaton
pnpm install
```

### Step 2: 应用 Patch

```bash
# 使用本仓库的 patch 脚本
curl -fsSL https://raw.githubusercontent.com/frechd/automaton-zero-cost-guide/main/patch.sh | bash
```

或手动 patch：`patch -p1 < patches/0001-zero-cost-skip-api.patch`

### Step 3: 配置 + 运行

```bash
# 生成零成本配置
node scripts/setup-zero-cost.js

# 运行
node dist/index.js --run
```

## 需要 Patch 什么？

| 文件 | 修改 | 原因 |
|------|------|------|
| `src/index.ts` | 跳过 API Key 检查 | 本地模式不需要 |
| `src/index.ts` | 跳过 Conway 注册 | 不需要 SIWE |
| `src/index.ts` | 跳过 bootstrap topup | 不需要 credits |
| `src/conway/client.ts` | 本地模式跳过 API 调用 | 避免报错 |
| `src/inference/provider-registry.ts` | 添加 Ollama Provider | 零成本推理 |

**详细 patch 说明**：见 `docs/PATCH_GUIDE.md`

## 配置说明

### `automaton.json`（零成本版）

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

### `providers.json`（强制 Ollama）

见 `config/providers.json.example`

## 零成本模式限制

| 功能 | 可用 | 替代方案 |
|------|------|---------|
| `exec` | ✅ | 本地 shell |
| `read_file`/`write_file` | ✅ | 本地磁盘 |
| `git_commit`/`git_push` | ✅ | 本地 git |
| `web_fetch` | ✅ | 直连互联网 |
| `ollama_chat` | ✅ | Ollama 远程端点 |
| `update_soul` | ✅ | 自省 |
| `expose_port` | ⚠️ | 仅 localhost（无公网）|
| `register_domain` | ❌ | 不适用 |
| `spawn_child` | ❌ | `maxChildren: 0` |
| `x402_fetch` | ❌ | 零 credits |
| `topup_credits` | ❌ | 零成本模式 |

## 如何赚钱？（从 $0 开始）

### 阶段 1：开源贡献者（$0 启动）

1. 用零成本 Automaton 写代码
2. Push 到 GitHub
3. 积累 star 和 reputation
4. 开启 GitHub Sponsors

### 阶段 2：服务提供者（$5+ 启动）

1. 充值 $5 USDC → 进入 Conway Cloud 沙箱
2. `expose_port` 暴露服务
3. 用 x402 收取 USDC
4. 服务示例：API、数据抓取、自动化任务

### 阶段 3：自主经济（$50+）

1. 部署多个 agent
2. spawn 子代理做专项任务
3. 构建自动化收入流

## 文件结构

```
.
├── SKILL.md                          # 本 Skill 定义
├── README.md                         # 项目介绍（面向用户）
├── LICENSE                           # MIT License
├── .gitignore
├── patches/
│   └── 0001-zero-cost-skip-api.patch # 核心 patch 文件
├── scripts/
│   ├── setup-zero-cost.js            # 零成本配置生成
│   └── setup-zero-cost.sh            # Bash 版配置脚本
├── docs/
│   ├── PATCH_GUIDE.md                # Patch 详细说明
│   ├── ECONOMY_ANALYSIS.md           # 经济模型分析
│   └── ZERO_COST_SETUP.md            # 零成本配置指南
└── config/
    └── providers.json.example        # Ollama provider 配置示例
```

## 作为 Hermes Skill 使用

### 安装

```bash
# 克隆到 Hermes skills 目录
git clone https://github.com/frechd/automaton-zero-cost-guide.git \
  ~/.hermes/profiles/frech/skills/automaton-zero-cost-guide
```

### 触发方式

当用户说以下任意一种表达时，自动加载本 Skill：
- "零成本启动 Automaton"
- "Automaton 本地模式"
- "跳过 SIWE 运行 Automaton"
- "无需 USDC 运行 agent"
- "零成本 agent"
- "automaton setup"
- "本地运行 automaton"

### Skill 能力

本 Skill 提供：
1. **Patch 脚本**：一键修改 Automaton 源码跳过认证
2. **配置模板**：生成 `automaton.json` + `providers.json`
3. **经济分析**：$0 → $5 → $50 的赚钱路径
4. **限制清单**：本地模式可用/不可用的功能表

## 技术细节

### Patch 原理

```typescript
// src/index.ts — 修改前
if (!config.conwayApiKey) {
  throw new Error("Conway API Key required");
}

// src/index.ts — 修改后
if (!config.conwayApiKey && !process.env.ZERO_COST_MODE) {
  throw new Error("Conway API Key required");
}
```

### Ollama Provider 注册

```typescript
// src/inference/provider-registry.ts
this.registerProvider("ollama", new OllamaProvider({
  baseUrl: config.ollamaBaseUrl || "http://localhost:11434/v1",
  model: config.inferenceModel || "llama3.1:8b"
}));
```

### 安全沙箱

零成本模式下：
- `exec` 命令在本地 shell 执行（无网络隔离）
- 文件操作在 `~/.automaton/` 目录
- 没有 `expose_port` 公网暴露
- 建议仅在可信环境中使用

## 进阶：与 Frech 零成本自主代理结合

本 Skill 是 "让 Automaton 零成本启动" 的工具配置指南。

如果你使用的是 **Frech（Hermes Agent）**，已有等价的零成本能力：
- LLM 推理 → Hermes ollama-cloud（免费）
- 文件操作 → `read_file()`/`write_file()`（免费）
- 终端执行 → `terminal()`（免费）
- Git 操作 → `terminal(git)`（免费）
- 定时任务 → `cronjob()`（免费）

**区别**：
- Automaton 是一个独立运行的 agent 进程
- Frech 是 Hermes 基础设施内的知识工作 agent

两者可以互补：用 Frech 分析/配置 Automaton → 用 Automaton 做自动化执行。

## 贡献

欢迎 PR！让这个零成本启动方案越来越完善。

### 贡献方向

- [ ] 更多 provider 支持（LM Studio、vLLM、本地 Ollama）
- [ ] Docker 一键启动
- [ ] 更精细的沙箱隔离
- [ ] 自动检测 Automaton 版本并适配 patch
- [ ] Windows 支持

## 许可

MIT © 2026 frechd

---

*Skill 版本: v1.0.0 | 基于 Automaton v0.2.1 分析 | 通用零成本启动指南*
