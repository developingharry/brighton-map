// Call the Google Maps API, and when loaded, load up the map
$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCRZhDuPRPkI-pUsZ30M-0H4yoXiIy2Nss&v=3', function() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 50.8207025,
            lng: -0.1353432
        },
        zoom: 18,
        mapTypeControl: false
    });
    var myLatlng = new google.maps.LatLng(-50.8207025,-0.1353432);
    var marker = new google.maps.Marker({
    position : myLatlng,
    title:"Hello World!"
});
marker.setMap(map);
});


// To add the marker to the map, call setMap();
