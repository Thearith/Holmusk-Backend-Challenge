import Sails from 'sails';
import ElasticSearch from '../search/elasticSearch';

before((done) => {
  Sails.lift({
    log: {
      level: 'error'
    }
  }, (err, server) => {
    if (err)
      return done(err);

    ElasticSearch.initializeElasticSearch();
    done(err, Sails);
  });
});

after((done) => {
  // here you can clear fixtures, etc.
  ElasticSearch.deleteIndex();
  Sails.lower(done);
});