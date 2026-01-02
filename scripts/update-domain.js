const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const DEFAULT_DOMAIN = 'https://www.latortuediving.com';
const KNOWN_DOMAINS = [
  'https://latortuedivingcenter.com',
  'http://latortuedivingcenter.com',
  'https://www.latortuedivingcenter.com',
  'http://www.latortuedivingcenter.com',
  'https://latortuediving.com',
  'http://latortuediving.com',
  'https://www.latortuediving.com',
  'http://www.latortuediving.com'
];

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'scripts']);
const TARGET_EXTENSIONS = new Set(['.html', '.xml', '.txt', '.js', '.css', '.md']);
const TARGET_FILES = new Set(['robots.txt', 'sitemap.xml']);

const printUsage = () => {
  console.log('Usage: node scripts/update-domain.js [--domain <url>] [--dry-run]');
  console.log(`Default domain: ${DEFAULT_DOMAIN}`);
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  let domain = DEFAULT_DOMAIN;
  let dryRun = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--domain') {
      const next = args[i + 1];
      if (!next) {
        throw new Error('Missing value for --domain');
      }
      domain = next;
      i += 1;
      continue;
    }
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }
  }

  domain = domain.replace(/\/+$/, '');
  if (!domain) {
    throw new Error('Domain cannot be empty.');
  }

  return { domain, dryRun };
};

const isTargetFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath);
  return TARGET_FILES.has(name) || TARGET_EXTENSIONS.has(ext);
};

const replaceDomains = (content, targets, domain) => {
  let updated = content;
  let replacements = 0;

  targets.forEach((target) => {
    const parts = updated.split(target);
    if (parts.length > 1) {
      replacements += parts.length - 1;
      updated = parts.join(domain);
    }
  });

  return { updated, replacements };
};

const walk = async (dir, handler) => {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(path.join(dir, entry.name), handler);
      continue;
    }

    if (entry.isFile()) {
      await handler(path.join(dir, entry.name));
    }
  }
};

const main = async () => {
  const { domain, dryRun } = parseArgs();
  const uniqueDomains = Array.from(new Set(KNOWN_DOMAINS.map((value) => value.replace(/\/+$/, ''))));
  const targets = uniqueDomains.filter((value) => value && value !== domain);

  let filesTouched = 0;
  let totalReplacements = 0;

  await walk(root, async (filePath) => {
    if (!isTargetFile(filePath)) return;
    const contents = await fs.promises.readFile(filePath, 'utf8');
    if (!targets.some((target) => contents.includes(target))) return;

    const { updated, replacements } = replaceDomains(contents, targets, domain);
    if (!replacements) return;

    if (!dryRun) {
      await fs.promises.writeFile(filePath, updated, 'utf8');
    }

    filesTouched += 1;
    totalReplacements += replacements;
    const label = dryRun ? 'Would update' : 'Updated';
    console.log(`${label}: ${path.relative(root, filePath)}`);
  });

  const summary = dryRun ? 'Would update' : 'Updated';
  console.log(`${summary} ${filesTouched} file(s) with ${totalReplacements} replacement(s).`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
