//require npm packages
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//require scraping tools
var cheerio = require("cheerio");

//require models
var db = require("./models");

//initialize express
var app = express();
var PORT = 3000;

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
    axios.get("").then(function (response) {
        // load body of html to cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //grab specific information by tag
        $("").each(function (i, element) {
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.summary = $(this)
                .
                .
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

//start the server
app.listen(PORT, function () {
    console.log("App running on port: " + PORT);
});