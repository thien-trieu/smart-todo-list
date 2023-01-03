require('dotenv').config();
const axios = require("axios");

const callImdb = (taskString) => {
  const options = {
    method: 'GET',
    url: 'https://online-movie-database.p.rapidapi.com/title/v2/find',
    params: {title: taskString, limit: '5', sortArg: 'moviemeter,asc'},
    headers: {
      'X-RapidAPI-Key': process.env.IMDBKEY,
      'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
    }
  };

  return axios.request(options).then(function(response) {
    const titleTypes = ['movie', 'tvSeries', 'tvMiniSeries'];

    if (response.data.totalMatches > 0) {
      for (const result of response.data.results) {
        console.log('IMDB', result);
        if (titleTypes.indexOf(result.titleType) !== -1) {
          return 'watch';
        }
      }
    }

    return null;

  }).catch(function(error) {
    console.error(error);
  });
};

module.exports = { callImdb };
