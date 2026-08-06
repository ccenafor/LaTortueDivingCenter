const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const terser = require('terser');
const { generateBlogPages } = require('./generate-blog-pages');
const { generateSearchIndex } = require('./generate-search-index');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'scripts']);
const PUBLIC_DIRS = [
  'assets',
  'blog',
  'fr'
];
const PUBLIC_ROOT_FILES = [
  '_redirects',
  '404.html',
  'about.html',
  'blog-post.html',
  'blog.html',
  'contact-success.html',
  'contact.html',
  'cottages.html',
  'dining.html',
  'diving-apo-trips.html',
  'diving-fun-dives.html',
  'diving-sites.html',
  'diving.html',
  'footer.html',
  'google04b9e33a2260c6ff.html',
  'index.html',
  'menu.html',
  'new_styles.css',
  'robots.txt',
  'search.html',
  'sitemap.xml'
];

const isMinified = (file) => file.endsWith('.min.js') || file.endsWith('.min.css');

const copyRecursive = async (srcDir, destDir) => {
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
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

const copyPublicSite = async () => {
  await fs.promises.mkdir(dist, { recursive: true });

  for (const directory of PUBLIC_DIRS) {
    const source = path.join(root, directory);
    if (!fs.existsSync(source)) {
      throw new Error(`Required public directory is missing: ${directory}`);
    }
    await copyRecursive(source, path.join(dist, directory));
  }

  for (const file of PUBLIC_ROOT_FILES) {
    const source = path.join(root, file);
    if (!fs.existsSync(source)) {
      throw new Error(`Required public file is missing: ${file}`);
    }
    await fs.promises.copyFile(source, path.join(dist, file));
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
  generateBlogPages();
  generateSearchIndex();
  await fs.promises.rm(dist, { recursive: true, force: true });
  await copyPublicSite();
  await minifyAssets(dist);
  console.log('Build complete: dist/');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
