require('dotenv').config();
const axios = require('axios');
const { selectCategory } = require('../select_category')

const callYelp = (taskString, user) => {
  const queryString = taskString.split(' ').join('%20');
  const location = user.location.split(' ').join('%20')

  console.log('QUERY STRING', queryString);

  axios.get(`https://api.yelp.com/v3/businesses/search?location=${location}&term=${queryString}&radius=40000&&sort_by=best_match&limit=20`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `BEARER ${process.env.YPAPPKEY}`,
      }
    })
    .then(response => {
      const businessName = response.data.businesses[0].name.toLowerCase();
      const categories = response.data.businesses[0].categories

      if (businessName.includes(taskString)) {
        console.log('YES');
      }

      console.log('RESPONSE BUSINESS NAME', response.data.businesses[0].name.toLowerCase());
      console.log('RESPONSE CATEGORIES', response.data.businesses[0].categories);


      let result = ""
      for (const category of categories){

        result = selectCategory(category.alias)

      }
      console.log('SELECT CAT RESULT', result)
    })
    .catch(err => console.error(err));

};

const user = {
  location: 'las vegas'
};

callYelp("get bananas", user);

module.exports = { callYelp };
