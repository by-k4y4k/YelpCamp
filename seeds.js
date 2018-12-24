// TODO: the way this is structured is less than ideal...

const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: 'Cloud\'s Rest',
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, do eiusmod',
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description: 'Lorem ipsum dolor sit amet',
  },
];
/**
 * Wipe and reseed the database
 */
function seedDB() {
  // First, remove every campground from the db
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log('removed campgrounds');

    // Next, add a few campgrounds
    data.forEach(function(seed) {
      Campground.create(seed, function(err, campground) {
        if (err) {
          console.log(err);
        } else {
          console.log('added a campground');

          // Then add a few comments to those campgrounds
          Comment.create(
            {
              author: 'tantan; grumpy',
              text: 'nice, but no wifi',
            },
            function(err, comment) {
              if (err) {
                console.log(err);
              } else {
                // Add the comment
                campground.comments.push(comment);
                // Save the campground with its new comment
                campground.save();

                console.log('created new comment');
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
