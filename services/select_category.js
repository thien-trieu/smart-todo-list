const selectCategory = (taskString) => {
  const input = taskString.toLowerCase()

  let category = null;

  if (
    input.includes('watch') ||
    input.includes('film') ||
    input.includes('movie') ||
    input.includes('tv') ||
    input.includes('episode')
  ) {
    category = 'to_watch'
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
    input.includes('brunch')
  ) {
    category = 'to_eat'
  } else if (
    input.includes('read') ||
    input.includes('book') ||
    input.includes('novel') ||
    input.includes('article') ||
    input.includes('report') ||
    input.includes('textbook')
  ) {
    category = 'to_read'
  } else if (
    input.includes('buy') ||
    input.includes('purchase') ||
    input.includes('shopping') ||
    input.includes('store') ||
    input.includes('report') ||
    input.includes('textbook')
  ) {
    category = 'to_buy'
  }
  console.log(category)
  return category
}

selectCategory('go for some sushi')
