/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, function(req, res) {
  // Get data from form and add to campgrounds array
  const name = req.body.name;
  const img = req.body.image;
  const desc = req.body.description;
  const price = req.body.price;
  const author = {id: req.user._id, username: req.user.username};
  const newCampground = {
    name: name,
    image: img,
    description: desc,
    price: price,
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
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
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
        if (!foundCampground) {
          req.flash('error', 'Item not found.');
          return res.redirect('back');
        }
        console.log(foundCampground.comments);

        res.render('campgrounds/show', {campground: foundCampground});
      }
    });
});

// EDIT CAMPGROUND - show a form
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (!foundCampground) {
      req.flash('error', 'Item not found.');
      return res.redirect('back');
    }
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

// UPDATE CAMPGROUND - use form information to change database
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  // Find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    updatedCampground
  ) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      if (!foundCampground) {
        req.flash('error', 'Item not found.');
        return res.redirect('back');
      }
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      if (!foundCampground) {
        req.flash('error', 'Item not found.');
        return res.redirect('back');
      }
      res.redirect('/campgrounds');
    }
  });
});

/*
 * Because we added all the routes to router instead of app, they can be
 * exported, along with the new instance of the Express Router, through the
 * 'router' var.
 */

module.exports = router;
