const { callWolfram } = require('./apis/wolfram');
const { callYelp } = require('./apis/yelp');
const { getUserById } = require('../db/queries/users');

const selectCategory = (taskString) => {
  const input = taskString.toLowerCase();

  let category = null;

  if (
    input.includes('buy') ||
    input.includes('get') ||
    input.includes('purchase') ||
    input.includes('shopping') ||
    input.includes('grocery') ||
    input.includes('groceries') ||
    input.includes('store') ||
    input.includes('market') ||
    input.includes('cloth') ||
    input.includes('goods') ||
    input.includes('produce') ||
    input.includes('grab') ||
    input.includes('repair') ||
    input.includes('service')
  ) {
    category = 'buy';
  } else if (
    input.includes('eat') ||
    input.includes('resturant') ||
    input.includes('bar') ||
    input.includes('food') ||
    input.includes('diner') ||
    input.includes('dish') ||
    input.includes('meal') ||
    input.includes('dinner') ||
    input.includes('breakfast') ||
    input.includes('sushi') ||
    input.includes('cafes') ||
    input.includes('bakery') ||
    input.includes('bakeries') ||
    input.includes('lunch') ||
    input.includes('brunch') ||
    input.includes('pizza') ||
    input.includes('burgers')
  ) {
    category = 'eat';
  } else if (
    input.includes('read') ||
    input.includes('book') ||
    input.includes('novel') ||
    input.includes('article') ||
    input.includes('report') ||
    input.includes('textbook')
  ) {
    category = 'read';
  } else if (
    input.includes('watch') ||
    input.includes('film') ||
    input.includes('movie') ||
    input.includes('tv') ||
    input.includes('episode')
  ) {
    category = 'watch';
  }

  return category;
};

const selectCategoryWithApi = (taskString, userId) => {
  const input = taskString.toLowerCase();

  let category = selectCategory(input);


  if (category) {
    console.log('BASIC select category:', category);
    return Promise.resolve(category);
  }
  console.log('END OF BASIC SELECT CATEGORY. Now lets call API... Current Category:', category);

  if (!category) {
    return callWolfram(input)
      .then(res => {
        console.log('Wolfram Response:', res);

        if (res.includes('ExpandedFood')) {
          category = 'buy';
          console.log('Wolfram - Category Selected:', category);
          return category;
        }

        if (res.includes('Book')) {
          category = 'read';
          console.log('Wolfram - Category Selected:', category);
          return category;
        }

        if (res.includes('ConsumerProductsPTE')) {
          category = 'buy';
          console.log('Wolfram - Category Selected:', category);
          return category;
        }

        // if (res.includes('Financial')) {
        //   category = 'buy';
        //   console.log('Wolfram - Category Selected:', category);
        //   return category;
        // }

        if (res.includes('Movie')) {
          category = 'watch';
          console.log('Wolfram - Category Selected:', category);
          return category;
        }

        if (res.includes('Invention')) {
          category = 'buy';
          console.log('Wolfram - Category Selected:', category);
          return category;
        }

        if (res.includes('')) {

          console.log('DONE WITH Wolfram - Current category:', category);

          console.log('Passing user to yelp', userId);

          console.log('Time to call yelp...');

          return getUserFromDB(userId)
            .then(user => {
              return callYelp(input, user)
                .then(res => {

                  console.log('Got back the yelp categories object: ', res);
                  for (const result of res) {
                    console.log('Yelp, Before running through selectCategory function..', category);
                    console.log('Yelp alias:', result.alias);

                    category = selectCategory(result.alias);

                    console.log('After:', category);

                    if (category) {

                      console.log('Got a category: ', category);
                      return category;
                    }

                  }
                  console.log('End of Yelp loop....', category);
                  return category;
                });
            });
        }
        return category;
      });

  }
};

const getUserFromDB = (userId) => {
  return getUserById(userId)
    .then(user => {
      console.log('USER:', user);
      return user;
    });
};

module.exports = { selectCategory, selectCategoryWithApi };
