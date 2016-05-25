var request = require('supertest');
var should    = require("should");

describe('FoodController', function(){

  describe("#homepage", function() {
    it('should be able to go to homepage', function(done) {
      request(sails.hooks.http.app)
        .get('/')
        .expect(200, done);
    });
  });

  describe("#findFood()", function(){

    it('returns food based on :id', function (done) {
      var id = "5746175b2bf02d81709e7a44";
      var expectedTitle = "Potatoes, mashed, dehydrated, prepared from flakes without milk, whole milk and butter added";
      var expectedLink = "http://www.myfitnesspal.com/food/calories/11379";

      request(sails.hooks.http.app)
        .get('/food/' + id)
        .expect(200)
        .end(function(err,res) {
          if(err)
            return done(err);

          res.body.food.title.should.equal(expectedTitle);
          res.body.food.link.should.equal(expectedLink);
          done();

        });

    });

    it('returns nothing as id does not exist in db', function (done) {
      var randomId = "some_random_id";

      request(sails.hooks.http.app)
        .get('/food/' + randomId)
        .expect(404, {
          msg: "Food with id " + randomId + " is not found"
        }, done);

    });

  });

  // describe("#create()", function() {
  //   it('should create food and save it to elasticsearch', function(done) {
  //     var randomTitle = "zIfldafdiekx";
  //     var food = {
  //       "title": randomTitle,
  //       "link": "http://www.myfitnesspal.com/food/calories/11379",
  //       "serving": "1 cup",
  //       "calories": "1,919",
  //       "totalFat": "119 g",
  //       "saturated": "69 g",
  //       "polyunsaturated": "5 g",
  //       "monounsaturated": "21 g",
  //       "trans": "0 g",
  //       "cholesterol": "0 mg",
  //       "sodium": "12,136 mg",
  //       "potassium": "4,968 mg",
  //       "totalCarbs": "249 g",
  //       "dietaryFiber": "32 g",
  //       "sugars": "24 g",
  //       "protein": "72 g",
  //       "vitaminA": "83%",
  //       "vitaminC": "1,172%",
  //       "calcium": "38%",
  //       "iron": "55%",
  //       "hashCode": "12344545"
  //     };

  //     request(sails.hooks.http.app)
  //       .post('/food')
  //       .send(food)
  //       .expect(200, {
  //         title: randomTitle
  //       }, done);
  //   })
  // });

  describe("#suggestFood()", function() {
    it('should return a list of autocomplete foods with title and id based on search input', function(done) {
      var searchInput = "Milk";
      var expectedLength = 2;
      var expectedSearchList = ["Milk Rolls", "Milk dessert, frozen, milk-fat free, chocolate"];

      request(sails.hooks.http.app)
        .get('/search/' + searchInput)
        .expect(200)
        .end(function(err, res) {
          if(err)
            return done(err);

          res.body.length.should.equal(expectedLength);
          res.body.results.should.be.an.Array;

          var results = res.body.results;
          var resultTitles = [];
          for(i=0; i<results.length; i++)
            resultTitles[i] = results[i].title;

          resultTitles.should.eql(expectedSearchList);

          done();

        });

    });

    it('should return an empty list for random search input', function(done) {
      var randomSearchInput = "Zsereaiuxzlkj";
      var expectedJSON = {
        "length": 0,
        "results": []
      };

      request(sails.hooks.http.app)
        .get('/search/' + randomSearchInput)
        .expect(200, expectedJSON, done);

    })

  });

})