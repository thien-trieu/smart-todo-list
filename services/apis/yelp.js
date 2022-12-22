require('dotenv').config();
const axios = require('axios');

const callYelp = (taskString, user) => {
  const queryString = taskString.split(' ').join('%20');

  axios.get(`https://api.yelp.com/v3/businesses/search?location=${user.location}&term=${taskString}&radius=40000&&sort_by=best_match&limit=20`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `BEARER ${process.env.YPAPPKEY}`,
      }
    })
    .then(response => {
      const businessName = response.data.businesses[0].name.toLowerCase()

      if (businessName.includes(taskString)){
        console.log('YES')
      }

      console.log('RESPONSE BUSINESS NAME', response.data.businesses[0].name.toLowerCase());
      console.log('RESPONSE CATEGORIES', response.data.businesses[0].categories)

    })
    .catch(err => console.error(err));

};

const user = {
  location: 'vancouver'
};

callYelp("dominos", user);

module.exports = { callYelp };
