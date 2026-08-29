const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const path = require('path');

function sendDingTalk() {
  const webhook = process.env.DINGTALK_WEBHOOK;
  const secret = process.env.DINGTALK_SECRET;

  if (!webhook) {
    console.log('⚠️ DINGTALK_WEBHOOK 未配置，跳过钉钉通知发送。');
    return;
  }

  // 读取消息模版
  const templatePath = path.join(__dirname, '../../msg.txt');
  let content = fs.readFileSync(templatePath, 'utf8');

  // 环境变量替换模版占位符
  const status = process.env.JOB_STATUS === 'success' ? '✅ 成功' : '❌ 失败';
  content = content
    .replace('${REPO}', process.env.GITHUB_REPOSITORY || '')
    .replace('${BRANCH}', process.env.GITHUB_REF_NAME || '')
    .replace('${ACTOR}', process.env.GITHUB_ACTOR || '')
    .replace('${STATUS}', status)
    .replace('${SHA}', (process.env.GITHUB_SHA || '').substring(0, 7))
    .replace('${COMMIT_MSG}', process.env.COMMIT_MSG || '');

  let targetUrl = webhook;

  // 钉钉加签处理
  if (secret) {
    const timestamp = Date.now();
    const stringToSign = `${timestamp}\n${secret}`;
    const sign = crypto
      .createHmac('sha256', secret)
      .update(stringToSign)
      .digest('base64');
    
    const urlObj = new URL(webhook);
    urlObj.searchParams.append('timestamp', timestamp.toString());
    urlObj.searchParams.append('sign', sign);
    targetUrl = urlObj.toString();
  }

  const payload = JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      title: 'GitHub Actions 构建通知',
      text: content
    }
  });

  const url = new URL(targetUrl);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('✅ 钉钉通知发送结果:', data);
    });
  });

  req.on('error', (e) => {
    console.error('❌ 发送钉钉通知异常:', e.message);
  });

  req.write(payload);
  req.end();
}

sendDingTalk();
