var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.820695, lng: -0.135375},
    zoom: 19
  });
}
initMap();
