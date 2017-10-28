





// Call the Google Maps API, and when loaded, load up the map
$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCRZhDuPRPkI-pUsZ30M-0H4yoXiIy2Nss&format=png+maptype=roadmap&style=feature:poi%7Cvisibility:off', function() {
    var myStyles =[
      {
        "featureType": "poi",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ];
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 50.8207025,
            lng: -0.1353432
        },
        zoom: 18,
        mapTypeControl: false,
        styles: myStyles
    });

    var locations = [
      ['Red Roaster', 50.821149, -0.1361460000000534],
      ['La Mucca Nera', 50.8207471, -0.13421779999998762],
      ['Starbucks', 50.820873, -0.13498470000001817]
    ];

    function addMarkers(map) {
      for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        console.log(location);
        var marker = new google.maps.Marker({
          position: {lat:location[1],lng:location[2]},
          map:map,
          title: location[0]
        });
      }
    }
    addMarkers(map);
});
