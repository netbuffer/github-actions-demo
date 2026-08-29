### 🚀 GitHub Actions 自动化构建通知

- **项目名称**: [${GITHUB_REPOSITORY}](https://github.com/${GITHUB_REPOSITORY})
- **触发分支**: `${GITHUB_REF_NAME}` (`${GITHUB_REF_TYPE}`)
- **触发事件**: `${GITHUB_EVENT_NAME}`
- **触发用户**: `${GITHUB_ACTOR}`
- **构建状态**: `${JOB_STATUS}`
- **提交 SHA**: `${SHORT_SHA}`
- **提交信息**: `${COMMIT_MSG}`
- **工作流名称**: `${GITHUB_WORKFLOW}`
- **Run ID**: [${GITHUB_RUN_ID}](https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID})

---
#### 🖥️ Runner 环境与硬件信息
- 🐧 **操作系统**: `${RUNNER_OS_PRETTY}`
- ⚡ **CPU 配置**: `${RUNNER_CPU_MODEL}`
- 🧠 **内存空间**: `${RUNNER_MEM}`
- 💽 **磁盘容量**: `${RUNNER_DISK}`
- 🌍 **公网出口 IP**: `${RUNNER_PUBLIC_IP}`

#### 🛠️ 预装工具链版本
- 🟢 **Node.js**: `${TOOL_NODE_VER}`
- ☕ **Java**: `${TOOL_JAVA_VER}`
- 📦 **Maven**: `${TOOL_MAVEN_VER}`
- 🐍 **Python**: `${TOOL_PYTHON_VER}`
- 🐳 **Docker**: `${TOOL_DOCKER_VER}`
- 🔀 **Git**: `${TOOL_GIT_VER}`

#### 📁 磁盘 59G 空间占用占比实测 (Top Directories)
```text
${DISK_BREAKDOWN}
```


