# GitHub Actions Demo

这是一个用于测试和学习 **GitHub Actions** 的示例仓库。

## 📁 项目结构

```text
github-actions-demo/
├── .github/
│   ├── scripts/
│   │   └── send-dingtalk.js # 原生 Node.js 钉钉通知脚本 (支持安全加签、零 warning)
│   └── workflows/
│       └── demo.yml         # GitHub Actions 工作流配置文件
├── msg.md                   # 钉钉通知 Markdown 消息模板
├── index.js                 # 核心代码示例
├── index.test.js            # 测试脚本
└── package.json             # Node.js 项目配置与脚本
```

---

## 📌 `msg.md` 模板可用的环境变量列表

在 `msg.md` 模板文件中，你可以直接使用格式如 `${VAR_NAME}` 的环境变量。脚本会自动解析并替换：

### 1. 常用自定义与扩展变量
| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `${JOB_STATUS}` | 当前作业构建状态 | `✅ 成功` 或 `❌ 失败` |
| `${SHORT_SHA}` | 7位的短 Commit Hash | `3bd3210` |
| `${COMMIT_MSG}` | 当前提交的核心 Commit Message | `refactor: use msg.md` |

### 2. GitHub 官方默认环境变量 (内置可用)
| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `${GITHUB_REPOSITORY}` | 仓库名称 (owner/repo) | `netbuffer/github-actions-demo` |
| `${GITHUB_REF_NAME}` | 触发分支或 Tag 名称 | `main` |
| `${GITHUB_REF_TYPE}` | 触发类型 (branch / tag) | `branch` |
| `${GITHUB_EVENT_NAME}` | 触发的事件名称 | `push`, `pull_request`, `workflow_dispatch` |
| `${GITHUB_ACTOR}` | 触发流水线的用户名 | `netbuffer` |
| `${GITHUB_WORKFLOW}` | 工作流 Workflow 名称 | `GitHub Actions Demo` |
| `${GITHUB_RUN_ID}` | 当前工作流运行实例的唯一 ID | `1689201` |
| `${GITHUB_RUN_NUMBER}` | 该工作流累计运行次数 | `4` |
| `${GITHUB_SHA}` | 完整 Commit Hash | `3bd3210a4b...` |
