var scrape = require('./scrape.js');
var fs = require('fs');

scrape(function(foodsJSON) {

  fs.writeFile('./scrape/foods.json', JSON.stringify(foodsJSON), function(err){
    console.log('\n\nFile successfully written! - Check inside /scrape folder for foods.json file\n');
  })

});