// Import libraries
import RequestPromise from 'request-promise';
import Promise from 'bluebird';
import cheerio from 'cheerio';

import getHashCode from '../helper/helper';


// Constants
const BASE_URL            = "http://www.myfitnesspal.com";
const FITNESS_URL         = BASE_URL + "/nutrition-facts-calories/generic/";
const STARTING_PAGE_INDEX = 1;
const ENDING_PAGE_INDEX   = 100;
const TOTAL_FOODS         = 2000;
const TOTAL_PAGES         = ENDING_PAGE_INDEX - STARTING_PAGE_INDEX + 1;



/*
* Crawl food links from this url, http://www.myfitnesspal.com/nutrition-facts-calories/generic/
* Output: a list of links to individual food's nutrition details
*
*/


function getFoodLinksFromPage(pageUrl) {

  return new Promise((resolve, reject) => {
    const options = {
      uri: pageUrl,
      transform: body => cheerio.load(body)
    };

    RequestPromise(options)
      .then(($) => {
        const $foodList = $('.food_description');
        let foodLinks = [];

        // Every page contains many links to individual food details
        // Scrape every link and save them to a list so that they can be crawled later
        $foodList.each((i, elem) => {
          const link = BASE_URL + $(elem).find('a').first().attr('href');
          foodLinks.push(link);
        });

        resolve(foodLinks);
      })
      .catch((err) => {
        //TODO: redo if failed
        resolve([]);
      })
  });

}

function getFoodLinks() {
  console.log("Currently crawling food from " + ENDING_PAGE_INDEX + " pages");

  let pagesList = Array.from({length: TOTAL_PAGES}, (v,i) => FITNESS_URL + (i+1));

  return new Promise((resolve, reject) => {
    Promise
      .all(pagesList.map(pageUrl => getFoodLinksFromPage(pageUrl)))
      .then((foodLinks) => {
        foodLinks = foodLinks.reduce((list, links) => list.concat(links));
        resolve(foodLinks);
      })
      .catch((err) => reject(err));
  });

}


/*
* Crawl food details from every food's link
* Output: a list of foods, each of which contains all food details including title, link, and nutrition details
*/


function getFood(link) {

  return new Promise((resolve, reject) => {
    const options = {
      uri: link,
      transform: body => cheerio.load(body)
    };

    RequestPromise(options)
      .then(($) => {

        let title, hashCode,
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

        // scrape the food facts and details
        const $foodDetailsRows = $('table#nutrition-facts').first().find('tbody tr');
        const $foodTitle = $('h1.main-title');
        const $foodServing = $('select#food_entry_weight_id').find(":selected");

        title = $foodTitle.text().substring(13).trim();
        hashCode = getHashCode(title);
        serving = $foodServing.text();

        $foodDetailsRows.each((index, elem) => {

          // crawling food nutrient details
          const $rowDetail = $(elem).find('td.col-2');
          const firstValue = $($rowDetail[0]).text();
          const secondValue = $($rowDetail[1]).text();

          switch(index) {
            case 0: {
              calories = firstValue;
              sodium = secondValue;
              break;
            }
            case 1: {
              totalFat = firstValue;
              potassium = secondValue;
              break;
            }
            case 2: {
              saturated = firstValue;
              totalCarbs = secondValue;
              break;
            }
            case 3: {
              polyunsaturated = firstValue;
              dietaryFiber = secondValue;
              break;
            }
            case 4: {
              monounsaturated = firstValue;
              sugars = secondValue;
              break;
            }
            case 5: {
              trans = firstValue;
              protein = secondValue;
              break;
            }
            case 6: {
              cholesterol = firstValue;
              break;
            }
            case 7: {
              vitaminA = firstValue;
              calcium = secondValue;
              break;
            }
            case 8: {
              vitaminC = firstValue;
              iron = secondValue;
              break;
            }
          }
        });

        const json = {
          title,
          link,
          hashCode,
          serving,
          calories,
          totalFat,
          saturated,
          polyunsaturated,
          monounsaturated,
          trans,
          cholesterol,
          sodium,
          potassium,
          totalCarbs,
          dietaryFiber,
          sugars,
          protein,
          vitaminA,
          vitaminC,
          calcium,
          iron
        };

        resolve(json);

      })
      .catch((err) => {
        //TODO: redo if failed
        resolve(null);
      })

  });

}

