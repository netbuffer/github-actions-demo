# GitHub Actions Demo

这是一个用于测试和学习 **GitHub Actions** 的示例仓库。

## 📁 项目结构

```text
github-actions-demo/
├── .github/
│   └── workflows/
│       └── demo.yml      # GitHub Actions 工作流配置文件
├── index.js              # 核心代码示例
├── index.test.js         # 测试脚本
└── package.json          # Node.js 项目配置与脚本
```

## 🚀 如何在 GitHub 上触发运行

1. **推送代码（Push）**：
   将代码推送到 `main` 或 `master` 分支，Workflow 会自动触发。
2. **提交 Pull Request**：
   向 `main` 或 `master` 分支发起 PR，同样会自动运行测试。
3. **手动触发（Manual Trigger）**：
   在 GitHub 仓库页面点击 **Actions** 页签 -> 选择 **GitHub Actions Demo** 工作流 -> 点击 **Run workflow** 手动触发。
