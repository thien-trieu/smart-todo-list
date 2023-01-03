require('dotenv').config();
const axios = require('axios');

const callYelp = (taskString, user, callback) => {
  const queryString = taskString.split(' ').join('%20');
  const location = user.location.split(' ').join('%20');

  return axios.get(`https://api.yelp.com/v3/businesses/search?location=${location}&term=${queryString}&radius=40000&&sort_by=best_match&limit=20`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `BEARER ${process.env.YPAPPKEY}`,
      }
    })
    .then(res => {
      console.log('SELECT_CATEGORY FUNC:', queryString);
      if (res.data.businesses.length) {
        const categories = res.data.businesses[0].categories;
        console.log('YELP CATEGORIES:', categories);

        for (const category of categories) {
          const result = callback(category.alias);
          if (result) return result;
        }
      }

      return null;
    })
    .catch(err => console.error(err));
};


module.exports = { callYelp };
