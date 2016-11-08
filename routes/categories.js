var express = require('express');
var router = express.Router();

var Category = require('../models/category');

/* GET categories listing. */
router.get('/', function(req, res, next) {
  Category.findAll().then(function (categories) {
    console.log('got data')
    res.json(categories);

  }, function (err) {
    res.send('error(((');
  });
});

module.exports = router;
