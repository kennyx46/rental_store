var express = require('express');
var router = express.Router();

var Language = require('../models/language');

/* GET languages listing. */
router.get('/', function(req, res, next) {
  Language.findAll().then(function (languages) {
    console.log('got data')
    res.json(languages);

  }, function (err) {
    res.send('error(((');
  });
});


module.exports = router;
