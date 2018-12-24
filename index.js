/*
 * SECTION 30
 * YELPCAMP V2 - ADDING MONGOOSE
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Campground = require('./models/campground');
const seedDB = require('./seeds');

// Create the 'yelp_camp' db
mongoose.connect(
  'mongodb://localhost:27017/yelp_camp',
  {useNewUrlParser: true}
);

app.set('view engine', 'ejs');
// Any hrefs or links to local files should now resolve to files within public/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

seedDB();

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
      res.render('index', {campgrounds: allcampgrounds});
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
  res.render('new');
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

        res.render('show', {campground: foundCampground});
      }
    });
});

app.listen(1234, 'localhost', function() {
  // eslint-disable-next-line no-console
  console.log('Listening on http://localhost:1234');
});
