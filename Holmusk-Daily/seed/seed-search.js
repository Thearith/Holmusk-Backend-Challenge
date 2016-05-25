// import libraries
var scrape = require('../scrape/scrape');
var elasticsearch = require('../search/elasticsearch');
var rp = require('request-promise');
var helper = require('../helper/helper');

// constants
var HOLMUSK_DAILY_BASE_URL  = "http://localhost:1337";
var GET_FOOD_ID_ENDPOINT    = HOLMUSK_DAILY_BASE_URL + "/foodHash/";


// variables
var foodJSONList;
var numFoodSavedToSearchList;


elasticsearch.indexExists()
  .then(function (exists) {
    if (exists) {
      console.log("\nDeleted all elasticsearch data\n");
      return elasticsearch.deleteIndex();
    }
  })
  .then(function () {
    return elasticsearch.initIndex()
      .then(elasticsearch.initMapping)
      .then(function() {
        scrape(function(foodsJSON) {
          init(foodsJSON);
          saveFoodListToElasticSearch(callback);
        });
      });
  });

var init = function(foodsJSON) {
  console.log("\n");

  foodJSONList = foodsJSON;
  numFoodSavedToSearchList = 0;

  for(i=0; i<foodJSONList.length; i++)
    foodJSONList[i].traversed = false;
}

var saveFoodListToElasticSearch = function(callback) {
  var count = 0;
  var totalFoodNeeded = foodJSONList.length - numFoodSavedToSearchList;

  foodJSONList.forEach(function(foodJSON, index) {

    if(!foodJSON.traversed) {
      hash = helper.hashCode(foodJSON.title);
      url = encodeURI(GET_FOOD_ID_ENDPOINT + hash);

      var options = {
        uri: url,
        json: true
      };

      rp(options)
        .then(function(res) {
          foodJSON.id = res.id;
          elasticsearch.addFood(foodJSON);

          foodJSON.traversed = true;
          numFoodSavedToSearchList++;

          count++;
          if(count > totalFoodNeeded - 1)
            callback();
        })
        .catch(function(err) {
          count++;
          if(count > totalFoodNeeded - 1)
            callback();
        })
      }
  });
}

var callback = function() {
  console.log("Saved " + numFoodSavedToSearchList + " foods to elasticsearch client");

  if(numFoodSavedToSearchList > foodJSONList.length - 1) {
    console.log("\nSuccessfully Added " + foodJSONList.length + " foods to elasticsearch client\n");
  } else {
    saveFoodListToElasticSearch(callback);
  }
}