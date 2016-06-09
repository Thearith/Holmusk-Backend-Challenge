import Promise from 'bluebird';

import ElasticSearch from "../../search/elasticSearch";
import getHashCode from "../../helper/helper";


function addFoodToElasticSearch(food) {
  return new Promise((resolve, reject) => {
    ElasticSearch.addFood(food)
      .then(() => resolve())
      .catch(err =>
        retryPromise(
          () => addFoodToElasticSearch(food),
          resolve,
          food.title
        ));
  });
}

function addFoodsToElasticSearch(foods) {
  return new Promise((resolve, reject) => {
    Promise
      .all(foods.map(food => addFoodToElasticSearch(food)))
      .then(() => resolve(foods))
      .catch(err => reject(err));
  });
}


/*
*  Helper function
*  Retry promise function until it is successful
*/

function retryPromise(fn, resolve, title) {
  console.log(`Repost this food, ${title}`);

  return fn()
    .then(() => {
      console.log(`Posted this food, ${title}`);
      resolve();
    })
    .catch(err => {
      console.log(err);
      return retryPromise(fn, resolve, title);
    });
}



/*
**********************************************************************
************************** Export module *****************************
**********************************************************************
*/


module.exports = {
  suggestFoods: input => ElasticSearch.getSuggestions(input),
  addFoodToSearch: food => addFoodToElasticSearch(food),
  addFoodsToSearch: foods => addFoodsToElasticSearch(foods),
  initializeElasticSearch: () => ElasticSearch.initializeElasticSearch(),
  hashCode: title => getHashCode(title)
};