var express = require('express');
var router = express.Router();

var ensureAuthenticated = require('../middlewares/auth').ensureAuthenticated;

var Actor = require('../models/actor');

/* GET actors listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  Actor.findAll().then(function (actors) {
    console.log('got data')
    res.json(actors);

  }, function (err) {
    res.send('error(((');
  });
});


module.exports = router;
