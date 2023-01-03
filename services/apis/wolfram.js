const convert = require('xml-js');
const axios = require('axios');

const callWolfram = (taskString) => {
  const queryString = taskString.split(' ').join('+');

  return axios.get(`http://api.wolframalpha.com/v2/query?input=${queryString}&appid=${process.env.WFAPPKEY}`)
    .then((response) => {
      const xmlToJson = convert.xml2json(response.data);
      const dataObj = JSON.parse(xmlToJson);
      const dataTypes = dataObj.elements[0].attributes.datatypes;

      if (dataTypes.includes('ExpandedFood')) return 'buy';

      if (dataTypes.includes('Book')) return 'read';

      if (dataTypes.includes('ConsumerProductsPTE')) return 'buy';

      if (dataTypes.includes('Movie')) return 'watch';

      if (dataTypes.includes('Invention')) return 'buy';

      return null;
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {  callWolfram };
