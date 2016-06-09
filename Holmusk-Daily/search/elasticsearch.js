// Import libraries
import ElasticSearch from 'elasticsearch';


// Constants
const INDEX_NAME          = 'holmuskdaily';
const TESTING_INDEX_NAME  = 'holmuskdailytest';
const DOCUMENT_TYPE       = 'food';
const ELASTIC_CLIENT_URL  = 'http://48db4e2ec44c80f9b51b2143072862b6.ap-southeast-1.aws.found.io:9200';
const LOCALHOST           = 'http://localhost:9200';


// elasticsearch server
// Must run ./elasticsearch to make connection to elasticsearch server

const elasticUrl = process.env.NODE_ENV === 'production'
  ? ELASTIC_CLIENT_URL
  : LOCALHOST;

const indexName = process.env.NODE_ENV !== 'test'
  ? INDEX_NAME
  : TESTING_INDEX_NAME;

const elasticClient = new ElasticSearch.Client({
  host: elasticUrl,
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
    index: indexName
  });
}

function indexExists() {
  return elasticClient.indices.exists({
    index: indexName
  });
}

function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName
  })
}

// initMapping, configuration made to be an autocomplete suggester

function initMapping() {
  return elasticClient.indices.putMapping({
    index: indexName,
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
* Initialize elasticSearch's index and mapping
*   First, if elasticsearch contains existing data, erase all of them
*   Second, initialize elasticsearch mapping
*/

function initializeElasticSearch() {
  return new Promise((resolve, reject) => {
    indexExists()
      .then((exists) => {
        if (exists) {
          console.log('\nElasticSearch index and mapping has been initialized.\n');
          return deleteIndex();
        }
      })
      .then(() => {
        return initIndex()
          .then(initMapping)
          .then(() => resolve());
      })
      .catch(err => reject(err));
  });
}


/*
* Adding food to elastic search client so that it can traverse search faster
* To be called everytime food is inserted in the database
*/

function addFood(food) {
  return elasticClient.index({
    index: indexName,
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
    index: indexName,
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



//////////////////////////////////////////////////////////////////
/////////         EXPORT MODULE        ///////////////////////////
//////////////////////////////////////////////////////////////////


const ElasticSearchModule = {
  initIndex,
  indexExists,
  deleteIndex,
  initMapping,
  initializeElasticSearch,
  addFood,
  getSuggestions
};

export default ElasticSearchModule;
