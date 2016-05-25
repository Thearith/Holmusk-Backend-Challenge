/*******************************************************************************
*
* Purpose of this file is to scrape a number of foods (default: 2000 foods)
* from fitnesspal and store them in the database using POST request
*
*******************************************************************************/

// Import libraries
var scrape = require('../scrape/scrape.js');
var rp = require('request-promise');


// Constants
var HOLMUSK_DAILY_BASE_URL  = "http://localhost:1337";
var POSTING_ENDPOINT        = HOLMUSK_DAILY_BASE_URL + "/foods";


// First, scrape foods using scrape.js which will return a list of foods, foodsJSON
// After that, make a POST request to store foodsJSON

scrape(function(foodsJSON) {
  var options = {
    method: 'POST',
    uri: POSTING_ENDPOINT,
    body: foodsJSON,
    json: true
  };

  rp(options)
    .then(function(parsedBody){
      console.log("\n" + parsedBody.msg + "\n"); // success
    })
    .catch(function(err) {
      // deal with excpetions
    })
})
