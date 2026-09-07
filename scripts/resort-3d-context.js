// The owner preview is deliberately absent from production and unrelated branches.
function includeResort3d(env = process.env) {
  return env.BRANCH === 'preprod' && env.CONTEXT !== 'production';
}

module.exports = { includeResort3d };
