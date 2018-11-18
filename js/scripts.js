$(document).ready(function() {
  console.log('scripts loaded');

  var url = 'http://api.open-notify.org/iss-now.json';
  var lat = '';
  var lon = '';
  var local = '';
  var country = '';
  var data = [];
  var html = '';
  var myMap = L.map('mapid').setView([0, 0], 3);
  //map circle
  var circle = L.circle([lat, lon], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.3,
    radius: 2000000
  }).addTo(myMap);
  //map icon
  var ISSIcon = L.icon({
    iconUrl: './img/issicon.png',
    iconSize: [50, 30]
  });
  var iss = L.marker([0, 0], {
    icon: ISSIcon
  }).addTo(myMap);

  function moveISS() {
    //Initialize map
    $.ajax({
      type: 'GET',
      data: data,
      url: url,
      dataType: 'json',
      async: true,
      success: function(data) {
        lat = data.iss_position.latitude;
        lon = data.iss_position.longitude;
        myMap.panTo([lat, lon], animate = true);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.satellite',
          accessToken: 'pk.eyJ1IjoiYWR2dSIsImEiOiJjam4zdDVlOGQyeGpxM2tvMmphOGJxYW1lIn0.gtW-IChpLU7NKuoe2SPt8w'
        }).addTo(myMap);
        //set new circle and iss icon coordinates
        circle.setLatLng([lat, lon]);
        iss.setLatLng([lat, lon]);
      },
      error: function(errorMsg) {
        console.log("Unable to create map");
      }
    });
    //use space station API to get current latitude and longitude
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
        //use geocoding API to reverse geocode
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
        console.log('Could not retrieve coordinates of ISS');
      }
    }); //end of outer ajax
    setTimeout(moveISS, 5000);
  } //end of moveISS()
  moveISS();
});