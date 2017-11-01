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
    var self = this;
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
          initMap();
          filterLocs();
          console.log('trying to add markers');
          addMarkers();
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

      markers.push(marker);
      google.maps.event.addListener(marker, 'click', function(){
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(showData(id));
        infowindow.open(map, marker);
      });
    };

    addMarkers = function() {
      for(var i=0; i<locations.length; i++) {
        makeMarker(locations[i], locations[i].icon, locations[i].venue_id);
      }
    };
    var infoWindowContent = ko.observable('if you can see this I messed up');

    showData = function(id) {
      this.fetchVenueData(id).then(function(data){
        return data.response.venue;
      });
    };

    fetchVenueData = function(id) {
      const fsqPrefix = 'https://api.foursquare.com/v2/venues/';
      const fsqVenueId = id;
      const fsqSuffix = '?client_id=QMLLVFQXWDAXQAVRJCCHJBDJZF4KNA0E3V4MZIKU4JCSO0KQ&client_secret=HZIP1WQ4TCBAY3VQIG4SWQYJIOFT3CADVSR3BU4QXJIJWIST&v=20171010';
      const url = fsqPrefix + fsqVenueId + fsqSuffix;
      fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
          console.log(data);
          const d = data.response.venue;
          const fsqName = d.name;
          // const fsqHours = d.hours.status;
          const fsqCategory = d.categories[0].name;
          const twitterLogo = '<img src = "https://static.dezeen.com/uploads/2012/06/dezeen_twitter-bird.gif" class = "tinylogo"></img>';
          const fsqTwitter = '<a href="https://twitter.com/' + d.contact.twitter + '">' + d.name + '</a>';
          const fsqTags = d.tags;
          const fsq_urlStart = '<a href = "' + d.url + '">';
          const fsq_urlEnd = '</a>';
          const br = '<br>';
          infoWindowContent('' + fsqTwitter + '');
          console.log("the tags for" + fsqName + "are"  + fsqTags);
          // $('.nameHere').append(fsq_urlStart + fsqName + fsq_urlEnd + fsqTwitter + br);
          // $('.nameHere').append(fsqCategory + br);
          // $('.nameHere').append(fsqHours + br + fsqTags);
          console.log(d.name);
          return data;
        })
        .catch(error => console.warn(error));
    };


//end of ViewModel
startup();
};

ko.applyBindings(new ViewModel());
