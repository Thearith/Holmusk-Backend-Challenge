var scrape = require('../scrape/scrape.js');
var rp = require('request-promise');

// constants
var HOLMUSK_DAILY_BASE_URL  = "http://localhost:1337";
var POSTING_ENDPOINT        = HOLMUSK_DAILY_BASE_URL + "/foods";


scrape(function(foodsJSON) {
  var options = {
    method: 'POST',
    uri: POSTING_ENDPOINT,
    body: foodsJSON,
    json: true
  };

  rp(options)
    .then(function(parsedBody){
      console.log("\n\n" + parsedBody.msg + "\n");
    })
    .catch(function(err) {
      console.log(err);
    })
})
