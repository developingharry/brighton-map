var bars = [];
var cafes = [];
var infowindow;
var map;
var marker;
var markers = [];
var mapScript = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCRZhDuPRPkI-pUsZ30M-0H4yoXiIy2Nss&format=png+maptype=roadmap&style=feature:poi%7Cvisibility:off";

// Initial zoom for the map, latitude and longitude for the center.
var mapSettings = {
    lat: 50.8212148,
    lng: -0.13406340000005912,
    zoom: 18,
    //this last setting hides the option to change layers
    //(map/satellite). This was an aesthetic choice for
    //menu placement.
    mapTypeControl: false,
    //I've taken the data from google's own map styling wizard and
    //minified it for the rest of the script's readability.
    styles: [{elementType:"geometry",stylers:[{color:"#ebe3cd"}]},{elementType:"labels.text.fill",stylers:[{color:"#523735"}]},{elementType:"labels.text.stroke",stylers:[{color:"#f5f1e6"}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#c9b2a6"}]},{featureType:"administrative.land_parcel",elementType:"geometry.stroke",stylers:[{color:"#dcd2be"}]},{featureType:"administrative.land_parcel",elementType:"labels.text.fill",stylers:[{color:"#ae9e90"}]},{featureType:"landscape.natural",elementType:"geometry",stylers:[{color:"#dfd2ae"}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#dfd2ae"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#93817c"}]},{featureType:"poi.business",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{color:"#a5b076"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#447530"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#f5f1e6"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#fdfcf8"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#f8c967"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#e9bc62"}]},{featureType:"road.highway.controlled_access",elementType:"geometry",stylers:[{color:"#e98d58"}]},{featureType:"road.highway.controlled_access",elementType:"geometry.stroke",stylers:[{color:"#db8555"}]},{featureType:"road.local",elementType:"labels.text.fill",stylers:[{color:"#806b63"}]},{featureType:"transit.line",elementType:"geometry",stylers:[{color:"#dfd2ae"}]},{featureType:"transit.line",elementType:"labels.text.fill",stylers:[{color:"#8f7d77"}]},{featureType:"transit.line",elementType:"labels.text.stroke",stylers:[{color:"#ebe3cd"}]},{featureType:"transit.station",elementType:"geometry",stylers:[{color:"#dfd2ae"}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#b9d3c2"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#92998d"}]}]
};

//create map variable outside mapload function
//so that it can also be used by marker function.
var map;
var infowindow;


var ViewModel = function() {

    showBars = ko.observable(true);
    showCafes = ko.observable(true);
    //initially hide list pane
    listIsVisible = ko.observable(false);

    toggleBars = function() {
      console.log('trying to toggle bars');
      showBars(!showBars());
      toggleMarkerCategory('bar');
    };

    toggleCafes = function() {
      console.log('toggling Cafes');
      showCafes(!showCafes());
      toggleMarkerCategory('coffeebar');
    };


    filterLocs = function() {
      let index = 0;
      for(var i = 0; i < locations.length; i++) {
        if(locations[i].category == 'bar') {
          locations[i].index = index;
          index++;
          bars.push(locations[i]);
        } else if (locations[i].category == 'coffeebar') {
          locations[i].index = index;
          index++;
          cafes.push(locations[i]);
        }
      }
    };

    //function to reveal list, triggered by click
    toggleList = function() {
        infowindow.close();
        listIsVisible(!listIsVisible());
    };

    //work in progress - toggles markers on click ok, but doesn't close their infoWindows
    toggleMarker = function() {
      infowindow.close();
      let markerVisibility = (markers[this.index].getVisible() == true) ?  false : true;
      markers[this.index].setVisible(markerVisibility);
      console.log(this.index);
    };

    toggleMarkerCategory = function(category) {

      for(var i = 0; i<markers.length; i++) {
          let markerVisibility = (markers[i].getVisible() == true) ?  false : true;
          console.log (markers[i].category);
          if(locations[i].category == category) {
            markers[i].setVisible(markerVisibility);
          }
      }
    };
    startup = function() {
      $.getScript(mapScript)
        .done(function() {
          console.log('trying to initialise map');
          self.initMap();
          self.filterLocs();
          console.log('trying to add markers');
          self.addMarkers();
          infowindow = new google.maps.InfoWindow();

          console.log('trying to add windows');
        })
      .fail(function() {
        alert('Apologies, dear user, there appears to be a problem loading the Google Maps API.\n\nPlease try again later.');
      });
    };

    initMap = function() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: mapSettings.lat,
          lng: mapSettings.lng
        },
        zoom: mapSettings.zoom,
        mapTypeControl: mapSettings.mapTypeControl,
        styles: mapSettings.styles
      });
    };

    makeMarker = function(loc,icon,id) {
      var latLng = new google.maps.LatLng(loc.lat, loc.lng);
      var marker = new google.maps.Marker({
        position : latLng,
        map : map,
        icon : icon
      });
      google.maps.event.addListener(marker, 'click', function(){
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(id);
        infowindow.open(map, marker);
      });
    };

    addMarkers = function() {
      for(var i=0; i<locations.length; i++) {
        makeMarker(locations[i], locations[i].icon, locations[i].venue_id);
      }
    };

    // addMarkers = function() {
    //   locations.forEach(function(element){
    //     //pulls all the data for the markers
    //     //from the locations array.  this
    //     //works fine
    //     marker = new google.maps.Marker({
    //       position: {
    //         lat: element.lat,
    //         lng: element.lng
    //       },
    //       map: map,
    //       title: element.name,
    //       icon: element.icon,
    //       info: element.infoPanel
    //     });
    //     markers.push(marker);
    //   });
    // };

  //   addWindows = function() {
  //   infowindow = new google.maps.InfoWindow({
  //     content: "placeholder content..."
  //   });
  //
  //   for (var i = 0; i < markers.length; i++) {
  //     var marker = markers[i];
  //     google.maps.event.addListener(marker, 'click', function() {
  //       infowindow.setContent(this.info);
  //       infowindow.open(map,this);
  //     });
  //   }
  // };


    // addWindows = function() {
    //   markers.forEach(function(element){
    //     var infowindow = new google.maps.InfoWindow();
    //     var content = 'hello';
    //     element.addListener('click', function(marker,content,infowindow){
    //       return function() {
    //         infowindow.setConent(content);
    //         infowindow.open(map,marker);
    //       };
    //     })(marker,content,infowindow);
    //   });
    // };
//end of ViewModel
startup();
};

ko.applyBindings(new ViewModel());
