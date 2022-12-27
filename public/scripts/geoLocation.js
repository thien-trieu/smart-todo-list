$(document).ready(function()  {

  // const locationStatus = $('.locationStatus');

  navigator.geolocation.getCurrentPosition((userPosition) => {
    console.log(userPosition);
    const latitude = userPosition.coords.latitude;
    const longitude = userPosition.coords.longitude;
    console.log(`Latitude is ${latitude} and Longitude is ${longitude}`);

    const geolocationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    $.get(geolocationUrl, (data) => {
      $('.locationStatus').text(data.city);
      console.log(`Your current city is ${data.city}`);
    }, 'json')

  }, ()  =>  {
    $('.locationStatus').text("Unable to automatically update your location.")
  });




  })

//   // function script to find user's general location
// const findUserLocation = () => {

//   // const locationStatus = document.querySelector('.locationStatus');




//   // uses "Big Data Cloud" free location API and passes in the user's latitude and longitude
//   const geolocationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

// // Fetches the geo data using the API URL above in JSON format
  // fetch(geolocationUrl)
  // .then(res => res.json())
  // .then(data => {
  //   locationStatus.textContent = data.city;
  //   console.log(`Your current city is ${data.city}`);
  // });

//   };



// const error = ()  =>  {
//   locationStatus.textContent = "Unable to locate your location.";
// }


// }

// document.querySelector('.find-city').addEventListener('click', findUserLocation);

// })


