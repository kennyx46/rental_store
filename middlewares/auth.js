module.exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send();
};

module.exports.ensureHasToken = function (req, res, next) {
  if (!req.query.accessToken) {
    return res.status(401).send();
  }
  return next();
}