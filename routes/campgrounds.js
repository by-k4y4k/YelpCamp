/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

router.get('/', function(req, res) {
  // Render the campgrounds template, with data from db
  Campground.find({}, function(err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      // Rename campgrounds.ejs to index.ejs to follow REST conventions
      res.render('campgrounds/index', {
        campgrounds: allcampgrounds,
        currentUser: req.user,
      });
    }
  });
});

// CREATE - add new campground to db
router.post('/', isLoggedIn, function(req, res) {
  // Get data from form and add to campgrounds array
  const name = req.body.name;
  const img = req.body.image;
  const desc = req.body.description;
  const author = {id: req.user._id, username: req.user.username};
  const newCampground = {
    name: name,
    image: img,
    description: desc,
    author: author,
  };

  // Create a new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      /*
       * Redirect back to campgrounds page. "res.redirect" defaults to a GET
       * request, so there"s no issues with the POST route having the same name.
       */
      res.redirect('/');
    }
  });
});

// NEW - show form to create new campground
router.get('/new', isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
  // Find the campground with provided id
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground.comments);
        
        res.render('campgrounds/show', {campground: foundCampground});
      }
    });
});

// EDIT CAMPGROUND - show a form
router.get('/:id/edit', checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

// UPDATE CAMPGROUND - use form information to change database
router.put('/:id', checkCampgroundOwnership, function(req, res) {
  // Find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    updatedCampground
  ) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Destroy campground route
router.delete('/:id', checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

/**
 * Middleware that checks if the user is logged in (authenticated) or not.
 * @param {*} req The HTML request.
 * @param {*} res The HTML response.
 * @param {*} next The middleware, callback, or other thing that is supposed to
 * run after this middleware.
 * @return {*} next
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

/**
 * Checks to see if the current user has ownership of the campground they are
 * trying to modify.
 * @param {*} req The HTML request.
 * @param {*} res The HTML response.
 * @param {*} next Whatever is slated to run after this middleware.
 */
function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    // If the user is logged in:
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        res.redirect('/campgrounds');
      } else {
        // If the campground was found OK by a logged in user:
        if (foundCampground.author.id.equals(req.user._id)) {
          // If the logged in user owns the campground they wish to modify:
          next();
        } else {
          console.log('you can\'t edit something you don\'t own');
          res.redirect('back');
        }
      }
    });
  } else {
    console.log('you gotta log in first, kiddo');
    // If not logged in
    res.redirect('back');
  }
}

/*
 * Because we added all the routes to router instead of app, they can be
 * exported, along with the new instance of the Express Router, through the
 * 'router' var.
 */

module.exports = router;
