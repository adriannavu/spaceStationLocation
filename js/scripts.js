$(document).ready(function() {
  console.log('scripts loaded');

  var url = 'http://api.open-notify.org/iss-now.json';
  var lat = '';
  var lon = '';
  var local = '';
  var country = '';
  var data = [];
  var html = '';

  window.setInterval(function() {
    // use space station API to get longitude and latitude coordinates
    $.ajax({
      type: 'GET',
      url: url,
      data: data,
      dataType: 'json',
      async: true,
      success: function(data) {
        console.log(data);
        lat = data.iss_position.latitude;
        lon = data.iss_position.longitude;
        // use geocoding API to convert coordinates to city and country
        $.ajax({
          type: 'GET',
          url: 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lon,
          data: data,
          dataType: 'json',
          async: true,
          success: function(data) {
            try {
              console.log(data);

              if ('town' in data.address) {
                console.log('town exists');
                local = data.address.town;
              } else if ('city' in data.address) {
                console.log('local = city');
                local = data.address.city;
              } else if ('village' in data.address) {
                console.log('local = village');
                local = data.address.village;
              } else if ('county' in data.address) {
                console.log('local = county');
                local = data.address.county;
              } else if ('state' in data.address) {
                console.log('local = state');
                local = data.address.state;
              }
              if ('country' in data.address) {
                country = data.address.country;
              }
              html = '<p>The space station is currently over ' + local + ', ' + country + '.</p>';
            } //end of try
            catch (e) {
              html = '<p>The space station is currently over an ocean.</p>';
            } //end of catch
            $('#results').html(html);
          } //end of inner success
        }); //end of innter ajax
      }, //end of outer success
      error: function(errorMsg) {
        alert('Could not retrieve coordinates of ISS');
      }
    }); //end of outer ajax
  }, 5000); // update every 5 seconds
});