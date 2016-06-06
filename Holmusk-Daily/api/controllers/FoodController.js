/**
 * FoodController
 *
 * @description :: Server-side logic for managing foods
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /*******************************************
  * IMPORTANT API ENDPOINTS
  ********************************************/


  // Suggest foods based on param search "q"
  // Return a list of ten results, each of which contains a food title and id

  suggestFoods: (req, res) => {
    const input = req.params.q;

    FoodService.suggestFoods(input)
      .then((searchResult) => {
        if(searchResult == undefined || searchResult == null) {
          res.json(404, { error: err });
        } else {
          searchResult = searchResult.foodsSuggested[0].options
            .map(result => result.text)
            .map((result) => {
              const splits = result.split("\\");
              return {
                id: splits[0],
                title: splits[1]
              };
            });

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
        res.json(200, { title: savedFood.title });
        FoodService.addFoodToSearch(savedFood);
      })
      .catch((err) => {
        res.json(404, {
          msg: 'Food cannot be created',
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
        res.send(200, {
          msg: `${foods.length} foods have been saved to database`
        });
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
    hash = req.param('hash');

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
  }

};

