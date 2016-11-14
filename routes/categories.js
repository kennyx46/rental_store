var express = require('express');
var router = express.Router();

var ensureAuthenticated = require('../middlewares/auth').ensureAuthenticated;

var Category = require('../models/category');

/* GET categories listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  Category.findAll().then(function (categories) {
    res.json(categories);

  }, function (err) {
    res.send('error(((');
  });
});

module.exports = router;
