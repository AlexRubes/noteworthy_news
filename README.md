# NOTEworthy News Application

## Overview
This NOTEworthy News application lets users view, save, and leave comments on the latest news from http://www.echojs.com/. The application has a built in scrape functionality that will retrieve titles and links for top news articles on the Echo JS website. 

## User Experience
* User follows heroku link below to access website. 
* Once the home page loads, the user can click the SCRAPE NEW ARTICLES! button in the navigation bar to trigger the Echo JS website scrape. 
* Article titles and links will appear on home page. 
* User can click Save Article button to save article in the Saved Articles page where comments can be submitted. 
* If the user navigates to the Saved Articles page via the navigation bar, they will see all of the articles they saved with a buttons option to Delete From Saved or see Article Notes. 
    * When the user clicks Delete From Saved, article will disappear from Saved Articles page and reset to homepage. 
    * When the user clicks Article Notes, a modal will pop up for user to write and save a note. 
* If the article already has notes, the modal will display all related user notes. 

## Development
This application was built using the following NPM Packages: axios, body-parser, cheerio, express, express-handlebars, mongoose, morgan, and request. The frontend uses bootstrap for styling. The database for this application was built in mongo.

**Heroku Link:** https://gentle-castle-37967.herokuapp.com/

**Github Link:** https://github.com/AlexRubes/noteworthy_news
