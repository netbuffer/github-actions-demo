const fs = require('fs');
const path = require('path');

function generateReleaseNotes() {
  // 基础仓库信息 (本地预览时提供默认值)
  const repo = process.env.GITHUB_REPOSITORY || 'netbuffer/github-actions-demo';
  const repoName = (repo.split('/')[1] || 'github-actions-demo').trim();
  const releaseTag = (process.env.RELEASE_TAG || 'dev').trim();
  const sha = process.env.GITHUB_SHA || '';

  // 变更说明内容: 优先使用手动触发时输入的 notes (Markdown 原文注入)，
  // 未提供时回退到提交记录链接，保证 Release Notes 始终有内容
  const inputNotes = (process.env.RELEASE_NOTES_INPUT || '').trim();
  const releaseChanges = inputNotes ||
    `*本次发布未提供详细变更说明，请查看 [提交历史](https://github.com/${repo}/commits/${encodeURIComponent(releaseTag)})。*`;

  // 映射环境变量与自定义变量 (与 notify.md / pages.html 模板机制保持一致)
  const variables = {
    ...process.env,
    RELEASE_TAG: releaseTag,
    RELEASE_TITLE: `${repoName} ${releaseTag}`,
    RELEASE_TIME: `${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`,
    REPO_NAME: repoName,
    SHORT_SHA: sha.substring(0, 7),
    NODE_VERSION: process.version,
    GITHUB_REPOSITORY: repo,
    GITHUB_ACTOR: process.env.GITHUB_ACTOR || 'local-preview',
    GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME || 'workflow_dispatch',
    GITHUB_REF_NAME: process.env.GITHUB_REF_NAME || 'main',
    GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW || 'Release & Deploy Pages',
    GITHUB_RUN_NUMBER: process.env.GITHUB_RUN_NUMBER || '0',
    RELEASE_CHANGES: releaseChanges,
    REPO_URL: `https://github.com/${repo}`,
    RELEASE_URL: `https://github.com/${repo}/releases/tag/${encodeURIComponent(releaseTag)}`,
    RUN_URL: `https://github.com/${repo}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`
  };

  // 读取 .github/template/release-notes.md 模版
  const templatePath = path.join(__dirname, '../template/release-notes.md');
  let markdown = fs.readFileSync(templatePath, 'utf8');

  // 支持在 release-notes.md 中使用任意 ${VAR_NAME} 形式的环境变量
  markdown = markdown.replace(/\$\{([A-Z0-9_]+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });

  // 输出到 dist/ 目录 (与 Pages 产物同目录，随 Release 一并发布)
  const distDir = path.join(process.cwd(), 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  const outFile = path.join(distDir, 'release-notes.md');
  fs.writeFileSync(outFile, markdown);

  console.log('✅ Release Notes 已生成');
  console.log(`   📦 Release 版本 : ${releaseTag}`);
  console.log(`   📄 笔记文件     : ${outFile}`);
  console.log(`   📊 内容大小     : ${(Buffer.byteLength(markdown) / 1024).toFixed(1)} KB`);
  console.log('');
  console.log('---------- Release Notes 预览 ----------');
  console.log(markdown);
}

generateReleaseNotes();
