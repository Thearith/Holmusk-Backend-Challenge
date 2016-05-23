var elasticsearch = require("../../search/elasticsearch");

module.exports = {

  "suggestFoods": function(input) {
    return elasticsearch.getSuggestions(input);
  },

  "addFoodToSearch": function(food) {
    return elasticsearch.addFood(food);
  }

}