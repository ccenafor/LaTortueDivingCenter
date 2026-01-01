const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const terser = require('terser');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'scripts']);
const SKIP_FILES = new Set([
  '.DS_Store',
  '.gitattributes',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'README.md'
]);

const isMinified = (file) => file.endsWith('.min.js') || file.endsWith('.min.css');

const copyRecursive = async (srcDir, destDir) => {
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_FILES.has(entry.name)) continue;

    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await copyRecursive(srcPath, destPath);
      continue;
    }

    if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
};

const minifyCss = async (filePath) => {
  const css = await fs.promises.readFile(filePath, 'utf8');
  const result = await postcss([cssnano({ preset: 'default' })]).process(css, {
    from: filePath,
    to: filePath
  });
  await fs.promises.writeFile(filePath, result.css, 'utf8');
};

const minifyJs = async (filePath) => {
  const js = await fs.promises.readFile(filePath, 'utf8');
  const result = await terser.minify(js);
  if (result.error) throw result.error;
  await fs.promises.writeFile(filePath, result.code, 'utf8');
};

const minifyAssets = async (dir) => {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await minifyAssets(fullPath);
      continue;
    }

    if (!entry.isFile() || isMinified(fullPath)) continue;
    const ext = path.extname(entry.name).toLowerCase();

    if (ext === '.css') {
      await minifyCss(fullPath);
    } else if (ext === '.js') {
      await minifyJs(fullPath);
    }
  }
};

const main = async () => {
  await fs.promises.rm(dist, { recursive: true, force: true });
  await copyRecursive(root, dist);
  await minifyAssets(dist);
  console.log('Build complete: dist/');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
