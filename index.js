/*
 * SECTION 30
 * YELPCAMP V10 - UPDATE AND DESTROY
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');

const seedDB = require('./seeds');
const User = require('./models/user');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

// APP CONFIG ==================================================================

// Pug is 1000% less irritating than ejs
app.set('view engine', 'pug');

// Any hrefs or links to local files should now resolve to files within public/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// PASSPORT / AUTH CONFIG ======================================================
app.use(
  require('express-session')({
    secret: 'Funky funky fresh fab',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware that (should) provide every template a username if necessary
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ROUTES ======================================================================
app.use('/', indexRoutes);
// Prepend '/campgrounds' to all routes found inside campgroundRoutes
app.use('/campgrounds', campgroundRoutes);
// Similarly, prepend '/campgrounds/:id/comments' to all of these routes
app.use('/campgrounds/:id/comments', commentRoutes);

// APP INIT ====================================================================

// Create or connect to the "yelp_camp" db
mongoose.connect(
  'mongodb://localhost:27017/yelp_camp',
  {useNewUrlParser: true}
);

seedDB();

app.listen(1234, 'localhost', function() {
  console.log('Listening on http://localhost:1234');
});
