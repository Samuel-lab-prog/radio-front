import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'bun:test';
import { checkStructure } from './check-structure.mjs';

describe('frontend architecture structure', () => {
  it('accepts the current source tree', () => {
    expect(checkStructure(process.cwd())).toEqual([]);
  });

  it('reports a feature file outside its allowed boundaries', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'radio-frontend-'));
    try {
      fs.mkdirSync(path.join(root, 'src/features/news/public'), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(root, 'src/features/news/public/index.ts'),
        '',
      );
      fs.writeFileSync(path.join(root, 'src/features/news/invalid.ts'), '');
      expect(checkStructure(root)).toContain(
        'src/features/news/invalid.ts: use internal/, public/ or use-cases/',
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
