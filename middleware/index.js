// All the middleware goes here
const Comment = require('../models/comment');
const Campground = require('../models/campground');
const User = require('../models/user');

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // Tell the user to log in
    req.flash('error', 'You need to be logged in to do that...');
    res.redirect('/login');
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash('error', 'Comment not found.');
        res.redirect('back');
      } else {
        // Does the user own the comment they're going to modify?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You can\'t modify someone else\'s comment!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You can\'t modify someone else\'s comment!');
    res.redirect('back');
  }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    // If the user is logged in:
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        req.flash('error', 'Campground not found. Make sure that it exists!');
        res.redirect('/campgrounds');
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          // If the logged in user owns the campground they wish to modify:
          next();
        } else {
          req.flash('You don\'t have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'you have to be logged in to do that.');
    // If not logged in
    res.redirect('back');
  }
};

module.exports = middlewareObj;
