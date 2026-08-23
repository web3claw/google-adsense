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
const targetExeName = `${exePrefix}-${version}.exe`;

console.log(`\n📦 [Build Post-Process] Branch: [${currentBranch}] ➔ Target File: [${targetExeName}]`);

const targetDir = path.join(rootDir, 'src-tauri', 'target');

function findAndRenameExes(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Don't recurse into .fingerprint, incremental, build, deps, etc.
      if (['.fingerprint', 'incremental', 'build', 'deps', 'examples'].includes(entry.name)) {
        continue;
      }
      findAndRenameExes(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.exe')) {
      if (entry.name !== targetExeName) {
        const destPath = path.join(dir, targetExeName);
        try {
          fs.renameSync(fullPath, destPath);
          console.log(`✨ Renamed: ${fullPath} ➔ ${destPath}`);
        } catch (err) {
          console.warn(`⚠️ Failed to rename ${fullPath}:`, err.message);
        }
      }
    }
  }
}

findAndRenameExes(targetDir);
console.log(`✅ [Build Post-Process] Finished binary renaming for ${targetExeName}\n`);
