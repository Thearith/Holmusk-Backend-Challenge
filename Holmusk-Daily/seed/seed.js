/*******************************************************************************
*
* Purpose of this file is to scrape a number of foods (default: 2000 foods)
* from fitnesspal and store them in the database using POST requests
*
*******************************************************************************/

// Import libraries
import RequestPromise from 'request-promise';

import ElasticSearch from '../search/elasticSearch';
import { scrapeFoods } from '../scrape/scrape.js';
import SeedDB from './seed-db.js';


// Constants
const TOTAL_PAGES             = 100;
const RANGE_SPAN              = 100;
const NUM_BLOCKS              = TOTAL_PAGES / RANGE_SPAN;
const START                   = 0;
const END                     = 1;



/*
**********************************************************************
************************** Export functions **************************
**********************************************************************
*/

function seedRange(startPage, endPage) {
  return new Promise((resolve, reject) => {
    scrapeFoods(startPage, endPage)
      .then((foods) => {

        console.log(`\n\nNow posting ${foods.length} foods to Database and ElasticSearch\n`);

        SeedDB.postFoods(foods)
          .then(() => resolve())
          .catch(err => reject(err));

      });
  });
}

export default function seed() {

  SeedDB.initializeFoodsInDatabase()
    .then(() => {

      // Scrape foods chunk by chunk
      let rangeList = Array.from({
        length: NUM_BLOCKS},
        (v,i) => [ RANGE_SPAN*i + 1, RANGE_SPAN*(i+1) ]);

      Promise
        .all(rangeList.map(range => seedRange(range[START], range[END])))
        .then(() => console.log(`\n-----> FINISHED`))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

seed();