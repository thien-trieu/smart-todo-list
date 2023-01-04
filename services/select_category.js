const { callWolfram } = require('./apis/wolfram');
const { callYelp } = require('./apis/yelp');
const { callImdb } = require('./apis/rapidapi_imdb');
const { getUserById } = require('../db/queries/users');

// BASIC 'selectCategory' function that will filter out key words to categorize the TODO item's string
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
    input.includes('soup') ||
    input.includes('breakfast') ||
    input.includes('sushi') ||
    input.includes('cafes') ||
    input.includes('bakery') ||
    input.includes('bakeries') ||
    input.includes('lunch') ||
    input.includes('salad') ||
    input.includes('brunch') ||
    input.includes('pizza') ||
    input.includes('sandwiches') ||
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

// function which calls the BASIC 'selectCategory' first, if category is 'null' it will then call APIs
const selectCategoryWithApi = (taskString, userId) => {
  const input = taskString.toLowerCase();
  const category = selectCategory(input);

  if (category) return Promise.resolve(category);
  // if category is null, start calling APIs
  return callWolfram(input)
    .then(res => {
      console.log('WOLFRAM:', res);
      if (res) return res;

      return callImdb(input).then(res => {
        console.log('IMDB:', res);
        if (res) return res;

        return getUserFromDB(userId)
          .then(user => {
            return callYelp(input, user, selectCategory)
              .then(res => {
                console.log('YELP:', res);
                if (res) return res;
                // After checking all APIs if category is still 'null', set category as 'uncategorized'
                return 'uncategorized';
              });
          });
      });
    });
};

const getUserFromDB = (userId) => {
  return getUserById(userId)
    .then(user => {
      console.log('USER:', user);
      return user;
    });
};

module.exports = { selectCategory, selectCategoryWithApi };
