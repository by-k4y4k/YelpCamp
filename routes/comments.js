/* eslint-disable new-cap */
const express = require('express');
/*
 * Without mergeParams, express has opinions about the :id wildcard from
 *./index.js
 */
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// Comments: new
router.get('/new', middleware.isLoggedIn, function(req, res) {
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      if (!campground) {
        req.flash('error', 'Item not found.');
        return res.redirect('back');
      }
      res.render('comments/new', {campground: campground});
    }
  });
});

// Comments: create
router.post('/', middleware.isLoggedIn, function(req, res) {
  // Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      if (!campground) {
        req.flash('error', 'Item not found.');
        return res.redirect('back');
      }
      // Create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash('error', 'Something went wrong.');
          console.log(err);
        } else {
          // Associate username and id with new comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          // Redirect to campground show page
          req.flash('success', 'Successfully added comment.');
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// Edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      if (!foundComment) {
        req.flash('error', 'Item not found.');
        return res.redirect('back');
      }
      res.render('comments/edit', {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

// Update comment
router.put('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect('back');
    } else {
      if (!updatedComment) {
        req.flash('error', 'Item not found.');
        return res.redirect('back');
      }
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;
