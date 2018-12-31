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

  console.log('+++ REQ. USER +++ ' + req.user);

  // Create a new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log('+++NEWLY CREATED CAMPGROUND+++ ' + newlyCreated);

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
        res.render('campgrounds/show', {campground: foundCampground});
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

/*
 * Because we added all the routes to router instead of app, they can be
 * exported, along with the new instance of the Express Router, through the
 * 'router' var.
 */
module.exports = router;
