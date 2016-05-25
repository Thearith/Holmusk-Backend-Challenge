var elasticsearch = require("../../search/elasticsearch");
var helper = require("../../helper/helper");

module.exports = {

  "suggestFoods": function(input) {
    return elasticsearch.getSuggestions(input);
  },

  "addFoodToSearch": function(food) {
    return elasticsearch.addFood(food);
  },

  "hashCode": function(title) {
    return helper.hashCode(title);
  }

}