var express = require('express');
var router = express.Router();

var ensureAuthenticated = require('../middlewares/auth').ensureAuthenticated;
var ensureHasToken = require('../middlewares/auth').ensureHasToken;

var Language = require('../models/language');

/* GET languages listing. */
router.get('/', ensureAuthenticated, ensureHasToken, function(req, res, next) {
  Language.findAll().then(function (languages) {

    res.json(languages);
  }, function (err) {
    res.json({ error: true });
  });
});


module.exports = router;
