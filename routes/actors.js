var express = require('express');
var router = express.Router();

var Actor = require('../models/actor');

/* GET actors listing. */
router.get('/', function(req, res, next) {
  Actor.findAll().then(function (actors) {
    console.log('got data')
    res.json(actors);

  }, function (err) {
    res.send('error(((');
  });
});


module.exports = router;
