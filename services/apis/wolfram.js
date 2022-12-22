const convert = require('xml-js');
const axios = require('axios');

const callWolfram = (taskString) => {
  const queryString = taskString.split(' ').join('+');

  return axios.get(`http://api.wolframalpha.com/v2/query?input=${queryString}&appid=${process.env.WFAPPKEY}`)
    .then((response) => {
      console.log('AXIOS RESPONSE', response.data);
      const xmlToJson = convert.xml2json(response.data);
      const dataObj = JSON.parse(xmlToJson);
      console.log('dataObj', dataObj);
      return dataObj.elements[0].attributes.datatypes;
    }
    )
    .catch((error) => {
      console.log(error);
    });
};



module.exports = {  callWolfram };