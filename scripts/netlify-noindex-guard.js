const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipDirs = new Set(['.git', 'node_modules', 'dist', 'scripts']);

const noindexMetaTag = '<meta name="robots" content="noindex, nofollow, noarchive">';
const noindexRobots = 'User-agent: *\nDisallow: /\n';
const noindexHeaderBlock = '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n';

const context = String(process.env.CONTEXT || '').toLowerCase();
const branch = String(process.env.BRANCH || '').toLowerCase();
const deployUrl = String(process.env.DEPLOY_PRIME_URL || process.env.URL || '').toLowerCase();
const isNetlify = process.env.NETLIFY === 'true';

const shouldNoindex =
  context !== 'production' ||
  branch === 'preprod' ||
  deployUrl.includes('preprod.latortuediving.com');

const walkHtmlFiles = (dir, found) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) return;
      walkHtmlFiles(fullPath, found);
      return;
    }

    if (entry.isFile() && fullPath.toLowerCase().endsWith('.html')) {
      found.push(fullPath);
    }
  });
};

const injectNoindexMeta = () => {
  const htmlFiles = [];
  walkHtmlFiles(root, htmlFiles);

  let updated = 0;

  htmlFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');

    if (
      /<meta\s+name=["']robots["'][^>]*>/i.test(content) ||
      /<meta\s+http-equiv=["']x-robots-tag["'][^>]*>/i.test(content)
    ) {
      return;
    }

    let next = content;
    if (/<meta\s+name=["']viewport["'][^>]*>\s*/i.test(content)) {
      next = content.replace(
        /(<meta\s+name=["']viewport["'][^>]*>\s*)/i,
        `$1${noindexMetaTag}\n`
      );
    } else if (/<head[^>]*>\s*/i.test(content)) {
      next = content.replace(/(<head[^>]*>\s*)/i, `$1${noindexMetaTag}\n`);
    }

    if (next !== content) {
      fs.writeFileSync(filePath, next, 'utf8');
      updated += 1;
    }
  });

  return updated;
};

const writeNoindexHeaders = () => {
  const headersPath = path.join(root, '_headers');
  const existing = fs.existsSync(headersPath) ? fs.readFileSync(headersPath, 'utf8') : '';

  if (/x-robots-tag/i.test(existing)) {
    return false;
  }

  const next = `${existing.trimEnd()}${existing.trimEnd() ? '\n\n' : ''}${noindexHeaderBlock}`;
  fs.writeFileSync(headersPath, `${next.trimEnd()}\n`, 'utf8');
  return true;
};

const writeNoindexRobots = () => {
  const robotsPath = path.join(root, 'robots.txt');
  fs.writeFileSync(robotsPath, noindexRobots, 'utf8');
};

const main = () => {
  if (!isNetlify) {
    console.log('Skipping noindex guard outside Netlify.');
    return;
  }

  if (!shouldNoindex) {
    console.log(`Indexing allowed for context="${context}" branch="${branch}".`);
    return;
  }

  writeNoindexRobots();
  const headersUpdated = writeNoindexHeaders();
  const htmlUpdated = injectNoindexMeta();

  console.log(
    `Applied noindex guard (context="${context}", branch="${branch}"): robots.txt updated, ` +
      `_headers ${headersUpdated ? 'updated' : 'already contained X-Robots-Tag'}, ` +
      `${htmlUpdated} HTML file(s) tagged.`
  );
};

main();
