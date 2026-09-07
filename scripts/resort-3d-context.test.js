const assert = require('node:assert/strict');
const { includeResort3d } = require('./resort-3d-context');

assert.equal(includeResort3d({ BRANCH: 'preprod', CONTEXT: 'branch-deploy' }), true);
assert.equal(includeResort3d({ BRANCH: 'preprod' }), true);
for (const env of [
  {},
  { BRANCH: 'main', CONTEXT: 'production' },
  { BRANCH: 'preprod', CONTEXT: 'production' },
  { BRANCH: 'main', CONTEXT: 'branch-deploy' },
  { BRANCH: 'feature/preview', CONTEXT: 'deploy-preview' },
]) assert.equal(includeResort3d(env), false);
console.log('PASS: Resort 3D is available only on preprod, never in production.');
