const axios = require('axios');

const callYelp = (taskString, user) => {
  const queryString = taskString.split(' ').join('%20');


  console.log('QUERY STRING', queryString);

  // const options = {
  //   headers: {
  //     accept: 'application/json',
  //     Authorization: 'jI8tcWkGvSze503qbpZDTTcX03EOu_WQQTM6_szO8eItEuBqCdSr-Y8Mu51KSkjqElalp0EqHcKxRA6Zs_cwUsCvK6Ww0tkr9lANZcGqvOfflxtbPPbrRe0hkUKjY3Yx'
  //   }
  // };

  // https://api.yelp.com/v3/businesses/search?latitude=51.04553&longitude=-114.073129&term=Bridgette%20Bar&sort_by=best_match&limit=20

  axios.get(`https://api.yelp.com/v3/businesses/search?location=${user.location}&term=${taskString}&sort_by=best_match&limit=20`,
    {
      headers: {
        Authorization: `BEARER ${process.env.YPAPPKEY}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => console.log('RESPONSE', response))
    .catch(err => console.error(err));

};

const user = {
  location: 'vancouver'
};

callYelp('miku', user);

module.exports = { callYelp };
