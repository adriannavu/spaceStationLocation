$(document).ready(function() {
  console.log('scripts loaded');

  var url1 = 'http://api.open-notify.org/iss-now.json';
  var url2 = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=32.7157&lon=-117.1611';
  var lat = '';
  var lon = '';
  var city = '';
  var country = '';

  // var urlArray = [url, url2];
  var data = [];
  var html = '';
  var i = '';

  window.setInterval(function() {
    // use space station API to get longitude and latitude coordinates
    $.ajax({
      type: 'GET',
      url: url1,
      data: data,
      dataType: 'json',
      async: true,
      success: function(data) {
        console.log(data);
        lat = data.iss_position.latitude;
        lon = data.iss_position.longitude;
        html += '<p>The space stations is currently over ' + lat + ', ' + lon + '</p>';
        $('#results').html(html);

        // use geocoding API to convert coordinates to city and country
        $.ajax({
          type: 'GET',
          url: 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lon,
          data: data,
          dataType: 'json',
          async: true,
          success: function(data) {
            console.log(data);
            city = data.address.city;
            country = data.address.country;
            html += '<p>The space station is currently over ' + city + ', ' + country + '.</p>';
            $('#results').html(html);

          }, //end of success
          error: function(errorMsg) {
            console.log('Space station is over ocean');
            html += '<p>The space station is currently over an ocean</p>';
            $('#results').html(html);

          } //end of error
        }); //end of ajax
      }, //end of success
      error: function(errorMsg) {
        console.log('Could not retrieve coordinates of ISS')
      }
    }); //end of ajax

  }, 5000); // update every 5 seconds

});