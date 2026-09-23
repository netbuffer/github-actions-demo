# GitHub Actions Demo

这是一个用于测试和学习 **GitHub Actions** 的示例仓库。

https://github.com/netbuffer/github-actions-demo

## 📁 项目结构

```text
github-actions-demo/
├── .github/
│   ├── scripts/
│   │   ├── send-dingtalk.js        # 原生 Node.js 钉钉通知脚本 (支持安全加签、零 warning)
│   │   ├── generate-pages.js       # GitHub Pages 静态页面生成脚本 (零依赖)
│   │   └── generate-release-notes.js # Release Notes 生成脚本 (零依赖)
│   ├── template/
│   │   ├── notify.md               # 钉钉通知 Markdown 消息模板
│   │   ├── pages.html              # GitHub Pages 页面模板
│   │   └── release-notes.md        # GitHub Release Notes 模板
│   └── workflows/
│       ├── demo.yml           # CI 工作流: 测试 + 钉钉通知
│       └── release.yml        # 发版工作流: Release + GitHub Pages 自动部署
├── index.js                   # 核心代码示例
├── index.test.js              # 测试脚本
└── package.json               # Node.js 项目配置与脚本
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

## 🚀 Release & GitHub Pages 自动部署

`.github/workflows/release.yml` 实现了完整的发版链路: **发版 → 单元测试 (质量门禁) → 创建 GitHub Release (自动生成 Changelog) → 生成静态页面 → 自动部署 GitHub Pages**。

### 触发方式

| 触发方式 | 操作 | 说明 |
| :--- | :--- | :--- |
| 推送 Tag | `git tag v1.0.1 && git push origin v1.0.1` | 推送 `v` 开头的 Tag 自动发版 (推荐) |
| 手动发布 Release | 在仓库 Releases 页面点击 "Create a new release" | Release 发布后自动触发部署 |
| 手动触发工作流 | Actions 页面选择 "Release & Deploy Pages" → Run workflow | 可输入版本号与 Markdown 变更说明；版本号留空则使用 `package.json` 的版本号 |

> 💡 由 `GITHUB_TOKEN` 创建的 Release 不会再次触发本工作流 (GitHub 防递归触发机制)，因此 Tag 推送发版只会执行一次，不会重复部署。

### ⚠️ 首次使用前置配置

GitHub Pages 需切换为 Actions 部署模式 (仅需配置一次):

1. 进入仓库 **Settings → Pages**
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**

### 部署产物

- **Pages 页面**: https://netbuffer.github.io/github-actions-demo/
- **Release 页面**: 自动创建并附带变更日志，同时将 `index.html` 作为构建产物附件上传
- 页面内容: 发版信息 (版本/Commit/触发方式/发布人)、构建与测试信息、相关链接

### 📌 `.github/template/pages.html` 模板可用的环境变量列表

模板机制与 `notify.md` 一致，支持 `${VAR_NAME}` 形式的变量替换:

#### 1. 常用自定义与扩展变量
| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `${RELEASE_TAG}` | 本次发版的版本号 | `v1.0.0` |
| `${RELEASE_TITLE}` | 页面标题 (仓库名 + 版本号) | `github-actions-demo v1.0.0` |
| `${RELEASE_TIME}` | 发版时间 (UTC) | `2026-09-23 08:30:00 UTC` |
| `${REPO_NAME}` | 仓库名称 (不含 owner) | `github-actions-demo` |
| `${SHORT_SHA}` | 7位的短 Commit Hash | `3bd3210` |
| `${NODE_VERSION}` | 构建使用的 Node.js 版本 | `v24.19.0` |
| `${REPO_URL}` | 仓库完整地址 | `https://github.com/netbuffer/github-actions-demo` |
| `${RELEASE_URL}` | 本次 Release 详情地址 | `https://github.com/.../releases/tag/v1.0.0` |
| `${RUN_URL}` | 本次 Actions 运行记录地址 | `https://github.com/.../actions/runs/123456` |

#### 2. GitHub 官方默认环境变量 (内置可用)

同 `notify.md` 模板 (见上方变量表格)，如 `${GITHUB_ACTOR}`、`${GITHUB_EVENT_NAME}`、`${GITHUB_REF_NAME}`、`${GITHUB_SHA}`、`${GITHUB_RUN_NUMBER}` 等均可直接使用。

本地预览页面效果: `npm run build:pages` (产物输出至 `dist/index.html`，未配置的环境变量会以默认值展示)。

### 📌 `.github/template/release-notes.md` 模板可用的环境变量列表

模板机制与 `notify.md` / `pages.html` 一致，最终渲染为 GitHub Release 的 Notes (描述) 内容:

| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `${RELEASE_TAG}` | 本次发版的版本号 | `v1.0.0` |
| `${RELEASE_TITLE}` | 笔记标题 (仓库名 + 版本号) | `github-actions-demo v1.0.0` |
| `${RELEASE_TIME}` | 发版时间 (UTC) | `2026-09-23 08:30:00 UTC` |
| `${RELEASE_CHANGES}` | 变更说明内容 (来自手动触发时的 `notes` 输入，未输入时回退为提交历史链接) | `### 新增\n- 新功能 A` |
| `${REPO_NAME}` | 仓库名称 (不含 owner) | `github-actions-demo` |
| `${SHORT_SHA}` | 7位的短 Commit Hash | `3bd3210` |
| `${NODE_VERSION}` | 构建使用的 Node.js 版本 | `v24.19.0` |
| `${REPO_URL}` / `${RELEASE_URL}` / `${RUN_URL}` | 仓库 / Release / 构建记录地址 | - |

> 💡 手动触发工作流时，在 `notes` 输入框中直接编写 Markdown 变更说明 (支持多行)，即可渲染到 Release Notes 的「变更说明」章节；其余 GitHub 内置环境变量同样可用。

本地预览笔记效果: `npm run build:notes` (产物输出至 `dist/release-notes.md`)。

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
