# Holmusk-Backend-Challenge

Holmusk Daily allows you to search for food and their nutrient details in real time. 

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

1. Clone this project by `git clone git@github.com:Thearith/Holmusk-Backend-Challenge.git`. After that, run `npm install` to install all npm libraries and dependencies.
2. Download [Elasticsearch](https://www.elastic.co/downloads/elasticsearch). Unzip the folder and run `bin/elasticsearch` to run the elasticsearch server on your machine.
3. Run `sails lift` to start the localhost server.  Visit [http://localhost:1337](http://localhost:1337).  (**Note**: The database is hosted on [mongolab](https://mlab.com/home). If you encounter an error while running `sails lift`, please rerun `sails lift` as this is caused by connection problems to mongolab)
4. Run `npm run seed-search` and wait for a while. This will scrape 2000 foods from [myfitnesspal](https://www.myfitnesspal.com/) and will save all the foods' titles to elasticsearch for future searches. 
5. There is no need to setup the local database or to seed the database as I have already hosted it on mongolab and seeded the database with scraped food details.
5. Enjoy Holmusk Daily!


## Tech stacks


### Framework
1. [Sails.js](http://sailsjs.org/)

### Frontend stack
1. [React.js](https://facebook.github.io/react/)
2. [Material](http://materializecss.com/) (UI library based on Material Design)

### Stack for web crawling
1. [request](https://github.com/request/request) (for handling GET and POST requests)
2. [Bluebird's promise](http://bluebirdjs.com/docs/getting-started.html) (for handling Javascript asynchronous calls)
3. [request-promise](https://github.com/request/request) (request + promise)
4. [cheerio](https://github.com/cheeriojs/cheerio) (receive a raw HTMLString and convert it so that we can do DOM traversal using familar JQuery calls)

### Database
1. [sails-mongo](https://www.npmjs.com/package/sails-mongo)

The MongoDB database is hosted in mongolab. To connect to the database using mongo shell:

`mongo ds025752.mlab.com:25752/holmusk-daily -u <dbuser> -p <dbpassword>` where dbuser = `holmusk` and dbpassword = `holmusk1234`.
The table's name is `food`.





