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

//start the server
app.listen(PORT, function () {
    console.log("App running on port: " + PORT);
});