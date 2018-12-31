const express = require('express');
/*
 * Without mergeParams, express has opinions about the :id wildcard from
 *./index.js
 */
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comments: new
router.get('/new', isLoggedIn, function(req, res) {
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

// Comments: create
router.post('/', isLoggedIn, function(req, res) {
  // Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // Create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          // Associate username and id with new comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          console.log(comment);
          
          // Save comment
          comment.save()

          campground.comments.push(comment);
          campground.save();
          // Redirect to campground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
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

module.exports = router;
