var express = require('express');
var router = express.Router();

var passport = require('passport');

// var Actor = require('../models/actor');

/* auth routers. */
router.get('/', passport.authenticate('facebook'));

router.get('/account', function (req,res, next) {


console.log('reqses');
console.log(req.session.passport);

  if (req.session.passport && req.session.passport.user) {
    return res.json(req.session.passport.user);
  } else {
    return res.json({ loggedOut: true });
  }
})

// if we have successRedirect -> no next functions called
router.get('/callback', passport.authenticate('facebook', {
    // successRedirect: '/',
    // successRedirect: '/auth/facebook/popup_close',
    // failureRedirect: '/login'
  }), function (req, res) {
    // console.log("HERE2222")
    // console.log(req.user);
    res.redirect('/');
  }
);

router.get('/popup_close', function (req, res, next) {
  res.render('popup_close');
});


module.exports = router;
