import should from 'should';
import { getFoodLinksFromPage, getFood } from '../../../scrape/scrape.js';

describe('scrape', function() {

  describe('#getFoodLinksFromPage()', () => {
    it('should scrape 20 food links from this url', (done) => {

      const pageUrl = 'http://www.myfitnesspal.com//nutrition-facts-calories/generic/1';
      const expectedFoodLinks = [
        'http://www.myfitnesspal.com/food/calories/1008',
        'http://www.myfitnesspal.com/food/calories/1024',
        'http://www.myfitnesspal.com/food/calories/1043',
        'http://www.myfitnesspal.com/food/calories/1070',
        'http://www.myfitnesspal.com/food/calories/1072',
        'http://www.myfitnesspal.com/food/calories/1113',
        'http://www.myfitnesspal.com/food/calories/1139',
        'http://www.myfitnesspal.com/food/calories/1140',
        'http://www.myfitnesspal.com/food/calories/1169',
        'http://www.myfitnesspal.com/food/calories/4025',
        'http://www.myfitnesspal.com/food/calories/4027',
        'http://www.myfitnesspal.com/food/calories/4028',
        'http://www.myfitnesspal.com/food/calories/4029',
        'http://www.myfitnesspal.com/food/calories/4034',
        'http://www.myfitnesspal.com/food/calories/4106',
        'http://www.myfitnesspal.com/food/calories/4513',
        'http://www.myfitnesspal.com/food/calories/4514',
        'http://www.myfitnesspal.com/food/calories/4515',
        'http://www.myfitnesspal.com/food/calories/4516',
        'http://www.myfitnesspal.com/food/calories/4530'
      ];
      expectedFoodLinks.sort();

      getFoodLinksFromPage(pageUrl)
        .then((foodLinks) => {
          foodLinks.should.be.an.Array;
          foodLinks.length.should.eql(20);

          foodLinks.sort();
          foodLinks.should.eql(expectedFoodLinks);

          done();
        })

    });
  });

  describe('#getFood()', () => {
    it('should scrape food details from the food url', (done) => {
      const foodUrl = 'http://www.myfitnesspal.com/food/calories/4034';

      // After taken from the actual url
      const expectedFoodDetails = {
        title: 'Oil, soybean, salad or cooking, (partially hydrogenated)',
        hashCode: 502526504,
        link: 'http://www.myfitnesspal.com/food/calories/4034',
        serving: '1 tbsp',
        calories: '53',
        totalFat: '2 g',
        saturated: '1 g',
        polyunsaturated: '0 g',
        monounsaturated: '0 g',
        trans: '0 g',
        cholesterol: '0 mg',
        sodium: '4 mg',
        potassium: '25 mg',
        totalCarbs: '7 g',
        dietaryFiber: '1 g',
        sugars: '5 g',
        protein: '2 g',
        vitaminA: '0%',
        vitaminC: '5%',
        calcium: '4%',
        iron: '0%'
      };

      getFood(foodUrl)
        .then((food) => {

          food.title.should.eql(expectedFoodDetails.title);
          food.hashCode.should.eql(expectedFoodDetails.hashCode);
          food.serving.should.eql(expectedFoodDetails.serving);
          food.calories.should.eql(expectedFoodDetails.calories);
          food.totalFat.should.eql(expectedFoodDetails.totalFat);
          food.saturated.should.eql(expectedFoodDetails.saturated);
          food.polyunsaturated.should.eql(expectedFoodDetails.polyunsaturated);
          food.monounsaturated.should.eql(expectedFoodDetails.monounsaturated);
          food.trans.should.eql(expectedFoodDetails.trans);
          food.cholesterol.should.eql(expectedFoodDetails.cholesterol);
          food.sodium.should.eql(expectedFoodDetails.sodium);
          food.cholesterol.should.eql(expectedFoodDetails.cholesterol);
          food.potassium.should.eql(expectedFoodDetails.potassium);
          food.totalCarbs.should.eql(expectedFoodDetails.totalCarbs);
          food.dietaryFiber.should.eql(expectedFoodDetails.dietaryFiber);
          food.sugars.should.eql(expectedFoodDetails.sugars);
          food.protein.should.eql(expectedFoodDetails.protein);
          food.vitaminA.should.eql(expectedFoodDetails.vitaminA);
          food.vitaminC.should.eql(expectedFoodDetails.vitaminC);
          food.calcium.should.eql(expectedFoodDetails.calcium);
          food.iron.should.eql(expectedFoodDetails.iron);

          done();

        });


    });

  });


})