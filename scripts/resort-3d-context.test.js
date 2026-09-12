const assert = require('node:assert/strict');
const { includeResort3d, isResortProduction } = require('./resort-3d-context');

assert.equal(includeResort3d({ BRANCH: 'preprod', CONTEXT: 'branch-deploy' }), true);
assert.equal(includeResort3d({ BRANCH: 'preprod' }), true);
assert.equal(includeResort3d({ BRANCH: 'main', CONTEXT: 'production' }), true);
assert.equal(isResortProduction({ BRANCH: 'main', CONTEXT: 'production' }), true);
assert.equal(isResortProduction({ BRANCH: 'preprod', CONTEXT: 'branch-deploy' }), false);
for (const env of [
  {},
  { BRANCH: 'preprod', CONTEXT: 'production' },
  { BRANCH: 'main', CONTEXT: 'branch-deploy' },
  { BRANCH: 'feature/preview', CONTEXT: 'deploy-preview' },
]) assert.equal(includeResort3d(env), false);
console.log('PASS: resort enabled on preprod or an explicitly promoted main production build only.');
