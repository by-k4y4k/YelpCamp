/*
 * SECTION 30
 * YELPCAMP V11 - Flash Messaging
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');

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
app.use(flash());

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

// Middleware that (should) provide every template a username for the navbar
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// ROUTES ======================================================================
app.use('/', indexRoutes);
// Prepend '/campgrounds' to all routes found inside campgroundRoutes
app.use('/campgrounds', campgroundRoutes);
// Similarly, prepend '/campgrounds/:id/comments' to all of these routes
app.use('/campgrounds/:id/comments', commentRoutes);

// APP INIT ====================================================================

const dbURL = process.env.DATABASEURL || 'mongodb://localhost/yelpcamp';

// Create or connect to the "yelp_camp" db
mongoose.connect(dbURL, {
  useNewUrlParser: true,
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, () => {
  console.log(`Running on port ${PORT}`);
  console.log(process.env.DATABASEURL);
});
