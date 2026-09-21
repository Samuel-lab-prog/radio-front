import fs from 'node:fs';
import path from 'node:path';

function countSourceFiles(directory) {
  let files = 0;
  let lines = 0;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const result = countSourceFiles(file);
      files += result.files;
      lines += result.lines;
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files += 1;
      lines += fs.readFileSync(file, 'utf8').split(/\r?\n/).length;
    }
  }
  return { files, lines };
}

const featuresRoot = path.join(process.cwd(), 'src/features');
console.log('FRONTEND ARCHITECTURE METRICS');
console.log('FEATURE                 | FILES | LOC');
console.log('------------------------|-------|-----');
for (const entry of fs.readdirSync(featuresRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const result = countSourceFiles(path.join(featuresRoot, entry.name));
  console.log(
    `${entry.name.padEnd(24)}| ${String(result.files).padStart(5)} | ${result.lines}`,
  );
}
