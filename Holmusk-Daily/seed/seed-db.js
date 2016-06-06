/*******************************************************************************
*
* Purpose of this file is to scrape a number of foods (default: 2000 foods)
* from fitnesspal and store them in the database using POST request
*
*******************************************************************************/

// Import libraries
import RequestPromise from 'request-promise';
import scrapeFoods from '../scrape/scrape.js';

// Constants
const LOCALHOST               = 'http://localhost:1337';
const HOSTED_URL              = 'http://holmusk-daily-63927.onmodulus.net/';
const POSTING_ENDPOINT        = '/foods';



/*
**********************************************************************
************************** Export functions **************************
**********************************************************************
*/


// First, scrape foods using scrape.js which will return a list of foods, foodsJSON
// After that, make a POST request to store foodsJSON

const url = process.env.NODE_ENV === 'production'
  ? HOSTED_URL + POSTING_ENDPOINT
  : LOCALHOST + POSTING_ENDPOINT;

export default function seedDatabase() {
  scrapeFoods()
    .then((foodsJSON) => {
      const options = {
        method: 'POST',
        uri: url,
        body: foodsJSON,
        json: true
      };

      RequestPromise(options)
        .then((parsedBody) => console.log("\n" + parsedBody.msg + "\n"))
        .catch(err => reject(err));
    })
    .catch(err => console.log(err));
}

seedDatabase();