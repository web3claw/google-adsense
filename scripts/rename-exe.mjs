import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read current version
const packageJsonPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = pkg.version || '0.1.0';

// 2. Detect current Git branch
let currentBranch = 'main';
try {
  currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
} catch (e) {
  // fallback to main
}

const isAdManager = currentBranch === 'ad-manager' || currentBranch.includes('admanager');
const exePrefix = isAdManager ? 'admanager' : 'adsense';
const targetName = `${exePrefix}-${version}.exe`;

const releaseDir = path.join(rootDir, 'src-tauri', 'target', 'release');
const nsisDir = path.join(releaseDir, 'bundle', 'nsis');

console.log(`\n📦 [Build Post-Process] Branch: [${currentBranch}] ➔ Target Name: [${targetName}]`);

// 1. Rename standalone release EXE if present
const possibleExeNames = ['google-adsense.exe', 'google-ad-manager.exe', 'adsense.exe', 'admanager.exe', 'google_adsense.exe', 'google_adsense_lib.exe'];

for (const name of possibleExeNames) {
  const standardExe = path.join(releaseDir, name);
  const targetExe = path.join(releaseDir, targetName);

  if (fs.existsSync(standardExe)) {
    fs.renameSync(standardExe, targetExe);
    console.log(`✨ Renamed: ${standardExe} ➔ ${targetExe}`);
    break;
  }
}

// 2. Rename NSIS bundle EXE if present
if (fs.existsSync(nsisDir)) {
  const files = fs.readdirSync(nsisDir);
  for (const file of files) {
    if (file.endsWith('.exe') && !file.startsWith(targetName)) {
      const oldPath = path.join(nsisDir, file);
      const newPath = path.join(nsisDir, targetName);
      fs.renameSync(oldPath, newPath);
      console.log(`✨ Renamed bundle installer: ${oldPath} ➔ ${newPath}`);
    }
  }
}

console.log(`✅ [Build Post-Process] Finished binary renaming for ${targetName}\n`);
