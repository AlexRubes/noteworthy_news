//require npm packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
//require scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
//require models
var db = require("./models");

//initialize express
const PORT = process.env.PORT || 3000;
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
//body-parser for handling submissions 
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//----------------ROUTES-----------------
// A GET route for scraping the website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function (i, element) {
      // Save an empty result object
      var result = {};


      // Add the text and href of every link, and save them as properties of the result object

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");


      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          console.log(result);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);

        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
    res.redirect("/");
  });
});

app.get("/", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      var hbsObject = {
        articles: dbArticle
      };
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

// Route for getting all saved Articles from the db
app.get("/saved", function (req, res) {
  db.Article.find({issaved: true}, null, function (err, data) {
      res.render("saved", {saved:data});
  });
});

//Route to get article by id
app.get("/:id", function(req, res) {
	db.Article.findById(req.params.id, function(err, data) {
		res.json(data);
	});
});

app.post("/saved/:id", function(req, res) {
	db.Article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});


app.post("/note/:id", function(req, res) {
	var note = new Note(req.body);
	note.save(function(err, doc) {
		if (err) throw err;
		db.Article.findByIdAndUpdate(req.params.id, {$set: {"note": doc._id}}, {new: true}, function(err, newdoc) {
			if (err) throw err;
			else {
				res.send(newdoc);
			}
		});
	});
});

//route to get notes
app.get("/note/:id", function(req, res) {
	var id = req.params.id;
	db.Article.findById(id).populate("note").exec(function(err, data) {
		res.send(data.note);
	});
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
