/*
 * SECTION 30
 * YELPCAMP V6 - ADDING AUTHENTICATION WITH PASSPORT
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Campground = require('./models/campground');
const seedDB = require('./seeds');
const Comment = require('./models/comment');
const User = require('./models/user');

// APP CONFIG ==================================================================

// Create the 'yelp_camp' db
mongoose.connect(
  'mongodb://localhost:27017/yelp_camp',
  {useNewUrlParser: true}
);

// Pug is 1000% less irritating than ejs
app.set('view engine', 'pug');
// Any hrefs or links to local files should now resolve to files within public/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

seedDB();

// PASSPORT CONFIG =============================================================
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

// ROUTES ======================================================================

// INDEX ROUTE - show all campgrounds
app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campgrounds', function(req, res) {
  // Render the campgrounds template, with data from db
  Campground.find({}, function(err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      // Rename campgrounds.ejs to index.ejs to follow REST conventions
      res.render('campgrounds/index', {campgrounds: allcampgrounds});
    }
  });
});

// CREATE - add new campground to db
app.post('/campgrounds', function(req, res) {
  // Get data from form and add to campgrounds array
  const name = req.body.name;
  const img = req.body.image;
  const desc = req.body.description;
  const newCampground = {name: name, image: img, description: desc};

  // Create a new campground and save to db
  Campground.create(newCampground, function(err, newlycreated) {
    if (err) {
      console.log(err);
    } else {
      /*
       * Redirect back to campgrounds page. 'res.redirect' defaults to a GET
       *request, so there's no issues with the POST route having the same name.
       */
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create new campground
app.get('/campgrounds/new', function(req, res) {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
app.get('/campgrounds/:id', function(req, res) {
  // Find the campground with provided id
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);

        res.render('campgrounds/show', {campground: foundCampground});
      }
    });
});

// COMMENTS ROUTES =============================================================

app.get('/campgrounds/:id/comments/new', function(req, res) {
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', function(req, res) {
  // Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // Create new comment
      console.log(req.body.comment);

      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          // Connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // Redirect to campground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// AUTH ROUTES =================================================================

// Show signup form
app.get('/register', function(req, res) {
  res.render('register');
});

// Handle signup logic
app.post('/register', function(req, res) {
  // Splitting this to clean up the new User definition a little
  const newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      // If there was an error... log it
      console.log(err);
      // Then, immediately return the user back to the register form
      return res.render('register');
    }
    // But if everything looks OK: sign us in
    passport.authenticate('local')(req, res, function() {
      // Then redirect to the campgrounds index
      res.redirect('/campgrounds');
    });
  });
});
 

app.listen(1234, 'localhost', function() {
  console.log('Listening on http://localhost:1234');
});
