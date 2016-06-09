import request from 'supertest';
import should from 'should';

describe('FoodController', () => {

  describe('#homepage', () => {
    it('should be able to go to homepage', (done) => {
      request(sails.hooks.http.app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('#findFood()', () => {

    before((done) => {

      Food.create({
        id: 1,
        title: 'Apple',
        link: 'http://www.myfitnesspal.com/food/stub-file'
      })
        .then(() => done());
    });

    it('returns food based on :id', (done) => {
      const id = 1;
      const expectedTitle = 'Apple';
      const expectedLink = 'http://www.myfitnesspal.com/food/stub-file';

      request(sails.hooks.http.app)
        .get('/food/' + id)
        .expect(200)
        .end((err,res) => {

          if(err)
            return done(err);

          res.body.food.title.should.equal(expectedTitle);
          res.body.food.link.should.equal(expectedLink);

          done();
        });
    });

    it('returns nothing as id does not exist in db', (done) => {
      const randomId = "some_random_id";

      request(sails.hooks.http.app)
        .get('/food/' + randomId)
        .expect(404, {
          msg: "Food with id " + randomId + " is not found"
        }, done);
    });

    after((done) => {
      Food.destroy()
        .then(() => done());
    });

  });

  describe('#create()', () => {

    it('should create food and save it to elasticsearch', (done) => {
      const randomTitle = "zIfldafdiekx";
      const food = {
        'title': randomTitle,
        'link': 'http://www.myfitnesspal.com/food/calories/11379',
        'serving': '1 cup',
        'calories': '1,919',
        'totalFat': '119 g',
        'saturated': '69 g',
        'polyunsaturated': '5 g',
        'monounsaturated': '21 g',
        'trans': '0 g',
        'cholesterol': '0 mg',
        'sodium': '12,136 mg',
        'potassium': '4,968 mg',
        'totalCarbs': '249 g',
        'dietaryFiber': '32 g',
        'sugars': '24 g',
        'protein': '72 g',
        'vitaminA': '83%',
        'vitaminC': '1,172%',
        'calcium': '38%',
        'iron': '55%',
        'hashCode': '12344545'
      };

      request(sails.hooks.http.app)
        .post('/food')
        .send(food)
        .expect(200, {
          title: randomTitle
        }, done);
    });

    after((done) => {
      Food.destroy()
        .then(() => done());
    });

  });

  describe('#suggestFood()', () => {

    before((done) => {
      const foods = [
        {
          id: '1',
          title: 'Apple Pine'
        },
        {
          id: '2',
          title: 'Apple Pie'
        }
      ];

      request(sails.hooks.http.app)
        .post('/foods')
        .send(foods)
        .end((err, res) => {
          setTimeout(() => done(), 1000); // must set time out so that ElasticSearch is updated
        });
    });

    it('should return a list of autocomplete foods with title and id based on search input', (done) => {

      const searchInput = 'Apple';
      const expectedLength = 2;
      let expectedSearchList = [
        'Apple Pine',
        'Apple Pie'
      ];
      expectedSearchList.sort();
      const unexpectedTitle = 'Pine Apple';

      request(sails.hooks.http.app)
        .get('/search/' + searchInput)
        .expect(200)
        .end((err, res) => {
          if(err)
            return done(err);

          // testing the length of results
          res.body.length.should.equal(expectedLength);

          // testing the content of results
          let results = res.body.results.map(result => result.title);
          results.sort();

          results.should.be.an.Array;
          results.should.eql(expectedSearchList);

          results.should.not.containEql(unexpectedTitle);

          done();

        });

    });

    it('should return an empty list for random search input', (done) => {
      var randomSearchInput = 'random_search';
      var expectedJSON = {
        'length': 0,
        'results': []
      };

      request(sails.hooks.http.app)
        .get('/search/' + randomSearchInput)
        .expect(200, expectedJSON, done);
    });

    after((done) => {
      Food.destroy()
        .then(() => done());
    });

  });

});