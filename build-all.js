#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir).filter(f => f.startsWith('cognitive-system-'));

console.log(`Building ${packages.length} cognitive systems...\n`);

let succeeded = 0;
let failed = 0;
const failedPackages = [];

for (const pkg of packages.sort()) {
  const pkgPath = path.join(packagesDir, pkg);
  process.stdout.write(`[${succeeded + failed + 1}/${packages.length}] Building ${pkg}... `);
  
  try {
    execSync('npm run build', { cwd: pkgPath, stdio: 'pipe' });
    console.log('✓');
    succeeded++;
  } catch (error) {
    console.log('✗');
    failed++;
    failedPackages.push(pkg);
  }
}

console.log(`\n✓ Succeeded: ${succeeded}/${packages.length}`);
if (failed > 0) {
  console.log(`✗ Failed: ${failed}`);
  console.log(`Failed packages: ${failedPackages.join(', ')}`);
  process.exit(1);
}
