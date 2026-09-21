import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import policy from './policy.cjs';

const sourceExtensions = new Set(['.ts', '.tsx']);

function entries(root, relativePath) {
  const directory = path.join(root, relativePath);
  return fs.existsSync(directory)
    ? fs.readdirSync(directory, { withFileTypes: true })
    : [];
}

function walk(root, relativePath = 'src') {
  const files = [];
  for (const entry of entries(root, relativePath)) {
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory()) files.push(...walk(root, child));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(child);
  }
  return files;
}

function checkStructure(root) {
  const violations = [];
  const report = (file, message) => violations.push(`${file}: ${message}`);
  const sourceRoot = path.join(root, 'src');

  if (!fs.existsSync(sourceRoot)) return ['src: missing source directory'];

  for (const entry of entries(root, 'src')) {
    const allowed = entry.isDirectory()
      ? policy.rootDirectories
      : policy.rootFiles;
    if (!allowed.includes(entry.name))
      report(`src/${entry.name}`, 'unexpected source entry');
  }

  for (const feature of entries(root, 'src/features')) {
    const base = `src/features/${feature.name}`;
    if (!feature.isDirectory() || !policy.featureName.test(feature.name)) {
      report(base, 'features must be kebab-case directories');
      continue;
    }

    const featureEntries = entries(root, base);
    for (const entry of featureEntries) {
      if (
        !entry.isDirectory() ||
        !policy.featureDirectories.includes(entry.name)
      )
        report(`${base}/${entry.name}`, 'use internal/, public/ or use-cases/');
    }

    const publicPath = `${base}/public`;
    if (!fs.existsSync(path.join(root, publicPath, 'index.ts')))
      report(publicPath, 'missing explicit index.ts public contract');
    for (const entry of entries(root, publicPath)) {
      if (entry.name !== 'index.ts')
        report(
          `${publicPath}/${entry.name}`,
          'public may contain only index.ts',
        );
    }

    for (const directory of ['internal']) {
      for (const entry of entries(root, `${base}/${directory}`)) {
        if (
          !entry.isDirectory() ||
          !policy.localDirectories.includes(entry.name)
        )
          report(
            `${base}/${directory}/${entry.name}`,
            'use a scoped components/hooks/utils/schemas/mappers/fixtures directory',
          );
      }
    }

    for (const flow of entries(root, `${base}/use-cases`)) {
      const flowPath = `${base}/use-cases/${flow.name}`;
      if (!flow.isDirectory() || !policy.featureName.test(flow.name)) {
        report(flowPath, 'use-case folders must be kebab-case directories');
        continue;
      }
      if (!fs.existsSync(path.join(root, flowPath, 'Page.tsx')))
        report(flowPath, 'missing Page.tsx entry');
    }
  }

  for (const file of walk(root)) {
    const absolutePath = path.join(root, file);
    const normalizedFile = file.split(path.sep).join('/');
    const source = fs.readFileSync(absolutePath, 'utf8');
    if (
      !normalizedFile.startsWith('src/core/http/') &&
      /\bfetch\s*\(/.test(source)
    )
      report(normalizedFile, 'fetch may only be used by src/core/http');
    if (/['"`](student|professor|staff)['"`]/.test(source))
      report(normalizedFile, 'contains a role outside the radio contract');

    if (normalizedFile.startsWith('src/app/')) {
      for (const match of source.matchAll(/['"](@features\/[^'"]+)['"]/g)) {
        const importedPath = match[1];
        if (!importedPath.endsWith('/public'))
          report(
            normalizedFile,
            `app imports a feature outside its public contract: ${importedPath}`,
          );
      }
    }

    if (normalizedFile.startsWith('src/features/')) {
      for (const match of source.matchAll(
        /['"](@features\/([^/]+)\/[^'"]+)['"]/g,
      )) {
        const importedPath = match[1];
        const importedFeature = match[2];
        const currentFeature = normalizedFile.split('/')[2];
        if (
          importedFeature !== currentFeature &&
          !importedPath.endsWith('/public')
        )
          report(
            normalizedFile,
            `cross-feature import must use public contract: ${importedPath}`,
          );
      }
    }
  }

  function checkEmptyDirectories(relativePath) {
    for (const entry of entries(root, relativePath)) {
      const child = path.join(relativePath, entry.name);
      if (entry.isDirectory()) {
        if (entries(root, child).length === 0)
          report(child, 'empty directories are not allowed');
        else checkEmptyDirectories(child);
      }
    }
  }
  checkEmptyDirectories('src');

  return violations;
}

export { checkStructure };

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const violations = checkStructure(process.cwd());
  if (violations.length > 0) {
    console.error(violations.join('\n'));
    process.exitCode = 1;
  } else console.log('Architecture structure: OK');
}
