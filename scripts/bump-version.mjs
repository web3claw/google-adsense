import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read current version from package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = pkg.version || '0.1.0';

// 2. Increment version using decimal (0-9) rule
let [major, minor, patch] = currentVersion.split('.').map(Number);
patch += 1;
if (patch > 9) {
  patch = 0;
  minor += 1;
  if (minor > 9) {
    minor = 0;
    major += 1;
  }
}
const nextVersion = `${major}.${minor}.${patch}`;

console.log(`\n🚀 [Version Bump] Auto-incrementing version: ${currentVersion} ➔ ${nextVersion}`);

// 3. Update package.json
pkg.version = nextVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

// 4. Update src-tauri/tauri.conf.json
const tauriConfPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');
if (fs.existsSync(tauriConfPath)) {
  const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
  tauriConf.version = nextVersion;
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n', 'utf8');
}

// 5. Update src-tauri/Cargo.toml
const cargoTomlPath = path.join(rootDir, 'src-tauri', 'Cargo.toml');
if (fs.existsSync(cargoTomlPath)) {
  let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
  cargoToml = cargoToml.replace(/^version\s*=\s*"[^"]+"/m, `version = "${nextVersion}"`);
  fs.writeFileSync(cargoTomlPath, cargoToml, 'utf8');
}

// 6. Stage the modified files into the current Git commit
try {
  execSync('git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log(`✅ [Version Bump] Successfully updated and staged files for v${nextVersion}\n`);
} catch (err) {
  console.warn('⚠️ [Version Bump] Could not stage files automatically:', err.message);
}
