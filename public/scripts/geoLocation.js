// function script to find user's general location
const findUserLocation = () => {

  const locationStatus = document.querySelector('.locationStatus');


  // After user allows location data to be shared, this pulls the latitude and longitude from the userPosition and stores them in their own variables
  const success = (userPosition) => {
    console.log(userPosition);
    const latitude = userPosition.coords.latitude;
    const longitude = userPosition.coords.longitude;
    console.log(`Latitude is ${latitude} and Longitude is ${longitude}`);

  // uses "Big Data Cloud" free location API and passes in the user's latitude and longitude
  const geolocationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

// Fetches the geo data using the API URL above in JSON format
fetch(geolocationUrl)
  .then(res => res.json())
  .then(data => {
    locationStatus.textContent = data.city;
  });

  };




const error = ()  =>  {
  locationStatus.textContent = "Unable to locate your location.";
}

  navigator.geolocation.getCurrentPosition(success, error);
}

document.querySelector('.find-city').addEventListener('click', findUserLocation);
