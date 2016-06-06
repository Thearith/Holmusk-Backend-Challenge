import ElasticSearchModule from "../../search/elasticSearch";
import getHashCode from "../../helper/helper";

module.exports = {
  suggestFoods: input => ElasticSearchModule.getSuggestions(input),
  addFoodToSearch: food => ElasticSearchModule.addFood(food),
  hashCode: title => getHashCode(title)
};