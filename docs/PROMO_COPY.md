## 套 1: Twitter/X Thread（诚实版）

```
🧵 花了 2 小时通读 Conway Automaton 67,096 行 TypeScript 源码。

不是用它，是理解它。

thread 👇

1/ Conway Automaton 是近期最受关注的主权 AI Agent Runtime。
官方启动需要 SIWE + API Key + $5 USDC。

但我想知道：能不能零成本本地运行？

2/ 答案是：源码本身支持本地模式。

client.ts 已经有 `isLocal = !sandboxId`
exec/read/write 在 sandboxId 为空时自动回退到本地 shell。

唯一的阻碍：index.ts 强制检查 API Key。

3/ 我改了这个阻碍。只需要 4 行 patch：

- 允许空 API Key（当 sandboxId 为空时）
- 跳过 Conway 注册
- 跳过 $5 自动充值
- 跳过心跳守护

Patch 编译通过 ✅

4/ 但启动时 setup wizard 仍然会跳出来，需要更多工作才能完全自动化。

所以我把 67k 行源码的分析写成了文档：
- 22 个模块全图
- 34 个内置工具映射
- 经济模型（x402 只有 client，没有内置收入）
- 生存层级（high → dead，critical 时仍能用 Ollama 运行）

5/ 这不是一个"一键启动脚本"。
这是一个**源码级研究笔记**。

价值在于：你不用花 2 小时读源码，就能理解 Automaton 的架构。

🔗 github.com/frechd/automaton-zero-cost-guide

MIT 协议。欢迎 PR 继续完善 patch 的运行时验证。

#AIAgent #OpenSource #ConwayAutomaton
```

---

## 套 2: 即刻 / 朋友圈（诚实版）

```
🔧 做了一件"笨"但有用的事：

花 2 小时读了 Conway Automaton 的完整源码（67,096 行），
不是为了运行它，是为了理解它。

产出：
✅ 完整架构分析（22 个模块、34 个工具）
✅ 经济模型验证（启动 $5，无内置收入，x402 client-only）
✅ 4 行 patch 绕过 SIWE（编译通过，运行时待完善）
✅ 全部开源

这不算一个"产品"，
算一个**研究笔记**。

如果你也在研究 AI Agent Runtime，
这个分析能帮你省 2 小时读源码的时间。

🔗 github.com/frechd/automaton-zero-cost-guide

欢迎 PR 一起完善！
```

---

## 套 3: GitHub Discussion / 技术社区

```
## Conway Automaton v0.2.1 源码级分析 — 67k 行完整阅读

### 做了什么
我花了 2 小时通读了 Conway Automaton 的完整 TypeScript 源码（186 个文件，67,096 行），产出了一份架构分析文档。

### 不是产品，是研究
- ❌ 不是"一键启动脚本"（patch 编译通过但运行时未完整验证）
- ✅ 是"源码地图"——帮你理解 Automaton 的每个模块做什么

### 核心发现
1. **本地模式已存在**：`client.ts` 有 `isLocal = !sandboxId`，exec/read/write 自动回退本地
2. **唯一阻碍是 API Key 检查**：`index.ts` 第 200 行 `if (!apiKey) { process.exit(1) }`
3. **4 行 patch 可绕过**：编译通过，但 setup wizard 仍需要处理
4. **经济模型**：$5 启动，无内置收入，critical tier 时仍能用 Ollama 运行
5. **34 个工具完整映射**：每个工具的参数、风险等级、execute 实现

### 仓库内容
- `docs/ARCHITECTURE_ANALYSIS.md` — 完整架构图
- `patches/0001-zero-cost-skip-api.patch` — 4 行修改
- `SKILL.md` — Hermes Skill 定义（可被 Hermes Agent 加载）

### 欢迎贡献
- [ ] 解决 setup wizard 自动跳过
- [ ] 验证 `node dist/index.js --run` 端到端运行
- [ ] 添加 Docker 一键启动

🔗 github.com/frechd/automaton-zero-cost-guide
```

---

## 发布建议

| 平台 | 用哪套 | 原因 |
|------|--------|------|
| Twitter/X | 套 1 | Thread 格式适合技术社区传播 |
| 即刻 | 套 2 | 中文社区，轻松但诚实的口吻 |
| GitHub Discussion | 套 3 | 技术社区，详细发现 |
| 朋友圈 | 套 2 精简版 | 朋友间传播 |

## 发布时间
建议 **今晚 8-10 点** 或 **明天上午 10 点** 发布，流量较好。

---

*文案基于真实完成的工作编写*
*仓库: github.com/frechd/automaton-zero-cost-guide*
