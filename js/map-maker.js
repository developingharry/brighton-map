// Call the Google Maps API, and when loaded, load up the map
$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCRZhDuPRPkI-pUsZ30M-0H4yoXiIy2Nss&v=3', function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 50.820695, lng: -0.135375},
      zoom: 16,
      mapTypeControl: false
    });
});
