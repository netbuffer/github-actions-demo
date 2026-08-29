const { execSync } = require('child_process');
const os = require('os');
const https = require('https');

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', timeout: 10000 }).trim();
  } catch (e) {
    return 'N/A';
  }
}

function getPublicIp() {
  return new Promise((resolve) => {
    const req = https.get('https://api.ipify.org', { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data.trim() || 'N/A'));
    });
    req.on('error', () => resolve('N/A'));
    req.end();
  });
}

async function main() {
  const osPretty = runCmd('cat /etc/os-release | grep PRETTY_NAME | cut -d\'"\' -f2');
  const kernelVer = os.release() || runCmd('uname -sr');
  const hostnameVal = os.hostname() || runCmd('hostname');
  const uptimeVal = runCmd('uptime -p');

  const cpuModel = runCmd("lscpu | grep 'Model name' | sed 's/Model name:\\s*//'") || os.cpus()[0]?.model || 'CPU';
  const cpuCores = os.cpus().length;
  const cpuMhz = runCmd("lscpu | grep 'CPU max MHz' | awk '{print $4}'");

  const memSummary = runCmd("free -h | awk '/Mem:/ {print \"总量: \"$2\" | 已用: \"$3\" | 空闲: \"$4\" | 可用: \"$7}'");
  const swapSummary = runCmd("free -h | awk '/Swap:/ {print \"总量: \"$2\" | 已用: \"$3\" | 空闲: \"$4}'");
  const diskRoot = runCmd("df -h / | awk 'NR==2 {print \"总量: \"$2\" | 已用: \"$3\" (\"$5\") | 剩余: \"$4}'");

  const publicIp = await getPublicIp();
  const localIp = runCmd("hostname -I | awk '{print $1}'");

  const javaVer = runCmd('java -version 2>&1 | head -n 1');
  const mvnVer = runCmd('mvn -version 2>&1 | head -n 1');
  const nodeVer = process.version;
  const pythonVer = runCmd('python3 --version');
  const dockerVer = runCmd('docker --version');
  const gitVer = runCmd('git --version');

  console.log('=======================================================');
  console.log('         🔍 GITHUB ACTIONS RUNNER ENVIRONMENT INFO     ');
  console.log('=======================================================');
  console.log(`💻 OS / Kernel : ${osPretty} / ${kernelVer}`);
  console.log(`🏠 Hostname    : ${hostnameVal}`);
  console.log(`⚡ CPU / Cores : ${cpuModel} (${cpuCores} Cores)`);
  console.log(`🧠 Memory      : ${memSummary}`);
  console.log(`💾 Swap        : ${swapSummary}`);
  console.log(`💽 Disk (/)    : ${diskRoot}`);
  console.log(`⏱️ Uptime      : ${uptimeVal}`);
  console.log('-------------------------------------------------------');
  console.log(`🌍 Public IP   : ${publicIp}`);
  console.log(`🏠 Local IP    : ${localIp}`);
  console.log('-------------------------------------------------------');
  console.log(`🟢 Node.js     : ${nodeVer}`);
  console.log(`☕ Java        : ${javaVer}`);
  console.log(`📦 Maven       : ${mvnVer}`);
  console.log(`🐍 Python      : ${pythonVer}`);
  console.log(`🐳 Docker      : ${dockerVer}`);
  console.log(`🔀 Git         : ${gitVer}`);
  console.log('-------------------------------------------------------');
  console.log('📁 磁盘空间大文件与目录分析 (Top Space Consumers):');
  const topDirs = runCmd("sudo du -h -d 2 / 2>/dev/null | sort -rh | head -n 20");
  console.log(topDirs || 'N/A');
  console.log('=======================================================');

  // 获取预装 Docker 镜像分析
  const dockerImages = runCmd("docker images --format '{{.Repository}}:{{.Tag}} ({{.Size}})' | head -n 10");
  
  // 获取关键目录的大文件占用清单
  const diskDetail = runCmd("sudo du -h -d 2 /usr /usr/local /opt /var/lib 2>/dev/null | sort -rh | head -n 12");

  // 将收集到的环境变量写入 GitHub Actions 环境变量传给后续步骤
  if (process.env.GITHUB_ENV) {
    const envData = [
      `RUNNER_OS_PRETTY=${osPretty}`,
      `RUNNER_KERNEL=${kernelVer}`,
      `RUNNER_CPU_MODEL=${cpuModel} (${cpuCores} Cores)`,
      `RUNNER_MEM=${memSummary}`,
      `RUNNER_DISK=${diskRoot}`,
      `RUNNER_PUBLIC_IP=${publicIp}`,
      `RUNNER_LOCAL_IP=${localIp}`,
      `TOOL_NODE_VER=${nodeVer}`,
      `TOOL_JAVA_VER=${javaVer}`,
      `TOOL_MAVEN_VER=${mvnVer}`,
      `TOOL_PYTHON_VER=${pythonVer}`,
      `TOOL_DOCKER_VER=${dockerVer}`,
      `TOOL_GIT_VER=${gitVer}`,
      `DOCKER_PRECACHED_IMAGES=${dockerImages.replace(/\n/g, ' \\n ')}`,
      `DISK_BREAKDOWN=${diskDetail.replace(/\n/g, ' \\n ')}`
    ].join('\n');
    
    require('fs').appendFileSync(process.env.GITHUB_ENV, envData + '\n');
  }
}

main();
