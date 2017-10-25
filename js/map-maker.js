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

    var redRoasterCoords = new google.maps.LatLng(50.821149,-0.1361460000000534);
    var redRoaster = new google.maps.Marker({
    position : redRoasterCoords,
    title:"Red Roaster"
    });

    var laMuccaNeraCoords = new google.maps.LatLng(50.8207471,-0.13421779999998762);
    var laMuccaNera = new google.maps.Marker({
    position : laMuccaNeraCoords,
    title:"La Mucca Nera"
    });
redRoaster.setMap(map);
laMuccaNera.setMap(map);
});
