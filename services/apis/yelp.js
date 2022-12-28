require('dotenv').config();
const axios = require('axios');
// const { selectCategory } = require('../select_category');

const callYelp = (taskString, user) => {
  console.log('taskString', taskString);
  console.log('Got the user info!', user);
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
      const businessName = res.data.businesses[0].name.toLowerCase();
      const categories = res.data.businesses[0].categories;

      console.log('RESPONSE BUSINESS NAME', res.data.businesses[0].name.toLowerCase());
      console.log('RESPONSE CATEGORIES', res.data.businesses[0].categories);

      return categories;

      // let category = null;

      // check for business name match
      // if (taskString.includes(businessName)) {
      //   console.log('YES name matches!');

      //   category = 'eat'

      //   console.log('Results if business name matches:', category)
      //   return category
      // }

      // for (const cat of categories) {
      //   console.log('Yelp, Before running through selectCategory function..', category)
      //   console.log('Yelp alias:', cat.alias)

      //   category = selectCategory(cat.alias);

      //   console.log('After:', category);

      //   if (category) {
      //     return category;
      //   }
      // }

      // return category;
    })
    .catch(err => console.error(err));

};

// const user = {
//   location: 'vancouver'
// };

// callYelp("keyboard", user);

module.exports = { callYelp };
