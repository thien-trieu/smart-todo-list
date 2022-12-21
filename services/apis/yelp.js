const axios = require('axios');

const options = {
  headers: {
    accept: 'application/json',
    Authorization: 'jI8tcWkGvSze503qbpZDTTcX03EOu_WQQTM6_szO8eItEuBqCdSr-Y8Mu51KSkjqElalp0EqHcKxRA6Zs_cwUsCvK6Ww0tkr9lANZcGqvOfflxtbPPbrRe0hkUKjY3Yx'
  }
};

axios.get('https://api.yelp.com/v3/businesses/search?latitude=51.04553&longitude=-114.073129&term=Bridgette%20Bar&sort_by=best_match&limit=20', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));


  51.045530, -114.073129
