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

  "suggestFoods": function(req, res) {
    input = req.params.q;

    FoodService.suggestFoods(input)
      .then(function(searchResult) {
        if(searchResult == undefined || searchResult == null)
          res.json(404, {error: err});

        results = [];

        // map() is better but I don't want to install underscore.js just for this
        searchResult.foodsSuggested[0].options.forEach(function(result, index){
          resultText = result.text;
          splits = resultText.split("\\");
          results.push({
            id: splits[0],
            title: splits[1]
          })
        });

        res.json(200, {length: results.length, results: results});
      })
      .catch(function(err) {
        res.json(404, {error: err});
      })
  },


  // Find food based on id
  // Return a single food object

	"findFood": function(req, res) {
    id = req.params.id;

    Food.findOne({
      id: id
    })
      .then(function(food) {
        if(food == undefined || food == null) {
          res.json(404, {msg: 'Food with id ' + id + ' is not found'});
        } else {
          res.json(200, {food: food});
        }
      })
      .catch(function(err) {
        res.json(404, {msg: 'Food with id' + id + ' is not found', error: err});
      });
  },


  // Overriding create's blueprint method
  // After adding food to database, add food to elasticsearch as well for future search

  "create": function(req, res) {
    food = req.body;
    food.hashCode = FoodService.hashCode(food.title);

    Food.create(food)
      .then(function(savedFood) {
        res.json(200, {title: savedFood.title});
        FoodService.addFoodToSearch(savedFood);
      })
      .catch(function(err) {
        res.json(404, {msg: 'Food cannot be created', error: err});
      });
  },


  /*******************************************
  * OPTIONAL API ENDPOINTS
  ********************************************/

  // Return all foods in database

  "getAllFoods": function(req, res) {
    Food.find()
      .then(function(foods) {
        res.json(200, {
          foods: foods,
          length: foods.length
        });
      })
      .catch(function(err) {
        res.json(404, {msg: 'There are no foods in the database', error: err});
      })
  },


  // Adding an array of foods to database
  // Used just to seed dbs with a list of foods

  "createFoods": function(req, res) {
    foods = req.body
    Food.create(foods)
      .then(function(foods) {
        res.send(200, {msg: foods.length + " foods have been saved to database"});
      })
      .catch(function(err) {
        res.json(404, {msg: "Cannot save " + foods.length + " to database", error: err});
      })
  },


  // Return food's id by using the food's link
  // Used to seed elasticsearch

  "findFoodByHashCode": function(req, res) {
    hash = req.params.hash;

    Food.findOne({
      hashCode: hash
    })
    .then(function(food) {
      if(food == undefined || food == null) {
        res.json(404, {msg: 'Food with hash code ' + hash + ' is not found'});
      } else {
        res.json(200, {id: food.id});
      }
    })
    .catch(function(err) {
      res.json(404, {msg: 'Food with hash code ' + hash + ' is not found', error: err})
    })
  }

};

