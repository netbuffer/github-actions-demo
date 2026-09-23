const fs = require('fs');
const path = require('path');

// HTML 转义，防止环境变量中的特殊字符破坏页面结构
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generatePages() {
  // 基础仓库信息 (本地预览时提供默认值)
  const repo = process.env.GITHUB_REPOSITORY || 'netbuffer/github-actions-demo';
  const repoOwner = (repo.split('/')[0] || 'netbuffer').trim();
  const repoName = (repo.split('/')[1] || 'github-actions-demo').trim();
  const releaseTag = (process.env.RELEASE_TAG || 'dev').trim();
  const sha = process.env.GITHUB_SHA || '';

  // 映射环境变量与自定义变量 (展示类变量统一 HTML 转义)
  const variables = {
    // GitHub 官方内置环境变量 (转义处理)
    ...Object.fromEntries(
      Object.entries(process.env).map(([key, value]) => [key, escapeHtml(value)])
    ),
    // 自定义扩展变量 (未配置时提供本地预览默认值)
    RELEASE_TAG: escapeHtml(releaseTag),
    RELEASE_TITLE: escapeHtml(`${repoName} ${releaseTag}`),
    RELEASE_TIME: `${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`,
    REPO_OWNER: escapeHtml(repoOwner),
    REPO_NAME: escapeHtml(repoName),
    SHORT_SHA: sha.substring(0, 7),
    NODE_VERSION: process.version,
    GITHUB_REPOSITORY: escapeHtml(repo),
    GITHUB_ACTOR: escapeHtml(process.env.GITHUB_ACTOR || 'local-preview'),
    GITHUB_EVENT_NAME: escapeHtml(process.env.GITHUB_EVENT_NAME || 'workflow_dispatch'),
    GITHUB_REF_NAME: escapeHtml(process.env.GITHUB_REF_NAME || 'main'),
    GITHUB_WORKFLOW: escapeHtml(process.env.GITHUB_WORKFLOW || 'Release & Deploy Pages'),
    GITHUB_RUN_NUMBER: process.env.GITHUB_RUN_NUMBER || '0',
    REPO_URL: `https://github.com/${repo}`,
    RELEASE_URL: `https://github.com/${repo}/releases/tag/${encodeURIComponent(releaseTag)}`,
    RUN_URL: `https://github.com/${repo}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`
  };

  // 读取 .github/template/pages.html 页面模版
  const templatePath = path.join(__dirname, '../template/pages.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // 支持在 pages.html 中使用任意 ${VAR_NAME} 形式的环境变量 (与 notify.md 模板机制保持一致)
  html = html.replace(/\$\{([A-Z0-9_]+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });

  // 输出到 dist/ 目录 (GitHub Pages 部署产物目录)
  const distDir = path.join(process.cwd(), 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  const outFile = path.join(distDir, 'index.html');
  fs.writeFileSync(outFile, html);

  console.log('✅ GitHub Pages 静态页面已生成');
  console.log(`   📦 Release 版本 : ${releaseTag}`);
  console.log(`   📄 页面文件     : ${outFile}`);
  console.log(`   📊 页面大小     : ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

generatePages();
