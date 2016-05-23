var elasticsearch = require('elasticsearch');

var INDEX_NAME      = "holmuskdaily";
var DOCUMENT_TYPE   = "food";



var elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});


/********************************************************************
* CRUD Functions to be exported
* including deleteIndex, initIndex, indexExists, initMapping
********************************************************************
*/

function initIndex() {
  return elasticClient.indices.create({
    index: INDEX_NAME
  });
}

function indexExists() {
  return elasticClient.indices.exists({
    index: INDEX_NAME
  });
}

function deleteIndex() {
  return elasticClient.indices.delete({
    index: INDEX_NAME
  })
}

function initMapping() {
  return elasticClient.indices.putMapping({
    index: INDEX_NAME,
    type: DOCUMENT_TYPE,
    body: {
      properties: {
        title: { type: "string" },
        suggest: {
          type: "completion",
          analyzer: "simple",
          search_analyzer: "simple",
          payloads: true
        }
      }
    }
  });
}


/*
* Adding food to elastic search client so that it can traverse search faster
* To be called everytime food is inserted in the database
*/

function addFood(food) {
  return elasticClient.index({
    index: INDEX_NAME,
    type: DOCUMENT_TYPE,
    body: {
      title: food.title,
      suggest: {
        input: food.title.split(" "),
        output: food.id + "\\" + food.title
      }
    }
  });
}


/*
* Suggesting food according to input
* To be called everytime a user searches an input
*/

function getSuggestions(input) {
  return elasticClient.suggest({
    index: INDEX_NAME,
    type: DOCUMENT_TYPE,
    body: {
      foodsSuggested: {
        text: input,
        completion: {
          field: "suggest",
          size: "10",
          fuzzy: true
        }
      }
    }
  });
}


module.exports = {
  initIndex: initIndex,
  indexExists: indexExists,
  deleteIndex: deleteIndex,
  initMapping: initMapping,
  addFood: addFood,
  getSuggestions: getSuggestions
};
