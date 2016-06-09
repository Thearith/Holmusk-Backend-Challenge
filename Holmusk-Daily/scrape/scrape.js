// Import libraries
import RequestPromise from 'request-promise';
import Promise from 'bluebird';
import cheerio from 'cheerio';

import getHashCode from "../helper/helper";


// Constants
const BASE_URL            = 'http://www.myfitnesspal.com';
const FITNESS_URL         = BASE_URL + '/nutrition-facts-calories/generic/';


/*
* Crawl food links from this url, http://www.myfitnesspal.com/nutrition-facts-calories/generic/
* Output: a list of links to individual food's nutrition details
*
*/

function getFoodLinks(startPage, endPage) {
  const totalPages = endPage - startPage + 1;
  let pagesList = Array.from({length: totalPages}, (v,i) => FITNESS_URL + (startPage + i));

  console.log(`\nCurrently crawling food from ${totalPages} pages\n`);

  return new Promise((resolve, reject) => {
    Promise
      .all(pagesList.map(pageUrl => getFoodLinksFromPage(pageUrl)))
      .then((foodLinks) => {
        foodLinks = foodLinks.reduce((list, links) => list.concat(links));
        resolve(foodLinks);
      })
      .catch(err => reject(err));
  });

}


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
      .catch(err => retryPromise(() => getFoodLinksFromPage(pageUrl), resolve, pageUrl));
  });
}



/*
* Crawl food details from every food's link
* Output: a list of foods, each of which contains all food details including title, link, and nutrition details
*/

function getFoods(foodLinks) {
  console.log(`\n\nCurrently crawling food details from ${foodLinks.length} pages\n`);

  return new Promise((resolve, reject) => {
    Promise
      .all(foodLinks.map(foodLink => getFood(foodLink)))
      .then((foods) => {
        resolve(foods);
      })
      .catch(err => reject(err));
  });
}


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
        const $foodServing = $('select#food_entry_weight_id').find(':selected');

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
          hashCode,
          link,
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
      .catch(err => retryPromise(() => getFood(link), resolve, link));

  });

}



/*
*  Helper function
*  Retry promise function until it is successful
*/

function retryPromise(fn, resolve, link) {
  return fn()
    .then((obj) => {
      console.log(`-->\tRefectched this link, ${link}`);
      resolve(obj);
    })
    .catch(err => retryPromise(fn, resolve, link));
}


/*
**********************************************************************
************************** Export functions **************************
**********************************************************************
*/

function scrapeFoods(startPage, endPage) {
  console.log('--------------------------------------------------------\n');
  console.log(`Crawling food from this website, ${FITNESS_URL} \n`);
  console.log('--------------------------------------------------------\n');

  return new Promise((resolve, reject) => {
    getFoodLinks(startPage, endPage)
      .then(foodLinks => getFoods(foodLinks))
      .then(foods => resolve(foods))
      .catch(err => reject(err));
  });

}

export {
  scrapeFoods,
  getFoodLinksFromPage,
  getFood
};
