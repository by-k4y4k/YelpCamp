// All the middleware goes here
const Comment = require('../models/comment');
const Campground = require('../models/campground');
const User = require('../models/user');

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        // Does the user own the comment they're going to modify?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
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
};

module.exports = middlewareObj;
