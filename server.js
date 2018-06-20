//require npm packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//require scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//require models
var db = require("./models");

//initialize express
var app = express();
var PORT = 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));

//body-parser for handling submissions 
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//----------------ROUTES-----------------
// A GET route for scraping the website
app.get("/scrape", function (req, res) {
    //get body of html
    axios.get("https://www.cnn.com/").then(function (response) {
        // load body of html to cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //grab specific information by tag
        $("article h2").each(function (i, element) {
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("span")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

                //create article user result object
                db.Article.create(result)
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });

        });
        console.log("scrape complete");
    });
});

//A GET route for getting all articles from the DB
app.get("/articles", function (req, res) {
    db.Article.find({})
    .then(function (dbArticle) {
        res.json(dbArticle)
    })
    .catch(function (err) {
        res.json(err);
    });
});

//A GET route for getting all saved articles from the DB
// app.get("/articles", function (req, res) {
//     db.Article.find({})
//     .then(function (dbArticle) {
//         res.json(dbArticle)
//     })
//     .catch(function (err) {
//         res.json(err);
//     });
// });

//A POST route for saving articles

//A POST route for saving/updating an article's associated notes
// app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
//start the server
app.listen(PORT, function () {
    console.log("App running on port: " + PORT);
});