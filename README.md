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
3. Open a new tab and run `sails lift` to start the localhost server.  Visit [http://localhost:1337](http://localhost:1337).
5. Open a new tab and run `npm run seed` and wait for a while. This will scrape 2000 foods from [myfitnesspal](https://www.myfitnesspal.com/) and will save all the foods' to both Database and Elasticsearch. To test whether elasticsearch contains 2000 entries, use [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) to make a POST request to `localhost:9200/holmuskdaily/food/_search?size=2000` with body 
```{
    "query": {
        "match_all": {}
    }
}```.
This will return a list of 2000 foods.
5. Enjoy Holmusk Daily!


## Npm commands
All npm commands are stored inside `package.json`.

1. `sails lift` to start the server.
2. `npm run seed` to scrape the food data from myfitnesspal and seed both ElasticSearch and Database. Please run command once after cloning the project.
5. `npm run test` to run unit test.


## Tech stack


### Framework
1. [Sails.js](http://sailsjs.org/).

### Frontend stack
1. [React.js](https://facebook.github.io/react/)
2. [Material](http://materializecss.com/), UI library based on Material Design.
3. [Webpack](https://github.com/webpack/webpack), Module Bundler

### Web crawling stack
1. [Bluebird's promise](http://bluebirdjs.com/docs/getting-started.html), for handling Javascript asynchronous calls
2. [request-promise](https://github.com/request/request), request + promise
3. [cheerio](https://github.com/cheeriojs/cheerio), receive a raw HTMLString and convert it so that we can do DOM traversal using familar JQuery calls.

### Database
1. [sails-mongo](https://www.npmjs.com/package/sails-mongo) (Sails Waterline adapter for MongoDB).

The MongoDB database is hosted in mongolab. To connect to the database using mongo shell:
`mongo ds025752.mlab.com:25752/holmusk-daily -u <dbuser> -p <dbpassword>`.
The table's name is `food`.

### Test Stack
1. [Mocha](https://mochajs.org/), a Node.js test framework
2. [supertest](https://github.com/visionmedia/supertest), a Javascript HTTP Assertion library 
3. [should](https://shouldjs.github.io/), Javascript Assertion library

### Other Stacks
1. [Babel](https://babeljs.io/), for ES6 syntaxes as some of ES6 syntaxes like import, export are still not supported in Nodejs V6.
2. [Sails Hook Babel](https://github.com/sane/sails-hook-babel), a hook to activate ES6 syntaxes for the whole SailsJS project

## Improvements from previous Submission
1. Eliminate Javascript async hell callback by using Promises.
2. Rewrite everything in ES6 syntaxes.
3. Use Webpack and rewrite Frontend in React ES6 class.
4. Manage 3 databases: one for production, one for development, and one for testing.
5. Write more tests.

## Future improvements
1. Currently elasticsearch can do **Prefix Query** (for example, when we search `Food`, elasticsearch only return titles starting with `Food`. Titles such as `Fast Food` will be ignored). We can improve it by implementing **Partial Word Autocomplete** using NGrams.


