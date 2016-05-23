// import libraries
var rp = require('request-promise');
var cheerio = require('cheerio');


// constants
var BASE_URL            = "http://www.myfitnesspal.com";
var FITNESS_URL         = BASE_URL + "/nutrition-facts-calories/generic/";
var STARTING_PAGE_INDEX = 1;
// var ENDING_PAGE_INDEX   = 9545;
// var TOTAL_FOODS         = 190899;
var ENDING_PAGE_INDEX   = 100;
var TOTAL_FOODS         = 2000;
var TOTAL_PAGES         = ENDING_PAGE_INDEX - STARTING_PAGE_INDEX + 1;

// variables
var pageTraverseList = [];
var foodList = [];
var foodListDetails = [];

var numCrawledPages = 0;
var numCrawledFoodDetails = 0;

/*
* init
*/

var init = function() {
  for(page_id = STARTING_PAGE_INDEX; page_id <= ENDING_PAGE_INDEX; page_id++) {
    page = {id: page_id, traversed: false};
    pageTraverseList.push(page);
  }
}



/*
* Crawl food list from this url, http://www.myfitnesspal.com/nutrition-facts-calories/generic/
* Output: a list of foods, each of which only contains food title and link to its nutrition details
*/

var crawlFoodList = function(callback, returnCallback) {
  var count = 0;
  var numPagesNeedToCrawl = TOTAL_PAGES - numCrawledPages;

  pageTraverseList.forEach(function(page, page_id) {

    if(!pageTraverseList[page_id].traversed) {

      var url = FITNESS_URL + page_id;
      var options = {
        uri: url,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      rp(options)
        .then(function($){
          var foodListPage = $('.food_description');

          foodListPage.each( function(index) {
            var title, link;
            var json = {title: "", link: "", traversed: false};

            var foodBody = $(this).find('a').first();
            title = foodBody.text();
            link = BASE_URL + foodBody.attr('href');
            json.title = title;
            json.link = link;
            foodList.push(json);
          })

          pageTraverseList[page_id].traversed = true;
          numCrawledPages++;

          count++;
          if(count > numPagesNeedToCrawl - 1) {
            callback(returnCallback);
          }

        })
        .catch(function(err) {
          count++;
          if(count > numPagesNeedToCrawl - 1) {
            callback(returnCallback);
          }
        });
    }
  })
}


/*
* Crawl food details from every food's link
* Output: a list of foods, each of which contains all food details including title, link, and nutrition details
*/

var crawlFoodDetails = function(callback, returnCallback) {
  var count = 0;
  var numFoodNeededToCrawl = TOTAL_FOODS - numCrawledFoodDetails;

  foodList.forEach(function(food, i) {

    if(!foodList[i].traversed) {

      var title, link,
        serving,
        calories, sodium,
        totalFat, potassium,
        saturated, totalCarbs,
        polyunsaturated, dietaryFiber,
        monounsaturated, sugars,
        trans, protein,
        cholesterol,
        vitaminA, calcium,
        vitaminC, iron;

      var json = {
        title: "",
        link: "",
        serving: "",
        calories: "",
        totalFat: "",
        saturated: "",
        polyunsaturated: "",
        monounsaturated: "",
        trans: "",
        cholesterol: "",
        sodium: "",
        potassium: "",
        totalCarbs: "",
        dietaryFiber: "",
        sugars: "",
        protein: "",
        vitaminA: "",
        vitaminC: "",
        calcium: "",
        iron: ""
      };

      title = food.title;
      link = food.link;

      var options = {
        uri: link,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      rp(options)
        .then(function($){
          serving = $('select#food_entry_weight_id').find(":selected").text();

          var $foodDetails = $('table#nutrition-facts').first();
          var $foodDetailsRows = $foodDetails.find('tbody tr');

          $foodDetailsRows.each(function(index) {
            var $rowDetail = $(this).find('td.col-2');
            var firstValue = $($rowDetail[0]).text();
            var secondValue = $($rowDetail[1]).text();

            if(index == 0) {
              calories = firstValue;
              sodium = secondValue;

            } else if(index == 1) {
              totalFat = firstValue;
              potassium = secondValue;

            } else if(index == 2) {
              saturated = firstValue;
              totalCarbs = secondValue;

            } else if(index == 3) {
              polyunsaturated = firstValue;
              dietaryFiber = secondValue;

            } else if(index == 4) {
              monounsaturated = firstValue;
              sugars = secondValue;

            } else if(index == 5) {
              trans = firstValue;
              protein = secondValue;

            } else if(index == 6) {
              cholesterol = firstValue;

            } else if(index == 7) {
              vitaminA = firstValue;
              calcium = secondValue;

            } else if(index == 8) {
              vitaminC = firstValue;
              iron = secondValue;
            }

          });

          json.link = link;
          json.title = title;
          json.serving = serving;
          json.calories = calories;
          json.sodium = sodium;
          json.totalFat = totalFat;
          json.potassium = potassium;
          json.saturated = saturated;
          json.totalCarbs = totalCarbs;
          json.polyunsaturated = polyunsaturated;
          json.dietaryFiber = dietaryFiber;
          json.monounsaturated = monounsaturated;
          json.sugars = sugars;
          json.trans = trans;
          json.protein = protein;
          json.cholesterol = cholesterol;
          json.vitaminA = vitaminA;
          json.calcium = calcium;
          json.vitaminC = vitaminC;
          json.iron = iron;
          foodListDetails.push(json);

          foodList[i].traversed = true;
          numCrawledFoodDetails++;

          count++;
          if(count > numFoodNeededToCrawl - 1) {
            callback(returnCallback);
          }

        })

        .catch(function(err){
          count++;
          if(count > numFoodNeededToCrawl - 1) {
            callback(returnCallback);
          }

        });

    }
  });

}



/*
*   Callbacks
*/

var callbackAfterCrawlFoodDetails = function(returnCallback) {
  console.log("Number of Food Details Crawled: " + foodListDetails.length);

  if(numCrawledFoodDetails > TOTAL_FOODS - 1) {
    returnCallback(foodListDetails);

  } else {
    crawlFoodDetails(callbackAfterCrawlFoodDetails, returnCallback);
  }

}

var callbackAfterCrawlFoodList = function(returnCallback) {
  console.log("Number of Pages Crawled: " + numCrawledPages);

  if(numCrawledPages > TOTAL_PAGES - 1) {
    console.log("\nCurrently crawling food details from " + TOTAL_FOODS + " pages");
    crawlFoodDetails(callbackAfterCrawlFoodDetails, returnCallback);

  } else {
    crawlFoodList(callbackAfterCrawlFoodList, returnCallback);
  }

}


/*
**********************************************************************
************************** MAIN **************************************
**********************************************************************
*/

module.exports = function(returnCallback) {

  console.log("--------------------------------------------------------\n");
  console.log("Crawling food from this website, " + FITNESS_URL + "\n");
  console.log("--------------------------------------------------------\n\n");
  console.log("Currently crawling food from " + ENDING_PAGE_INDEX + " pages");

  init();
  crawlFoodList(callbackAfterCrawlFoodList, returnCallback);

}


