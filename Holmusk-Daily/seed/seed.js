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
const START_PAGE              = 1;
const END_PAGE                = 100;


/*
**********************************************************************
************************** Export functions **************************
**********************************************************************
*/

export default function seed() {

  SeedDB.initializeFoodsInDatabase()
    .then(() => {
      scrapeFoods(START_PAGE, END_PAGE)
        .then((foods) => {

          console.log(`\n\nNow posting ${foods.length} foods to Database and ElasticSearch\n`);

          SeedDB.postFoods(foods)
            .then((msg) => console.log(msg))
            .catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err));
}

seed();