// Production becomes eligible only when this code is explicitly promoted to main.
function includeResort3d(env = process.env) {
  return (env.BRANCH === 'preprod' && env.CONTEXT !== 'production') || isResortProduction(env);
}
function isResortProduction(env = process.env) {
  return env.BRANCH === 'main' && env.CONTEXT === 'production';
}

module.exports = { includeResort3d, isResortProduction };