function getFoods(foodLinks) {
  console.log("\nCurrently crawling food details from " + TOTAL_FOODS + " pages");

  return new Promise((resolve, reject) => {
    Promise
      .all(foodLinks.map(foodLink => getFood(foodLink)))
      .then((foods) => {
        resolve(foods);
      })
      .catch(err => reject(err));
  });
}



/*
**********************************************************************
************************** Export functions **************************
**********************************************************************
*/

export default function scrapeFoods() {
  console.log("--------------------------------------------------------\n");
  console.log("Crawling food from this website, " + FITNESS_URL + "\n");
  console.log("--------------------------------------------------------\n");

  return new Promise((resolve, reject) => {
    getFoodLinks()
      .then(foodLinks => getFoods(foodLinks))
      .then(foods => resolve(foods))
      .catch(err => reject(err));
  });

}



// // Variables
// var pageTraverseList = [];
// var foodList = [];
// var foodListDetails = [];

// var numCrawledPages = 0;
// var numCrawledFoodDetails = 0;



// // Functions



// /*
// * init
// */

// var init = function() {
//   for(page_id = STARTING_PAGE_INDEX; page_id <= ENDING_PAGE_INDEX; page_id++) {
//     page = {id: page_id, traversed: false};
//     pageTraverseList.push(page);
//   }
// }


// /*
// * Crawl food list from this url, http://www.myfitnesspal.com/nutrition-facts-calories/generic/
// * Output: a list of links to individual food's nutrition details
// * callback will be called after traversing through all pages
// */

// var crawlFoodList = function(callback, returnCallback) {
//   var count = 0;
//   var numPagesNeedToCrawl = TOTAL_PAGES - numCrawledPages;

//   pageTraverseList.forEach(function(page, page_id) {

//     if(!pageTraverseList[page_id].traversed) {

//       var url = FITNESS_URL + page_id;
//       var options = {
//         uri: url,
//         transform: function (body) {
//           return cheerio.load(body);
//         }
//       };

//       rp(options)
//         .then(function($){
//           var foodListPage = $('.food_description');

//           // Every page contains many links to individual food details
//           // Scrape every link and save them to a list so that they can be crawled later

//           foodListPage.each( function(index) {
//             var link;
//             var json = {ink: "", traversed: false};

//             var foodBody = $(this).find('a').first();
//             link = BASE_URL + foodBody.attr('href');
//             json.link = link;
//             foodList.push(json);
//           })

//           pageTraverseList[page_id].traversed = true;
//           numCrawledPages++;

//           count++;
//           if(count > numPagesNeedToCrawl - 1) {
//             callback(returnCallback);
//           }

//         })
//         .catch(function(err) {
//           count++;
//           if(count > numPagesNeedToCrawl - 1) {
//             callback(returnCallback);
//           }
//         });
//     }
//   })
// }


// /*
// * Crawl food details from every food's link
// * Output: a list of foods, each of which contains all food details including title, link, and nutrition details
// * callback will be called after traversing through every food
// */

// var crawlFoodDetails = function(callback, returnCallback) {
//   var count = 0;
//   var numFoodNeededToCrawl = TOTAL_FOODS - numCrawledFoodDetails;

//   foodList.forEach(function(food, i) {

//     if(!foodList[i].traversed) {

//       var title, link,
//         serving,
//         calories, sodium,
//         totalFat, potassium,
//         saturated, totalCarbs,
//         polyunsaturated, dietaryFiber,
//         monounsaturated, sugars,
//         trans, protein,
//         cholesterol,
//         vitaminA, calcium,
//         vitaminC, iron;

//       var json = {
//         title: "",
//         link: "",
//         serving: "",
//         calories: "",
//         totalFat: "",
//         saturated: "",
//         polyunsaturated: "",
//         monounsaturated: "",
//         trans: "",
//         cholesterol: "",
//         sodium: "",
//         potassium: "",
//         totalCarbs: "",
//         dietaryFiber: "",
//         sugars: "",
//         protein: "",
//         vitaminA: "",
//         vitaminC: "",
//         calcium: "",
//         iron: ""
//       };

//       link = food.link;

//       var options = {
//         uri: link,
//         transform: function (body) {
//           return cheerio.load(body);
//         }
//       };

//       rp(options)
//         .then(function($){
//           serving = $('select#food_entry_weight_id').find(":selected").text();
//           mainTitle = $('h1.main-title').text();
//           title = mainTitle.substring(13); // for example, mainTitle = "Calories in Pork rice" after scraping, title will only get "Pork rice"

