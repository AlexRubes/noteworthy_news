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

//route for saving a note

//route for retrieving all notes by article id
app.get("/notes/:id", function(req, res) {

  // Find notes collection
  db.Note.find(
    {
      _id: req.params.id
    },
    function(error, found) {
      // log any errors
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the note to the browser
        // This will fire off the success function of the ajax request
        console.log(found);
        res.send(found);
      }
    }
  );
});

//route for deleting notes
// Delete One from the DB
app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  db.Note.remove(
    {
      _id: req.params.id
    },
    function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    }
  );
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
