// TODO: the way this is structured is less than ideal...

const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: 'Cloud\'s Rest',
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description:
      'Lorem ipsum dolor amet single-origin coffee truffaut bitters neutra, asymmetrical try-hard XOXO irony butcher skateboard post-ironic kickstarter jean shorts blue bottle tumeric. Pinterest schlitz fixie yuccie, 8-bit glossier intelligentsia meh pork belly keytar occupy messenger bag ethical. Pinterest letterpress you probably haven\'t heard of them pickled gentrify tacos glossier put a bird on it tilde four loko keffiyeh austin chartreuse. Green juice edison bulb forage tbh. Flannel leggings ugh disrupt, coloring book chicharrones pour-over 3 wolf moon air plant semiotics forage iceland woke four dollar toast cloud bread. Prism seitan pour-over jean shorts twee leggings ugh cardigan la croix. Next level meditation chambray poke pitchfork chillwave.',
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description:
      'Keytar taiyaki chillwave cred, flannel pinterest snackwave shoreditch fam forage PBR&B offal. Tote bag quinoa small batch jianbing williamsburg skateboard cronut dreamcatcher, hashtag green juice wayfarers. Meggings gochujang twee meh, glossier chartreuse snackwave messenger bag yr chillwave readymade lumbersexual fam dreamcatcher. Tattooed chillwave iPhone pabst, lumbersexual vexillologist godard.',
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description:
      'Af health goth tacos flannel 90\'s tofu meh. Offal VHS skateboard, keffiyeh taxidermy whatever authentic shabby chic lumbersexual. Pinterest enamel pin edison bulb fingerstache pabst polaroid banjo. Edison bulb wayfarers single-origin coffee prism food truck. Brunch taxidermy mlkshk, air plant iceland direct trade meggings letterpress migas gastropub 8-bit PBR&B iPhone. Organic keytar stumptown roof party.',
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
              text: 'no wifi??',
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
