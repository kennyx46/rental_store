var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');

var categories = require('./routes/categories');
var languages = require('./routes/languages');
var actors = require('./routes/actors');
var search = require('./routes/search');
var auth = require('./routes/auth');



passport.serializeUser(function (user, done) {
  console.log('serializeUser ' + user);
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  console.log('deserializeUser ' + obj);
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: '1099490120170135',
  clientSecret: 'f5ea7d005ff44e68050b59e986a796bd',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email'],
  auth_type: "reauthenticate"
}, function (accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  process.nextTick(function () {
    return done(null, profile);
  });
}));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ secret: 'secretsecretsecret', resave: true, saveUninitialized: true }))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views')));

// app.use('/', index);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// app.use('/users', users);
app.use('/categories', categories);
app.use('/languages', languages);
app.use('/actors', actors);
app.use('/search', search);
app.use('/auth/facebook', auth);

app.get('*', function (req, res) {
  res.render('index', {}); // load our public/index.html file
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
