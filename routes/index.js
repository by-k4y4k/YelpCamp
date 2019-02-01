/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', function(req, res) {
  res.render('landing');
});

// Show signup form
router.get('/register', function(req, res) {
  res.render('register');
});

// Handle signup logic
router.post('/register', function(req, res) {
  // Splitting this to clean up the new User definition a little
  const newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      // If there was an error... log it and return to the register form
      return res.render('register', {error: 'Error: ' + err.message + '.'});
    }
    // But if everything looks OK: sign us in
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to YelpCamp, ' + user.username);
      // Then redirect to the campgrounds index
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
router.get('/login', function(req, res) {
  res.render('login');
});

// Handling login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  function(req, res) {
    /*
     * All of the login logic is handled by passport"s middleware. Express -
     * this route - doesn"t actually have to do anything.
     */
  }
);

// Logout route
router.get('/logout', function(req, res) {
  /*
   * Logout() comes for free from Passport, where it"s "merged into express's
   * Request type"
   */
  req.logout();
  req.flash('success', 'Successfully logged out. Come back soon!');
  res.redirect('/campgrounds');
});

module.exports = router;
