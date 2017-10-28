var MapModel = function () {
  var locations = ko.observableArray([
  {name: 'Red Roaster', lat:50.821149, lng:-0.1361460000000534},
  {name: 'La Mucca Nera', lat:50.8207471, lng:-0.13421779999998762},
  {name: 'Starbucks', lat:50.820873, lng:-0.13498470000001817}
]);
  this.locations = locations;
};

var ViewModel = function () {
  var map;
  console.log('hello' + MapModel.locations().length);
  this.loadmap = function () {
    //load ths script
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCRZhDuPRPkI-pUsZ30M-0H4yoXiIy2Nss&format=png+maptype=roadmap&style=feature:poi%7Cvisibility:off")
    //if successful...
    .done(function(){
      //draw the map!
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.8207025,lng: -0.1353432},
        zoom: 18,
        //hiding the map layer function for aesthetic reasons
        mapTypeControl: false,
      });
      //if unsuccessful we can't proceed, so alert user there's been an issue with the server
    }).fail(function() {
      alert("the google map servers are down at the moment, please try again later.");
    });
  };
  this.loadmarkers = function(map) {
    for (var i = 0; i < this.locations.length; i){
      var location = this.locations[i];
      console.log(location);
      var marker = new google.maps.Marker({
        position: {lat:location[1],lng:location[2]},
        map: map,
        title: location[0]
      });
    }
  };
this.loadmap();
this.loadmarkers();
};


ko.applyBindings(new MapModel());
ko.applyBindings(new ViewModel());
