# Conway Automaton Zero-Cost Starter

> 无需 SIWE、无需 API Key、无需 USDC —— 让 Conway Automaton 零成本跑起来。
> 
> No SIWE, No API Key, No USDC — run Conway Automaton at zero cost.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 什么是这个仓库？

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

---

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
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/automaton-zero-cost-guide/main/patch.sh | bash
```

或手动 patch：`patch -p1 < zero-cost.patch`

### Step 3: 配置 + 运行

```bash
# 生成零成本配置
node scripts/setup-zero-cost.js

# 运行
node dist/index.js --run
```

---

## 需要 Patch 什么？

| 文件 | 修改 | 原因 |
|------|------|------|
| `src/index.ts` | 跳过 API Key 检查 | 本地模式不需要 |
| `src/index.ts` | 跳过 Conway 注册 | 不需要 SIWE |
| `src/index.ts` | 跳过 bootstrap topup | 不需要 credits |
| `src/conway/client.ts` | 本地模式跳过 API 调用 | 避免报错 |
| `src/inference/provider-registry.ts` | 添加 Ollama Provider | 零成本推理 |

**详细 patch 说明**：见 `docs/PATCH_GUIDE.md`

---

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

---

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

---

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

---

## 文档

- `docs/PATCH_GUIDE.md` — 详细 Patch 说明
- `docs/ECONOMY_ANALYSIS.md` — 经济模型分析
- `docs/ZERO_COST_SETUP.md` — 零成本配置指南

---

## 贡献

欢迎 PR！让这个零成本启动方案越来越完善。

---

## License

MIT © 2026
