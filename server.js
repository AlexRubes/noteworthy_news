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
          res.redirect("/");
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);

        });
    });

    res.redirect("/");
  });
});

//route for home page to get all articles in db
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

// Route for getting all saved articles from the db
app.get("/saved", function (req, res) {
  db.Article.find({issaved: true})
    .then(function(saved) {
      var hbsObjectTwo = {
        saved: saved
      };
      // If we were able to successfully find Articles, send them back to the client
      res.render("saved", hbsObjectTwo);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//route for saving an article by id
app.post("/saved/:id", function(req, res) {
	db.Article.update(
    {
      _id: req.params.id
    },
    {
      $set: {
        issaved: true,
        status: "Saved"
      }
    },
    function (error, edited) {
      if(error) {
        console.log("WE HAVE AN ERROR: "+ error);
        res.send(error);
      } else {
        console.log(edited);
        res.redirect("/saved");
      }
    }
  );
});

//route for removing an article from saved list
app.post("/unsave/:id", function(req, res) {
	db.Article.update(
    {
      _id: req.params.id
    },
    {
      $set: {
        issaved: false,
        status: "Save Article"
      }
    },
    function (error, edited) {
      if(error) {
        console.log("WE HAVE AN ERROR: "+ error);
        res.send(error);
      } else {
        console.log(edited);
        res.redirect("/saved");
      }
    }
  );
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/saved/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/saved/notes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
  
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id }}, { new: true, upsert: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
