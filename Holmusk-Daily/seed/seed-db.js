import RequestPromise from 'request-promise';
import request from 'request';
import streamify from 'stream-array';

// Constants
const LOCALHOST               = 'http://localhost:1337';
const HOSTED_URL              = 'http://holmusk-daily-63927.onmodulus.net';
const POSTING_ENDPOINT        = '/foods';
const DELETING_ENDPOINT       = '/initFoods';

const foodPostUrl = process.env.NODE_ENV === 'production'
  ? HOSTED_URL + POSTING_ENDPOINT
  : LOCALHOST + POSTING_ENDPOINT;

const deleteFoodsUrl = process.env.NODE_ENV === 'production'
  ? HOSTED_URL + DELETING_ENDPOINT
  : LOCALHOST + DELETING_ENDPOINT;



// Delete all foods in database

function initializeFoodsInDatabase() {
  const userId = process.env['ADMIN'];
  const password = process.env['PASSWORD'];

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      uri: deleteFoodsUrl,
      body: {
        user: userId,
        password: password
      },
      json: true
    };

    RequestPromise(options)
      .then((res) => {
        if(res.error) {
          reject(res.error);
        } else {
          console.log('\n' + res.msg);
          resolve();
        }
      })
      .catch(err => reject(err));
  })
}


// Post foods, use stream to reduce memory foodprint

function postFoods(foods) {

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      uri: foodPostUrl,
      body: foods,
      json: true
    };

    // streamify(foods).pipe(
    //   request(options)
    //     .on('body', body => console.log(body.msg))
    //     .on('end', () => resolve())
    //     .on('error', err => reject(err)));

    RequestPromise(options)
      .then(res => resolve(res.msg))
      .catch(err => reject(err));
  });
}


/*
**********************************************************************
************************** Export module *****************************
**********************************************************************
*/

const SeedDB = {
  initializeFoodsInDatabase,
  postFoods
};

export default SeedDB;