// SECTION 28
// YELPCAMP: BASICS

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

// any hrefs or links to local files should now resolve to files within public/
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const campgrounds = [
  {
    name: "Tree Creek",
    image: "img/adventure-camp-camping-699558.jpg",
  },
  {name: "Salt", image: "img/bonfire-camp-campfire-1061640.jpg"},
  {name: "More Smores", image: "img/camping-clouds-dawn-803226.jpg"},
];

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  // render the campgrounds template
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const img = req.body.image;
  const newCampground = {name: name, image: img};
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  // res.redirect defaults to a GET request so no issues with POST route
  // having the same name
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.listen(1234, "localhost", function() {
  // eslint-disable-next-line no-console
  console.log("Listening on http://localhost:1234");
});
