var express = require('express');
var router = express.Router();

var passport = require('passport');

/* auth routers. */
router.get('/', passport.authenticate('facebook'));

router.get('/account', function (req,res, next) {

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
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  req.logout();

  res.json({success: true});
});

module.exports = router;
