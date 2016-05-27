var elasticsearch = require('elasticsearch');

var INDEX_NAME      = "holmuskdaily";
var DOCUMENT_TYPE   = "food";


// elasticsearch server
// Must run ./elasticsearch to make connection to elasticsearch server

var elasticClient = new elasticsearch.Client({
  host: 'http://48db4e2ec44c80f9b51b2143072862b6.ap-southeast-1.aws.found.io:9200',
  log: 'info'
});


/********************************************************************
*
* CRUD Functions to be exported
* including deleteIndex, initIndex, indexExists, initMapping
*
********************************************************************/

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

// initMapping, configuration made to be an autocomplete suggester

function initMapping() {
  return elasticClient.indices.putMapping({
    index: INDEX_NAME,
    type: DOCUMENT_TYPE,
    body: {
      properties: {
        title: {
          type: "string"
        },
        title_suggest: {
          type: "completion",
          analyzer: "simple",
          search_analyzer: "simple",
          payloads: false
        }
      }
    }
  });
}



/********************************************************************
*
* Important methods including suggestFood() and addFood()
*
********************************************************************/


/*
* Adding food to elastic search client so that it can traverse search faster
* To be called everytime food is inserted in the database
*/

function addFood(food) {
  return elasticClient.index({
    index: INDEX_NAME,
    type: DOCUMENT_TYPE,
    body: {
      title: food.title.replace(/[^a-zA-Z ]/g, "").split(" "),
      title_suggest: {
        input: food.title,
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
          field: "title_suggest",
          size: "10"
        }
      }
    }
  });
}


/*
**********************************************************************
************************** Export functions **************************
**********************************************************************
*/

module.exports = {
  initIndex: initIndex,
  indexExists: indexExists,
  deleteIndex: deleteIndex,
  initMapping: initMapping,
  addFood: addFood,
  getSuggestions: getSuggestions
};
