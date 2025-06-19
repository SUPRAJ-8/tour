// Center-of-app async wrapper to avoid repetitive try/catch.
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
