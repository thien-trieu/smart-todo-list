// This script handles automatic collection of location data when browser user accepts it.
// It then passes the lat and long through a free API big data cloud to return the current city
$(document).ready(function()  {

  navigator.geolocation.getCurrentPosition((userPosition) => {
    console.log(userPosition);
    const latitude = userPosition.coords.latitude;
    const longitude = userPosition.coords.longitude;
    console.log(`Latitude is ${latitude} and Longitude is ${longitude}`);

    const geolocationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    $.get(geolocationUrl, (data) => {
      $('.locationStatus').text(data.city);
      console.log(`Your current city is ${data.city}`);
      $('#locationField').val(data.city);
    }, 'json')

  }, ()  =>  {
    $('#locationField').attr("placeholder", "Type your City here")
  });

  })



