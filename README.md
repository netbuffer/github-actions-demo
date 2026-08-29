# GitHub Actions Demo

这是一个用于测试和学习 **GitHub Actions** 的示例仓库。

## 📁 项目结构

```text
github-actions-demo/
├── .github/
│   ├── scripts/
│   │   └── send-dingtalk.js # 原生 Node.js 钉钉通知脚本 (支持安全加签、零 warning)
│   ├── template/
│   │   └── notify.md        # 钉钉通知 Markdown 消息模板
│   └── workflows/
│       └── demo.yml         # GitHub Actions 工作流配置文件
├── index.js                 # 核心代码示例
├── index.test.js            # 测试脚本
└── package.json             # Node.js 项目配置与脚本
```

---

## 📌 `.github/template/notify.md` 模板可用的环境变量列表

在 `.github/template/notify.md` 模板文件中，你可以直接使用格式如 `${VAR_NAME}` 的环境变量。脚本会自动解析并替换：

### 1. 常用自定义与扩展变量
| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `${JOB_STATUS}` | 当前作业构建状态 | `✅ 成功` 或 `❌ 失败` |
| `${SHORT_SHA}` | 7位的短 Commit Hash | `3bd3210` |
| `${COMMIT_MSG}` | 当前提交的核心 Commit Message | `refactor: use msg.md` |

### 2. GitHub 官方默认环境变量 (内置可用)
> 官方完整变量列表参考文档: [GitHub Default environment variables](https://docs.github.com/en/actions/writing-workflows/choose-what-workflows-do/store-information-in-variables#default-environment-variables)

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

---

## 🌐 远程 API 触发指南 (`repository_dispatch`)

可通过 GitHub REST API 供外部系统 (如 Jenkins、自研 DevOps 平台、Postman 或 cURL) 远程远程发送 Webhook 触发此流水线。

> 官方参考文档: [repository_dispatch event](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#repository_dispatch)

### 示例 cURL 请求：
```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>" \
  https://api.github.com/repos/netbuffer/github-actions-demo/dispatches \
  -d '{
    "event_type": "webhook_trigger",
    "client_payload": {
      "env": "production",
      "message": "Custom Remote Trigger Event"
    }
  }'
```
