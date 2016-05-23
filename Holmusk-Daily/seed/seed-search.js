var scrape = require('../scrape/scrape');
var elasticsearch = require('../search/elasticsearch');
var rp = require('request-promise');

// constants
var HOLMUSK_DAILY_BASE_URL  = "http://localhost:1337";
var GET_FOOD_ID_ENDPOINT    = HOLMUSK_DAILY_BASE_URL + "/foodTitle/";

elasticsearch.indexExists()
  .then(function (exists) {
    if (exists) {
      console.log("deleted");
      return elasticsearch.deleteIndex();
    }
  })
  .then(function () {
    return elasticsearch.initIndex().then(elasticsearch.initMapping)
      .then(function() {
        scrape(function(foodsJSON) {
          foodsJSON.forEach(function(foodJSON, index) {

            url = encodeURI(GET_FOOD_ID_ENDPOINT + foodJSON.title);

            var options = {
              uri: url,
              json: true
            };

            rp(options)
              .then(function(res) {
                foodJSON.id = res.id;
                console.log(res.id);
                elasticsearch.addFood(foodJSON);
              })
              .catch(function(err) {
                console.log(err);
              })
          });
        })

        console.log("\n\nAdded " + foodsJSON.length + " foods to elasticsearch client\n");

      });
  });