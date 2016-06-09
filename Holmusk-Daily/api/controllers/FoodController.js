/**
 * FoodController
 *
 * @description :: Server-side logic for managing foods
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

require('dotenv').config();

module.exports = {


  /*******************************************
  * IMPORTANT API ENDPOINTS
  ********************************************/


  // Suggest foods based on param search "q"
  // Return a list of ten results, each of which contains a food title and id

  suggestFoods: (req, res) => {
    const input = req.param('q');

    FoodService.suggestFoods(input)
      .then((searchResult) => {
        if(searchResult == undefined || searchResult == null) {
          res.json(404, { error: err });
        } else {
          searchResult = searchResult.foodsSuggested[0].options
            .map(result => result.text)
            .map(text => text.split('\\'))
            .map(splits => ({
              id: splits[0],
              title: splits[1]
            }));

          res.json(200, {
            length: searchResult.length,
            results: searchResult
          });
        }
      })
      .catch((err) => {
        res.json(404, { error: err });
      });
  },


  // Find food based on id
  // Return a single food object

	findFood: (req, res) => {
    const id = req.param('id');

    Food.findOne({
      id: id
    })
      .then((food) => {
        if(food == undefined || food == null) {
          res.json(404, {
            msg: `Food with id ${id} is not found`
          });
        } else {
          res.json(200, { food: food });
        }
      })
      .catch((err) => {
        res.json(404, {
          msg: `Food with id ${id} is not found`,
          error: err
        });
      });
  },


  // Overriding create's blueprint method
  // After adding food to database, add food to elasticsearch as well for future search

  create: (req, res) => {
    let food = req.body;
    food.hashCode = FoodService.hashCode(food.title);

    Food.create(food)
      .then((savedFood) => {

        FoodService.addFoodToSearch(savedFood)
          .then(() => {
            res.json(200, { title: savedFood.title });
          })
          .catch(err => console.log(err));
      })
      .catch((err) => {
        res.json(404, {
          msg: `Food with title ${food.title} cannot be created`,
          error: err
        });
      });
  },


  /*******************************************
  * OPTIONAL API ENDPOINTS
  ********************************************/

  // Return all foods in database

  getAllFoods: (req, res) => {
    Food.find()
      .then((foods) => {
        res.json(200, {
          foods: foods,
          length: foods.length
        });
      })
      .catch((err) => {
        res.json(404, {
          msg: 'There are no foods in the database',
          error: err
        });
      })
  },


  // Adding an array of foods to database
  // Used just to seed dbs with a list of foods

  createFoods: (req, res) => {
    const foods = req.body;

    Food.create(foods)
      .then((foods) => {

        FoodService.addFoodsToSearch(foods)
          .then(() => {
            res.send(200, {
              msg: `${foods.length} foods have been saved to Database and ElasticSearch`
            });
          })
          .catch(err => console.log(err));
      })
      .catch((err) => {
        res.json(404, {
          msg: `Cannot save ${foods.length} to database`,
          error: err
        });
      })
  },


  // Return food's id by using the food's link
  // Used to seed elasticsearch

  findFoodByHashCode: (req, res) => {
    const hash = req.param('hash');

    Food.findOne({
      hashCode: hash
    })
    .then((food) => {
      if(food == undefined || food == null) {
        res.json(404, {
          msg: `Food with hash code ${hash} is not found`
        });
      } else {
        res.json(200, {
          id: food.id
        });
      }
    })
    .catch((err) => {
      res.json(404, {
        msg: `Food with hash code ${hash} is not found`,
        error: err
      });
    })
  },


  // Initialize food in Database and ElasticSearch
  // Secured for only Admin users

  initializeFoods: (req, res) => {
    const userId = req.param('user');
    const password = req.param('password');

    if(userId === process.env['ADMIN']
      && password === process.env['PASSWORD']) {

      Food.destroy()
        .then(() => FoodService.initializeElasticSearch())
        .then(() => res.send(200, {
          msg: 'All food in Database and ElasticSearch has been initialized.'
        }))
        .catch(err => console.log(err));

    } else {
      res.send({ error: 'Wrong authentication' });
    }

  }

};