//           var $foodDetails = $('table#nutrition-facts').first();
//           var $foodDetailsRows = $foodDetails.find('tbody tr');

//           $foodDetailsRows.each(function(index) {

//             // crawling food nutrient details

//             var $rowDetail = $(this).find('td.col-2');
//             var firstValue = $($rowDetail[0]).text();
//             var secondValue = $($rowDetail[1]).text();

//             if(index == 0) {
//               calories = firstValue;
//               sodium = secondValue;

//             } else if(index == 1) {
//               totalFat = firstValue;
//               potassium = secondValue;

//             } else if(index == 2) {
//               saturated = firstValue;
//               totalCarbs = secondValue;

//             } else if(index == 3) {
//               polyunsaturated = firstValue;
//               dietaryFiber = secondValue;

//             } else if(index == 4) {
//               monounsaturated = firstValue;
//               sugars = secondValue;

//             } else if(index == 5) {
//               trans = firstValue;
//               protein = secondValue;

//             } else if(index == 6) {
//               cholesterol = firstValue;

//             } else if(index == 7) {
//               vitaminA = firstValue;
//               calcium = secondValue;

//             } else if(index == 8) {
//               vitaminC = firstValue;
//               iron = secondValue;
//             }

//           });

//           json.link = link;
//           json.title = title;
//           json.hashCode = helper.hashCode(title);
//           json.serving = serving;
//           json.calories = calories;
//           json.sodium = sodium;
//           json.totalFat = totalFat;
//           json.potassium = potassium;
//           json.saturated = saturated;
//           json.totalCarbs = totalCarbs;
//           json.polyunsaturated = polyunsaturated;
//           json.dietaryFiber = dietaryFiber;
//           json.monounsaturated = monounsaturated;
//           json.sugars = sugars;
//           json.trans = trans;
//           json.protein = protein;
//           json.cholesterol = cholesterol;
//           json.vitaminA = vitaminA;
//           json.calcium = calcium;
//           json.vitaminC = vitaminC;
//           json.iron = iron;
//           foodListDetails.push(json);

//           foodList[i].traversed = true;
//           numCrawledFoodDetails++;

//           count++;
//           if(count > numFoodNeededToCrawl - 1) {
//             callback(returnCallback);
//           }

//         })

//         .catch(function(err){
//           count++;
//           if(count > numFoodNeededToCrawl - 1) {
//             callback(returnCallback);
//           }

//         });

//     }
//   });

// }



// /*
// *  A callback function after crawlFoodList() finishes execution
// *   If some pages have not been crawled due to bad connections,
// *   crawlFoodList() will be called again until all pages have been crawled
// */

// var callbackAfterCrawlFoodDetails = function(returnCallback) {
//   console.log("Number of Food Details Crawled: " + foodListDetails.length);

//   if(numCrawledFoodDetails > TOTAL_FOODS - 1) {
//     returnCallback(foodListDetails);

//   } else {
//     crawlFoodDetails(callbackAfterCrawlFoodDetails, returnCallback);
//   }

// }


// /*
// *  A callback function after crawlFoodDetails() finishes execution
// *   If some foods have not been crawled due to bad connections,
// *   crawlFoodDetails() will be called again until all foods have been crawled
// */


// var callbackAfterCrawlFoodList = function(returnCallback) {
//   console.log("Number of Pages Crawled: " + numCrawledPages);

//   if(numCrawledPages > TOTAL_PAGES - 1) {
//     console.log("\nCurrently crawling food details from " + TOTAL_FOODS + " pages");
//     crawlFoodDetails(callbackAfterCrawlFoodDetails, returnCallback);

//   } else {
//     crawlFoodList(callbackAfterCrawlFoodList, returnCallback);
//   }

// }


// /*
// **********************************************************************
// ************************** Export functions **************************
// **********************************************************************
// */

// module.exports = function(returnCallback) {

//   console.log("--------------------------------------------------------\n");
//   console.log("Crawling food from this website, " + FITNESS_URL + "\n");
//   console.log("--------------------------------------------------------\n");
//   console.log("Currently crawling food from " + ENDING_PAGE_INDEX + " pages");

//   init();
//   crawlFoodList(callbackAfterCrawlFoodList, returnCallback);

// }


