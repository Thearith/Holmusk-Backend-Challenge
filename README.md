# Holmusk-Backend-Challenge

Holmusk Daily allows you to search for food and their nutrient details in real time. Visit [http://tinyurl.com/holmusk-daily](http://tinyurl.com/holmusk-daily).

Holmusk Daily's features include:

1. Searching for food and retrieve their nutrient details in real time. Search is empowered by the fast `elasticsearch` server.
2. Pinning your favorite food. Switch toggle to **_on_** to see the list of your favorite food.
3. Submitting your food to Holmusk Daily.


## Screenshots

#### Homepage
<img src="https://github.com/Thearith/Holmusk-Backend-Challenge/blob/master/Screenshot/Homepage.png">


#### Searching _Fast foods_
<img src="https://github.com/Thearith/Holmusk-Backend-Challenge/blob/master/Screenshot/Search%20mode.png">


#### Toggle switch on: showing a list of pinned foods
<img src="https://github.com/Thearith/Holmusk-Backend-Challenge/blob/master/Screenshot/Pin%20mode.png">


#### Food Card
<img src="https://github.com/Thearith/Holmusk-Backend-Challenge/blob/master/Screenshot/Food%20Card.png" width="300" style="margin-right: 50px;"><img src="https://github.com/Thearith/Holmusk-Backend-Challenge/blob/master/Screenshot/Expanded%20Food%20Card.png" width="300">


#### Form Modal
<img src="https://github.com/Thearith/Holmusk-Backend-Challenge/blob/master/Screenshot/Form%20Modal.png">


## Getting Started

1. Clone this project by `git clone git@github.com:Thearith/Holmusk-Backend-Challenge.git`. After that, go to `/Holmusk-Daily` and run `npm install` to install all npm libraries and dependencies.
2. Download [Elasticsearch](https://www.elastic.co/downloads/elasticsearch). Unzip the folder and run `bin/elasticsearch` to run the elasticsearch server on your machine. 
3. Open a new tab and run `sails lift` to start the localhost server.  Visit [http://localhost:1337](http://localhost:1337).  (**Note**: The database is hosted on [mongolab](https://mlab.com/home). If you encounter an error while running `sails lift`, please rerun `sails lift` as this is caused by connection problems to mongolab)
5. Open a new tab and run `npm run seed-search` and wait for a while. This will scrape 2000 foods from [myfitnesspal](https://www.myfitnesspal.com/) and will save all the foods' titles to elasticsearch for future searches. To test whether elasticsearch contains 2000 entries, use [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) to make a POST request to `localhost:9200/holmuskdaily/food/_search?size=2000` with body 
```{
    "query": {
        "match_all": {}
    }
}```.
This will return a list of 2000 foods.
5. There is no need to setup the local database or to seed the database as I have already hosted it on mongolab and seeded the database with scraped food details (Info on how to connect to the hosted database is given in a below section).
6. Enjoy Holmusk Daily!


## Npm commands
All npm commands are stored inside `package.json`.

1. `sails lift` to start the server.
2. `npm run seed-search` to scrape the food data from myfitnesspal and seed the elasticsearch for future searches.
3. `npm run scrape` to scrape the food data from myfitnesspal and write to an output file, `foods.json`. The output file is in `/search` folder.
4. `npm run seed-db` to scrape the food data from myfitnesspal and seed the database hosted in mongolab.
5. `npm run test` to run unit test.


## Tech stack


### Framework
1. [Sails.js](http://sailsjs.org/).

### Frontend stack
1. [React.js](https://facebook.github.io/react/)
2. [Material](http://materializecss.com/), UI library based on Material Design.

### Web crawling stack
1. [request](https://github.com/request/request), for making GET and POST requests
2. [Bluebird's promise](http://bluebirdjs.com/docs/getting-started.html), for handling Javascript asynchronous calls
3. [request-promise](https://github.com/request/request), request + promise
4. [cheerio](https://github.com/cheeriojs/cheerio), receive a raw HTMLString and convert it so that we can do DOM traversal using familar JQuery calls.

### Database
1. [sails-mongo](https://www.npmjs.com/package/sails-mongo) (Sails Waterline adapter for MongoDB).

The MongoDB database is hosted in mongolab. To connect to the database using mongo shell:
`mongo ds025752.mlab.com:25752/holmusk-daily -u <dbuser> -p <dbpassword>`.
The table's name is `food`.

### Test Stack
1. [Mocha](https://mochajs.org/), a Node.js test framework
2. [supertest](https://github.com/visionmedia/supertest), a Javascript HTTP Assertion library 
3. [should](https://shouldjs.github.io/), Javascript Assertion library


## Future improvements
1. Currently elasticsearch can do **Prefix Query** (for example, when we search `Food`, elasticsearch only return titles starting with `Food`. Titles such as `Fast Food` will be ignored). We can improve it by implementing **Partial Word Autocomplete** using NGrams.
2. If the frontend gets more complicated, setup [Webpack](https://webpack.github.io/) and [Webpack's Hot reload](https://webpack.github.io/docs/hot-module-replacement.html). Install babel, css-loader (for private scope css), etc for ES6 syntaxes and good React practices.
3. Manage 3 databases: one for production, one for development, and one for testing.


