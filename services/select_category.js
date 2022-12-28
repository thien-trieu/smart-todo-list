const callWolfram = require('./apis/wolfram');

const selectCategory = (taskString) => {
  const input = taskString.toLowerCase();

  let category = null;

  if (
    input.includes('watch') ||
    input.includes('film') ||
    input.includes('movie') ||
    input.includes('tv') ||
    input.includes('episode')
  ) {
    category = 'watch';
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
    input.includes('brunch')
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
    input.includes('buy') ||
    input.includes('get') ||
    input.includes('purchase') ||
    input.includes('shopping') ||
    input.includes('grocery') ||
    input.includes('groceries') ||
    input.includes('store') ||
    input.includes('market')
  ) {
    category = 'buy';
  }

  if (!category) {
    callWolfram(input)
      .then(response => {

        // ExpandedFood
        // ConsumerProductsPTE
        // Book
        // Financial



        console.log('JSON FROM WOLFRAM', response);
      });
  }
  return category;
};

// console.log(selectCategory('pick up things at the market'))
// const wolframRes = callWolfram(req.body.newTodo)
//   .then(response => {
//     console.log('JSON FROM WOLFRAM', response);
//   });

module.exports = {  selectCategory };
