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
    // show all locations in menu by default
    showTitle = ko.observable(true);
    showBars = ko.observable(true);
    showCafes = ko.observable(true);
    //initially hide list pane
    listIsVisible = ko.observable(false);

    toggleBars = function() {
      //show or hide the bars in the list
      showBars(!showBars());
      //toggle all bar markers
      toggleMarkerCategory('bar');
    };

    toggleCafes = function() {
      //show or hide the cafes in the list
      showCafes(!showCafes());
      // toggle all cafe markers
      toggleMarkerCategory('coffeebar');
    };

    filterLocs = function() {
      let index = 0;
      // loop through all locations, pushing each
      // category into its own array (seems reasonably scaleable to me)
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
        if(showTitle()){
          showTitle(false);
        }
        // close all infowindows to keep things tidy
        infowindow.close();
        // toggle visibility of list
        listIsVisible(!listIsVisible());
    };

    // function to show/hide marker when selected from list
    toggleMarker = function() {
      // close all infowindows to keep things tidy
      infowindow.close();
      // get visibility of marker and store it within an array
      let markerVisibility = (markers[this.index].getVisible() == true) ?  false : true;
      // set the marker visibility as appropriate when selected from list
      markers[this.index].setVisible(markerVisibility);
      // ...with a little drop animation.
      markers[this.index].setAnimation(google.maps.Animation.DROP);
    };

    toggleMarkerCategory = function(category) {
      // it may seem more complicated than it needs
      // to be, but that's so I cover the eventuality
      // that one bar is hidden, for example,
      // I don't then want that to toggle in inverse.
      switch(category) {
    case 'bar':
        // if I'm currently hiding bars in the list, hide their markers
        if(!showBars()){
          markerToggler(category, false);
        } else {
          markerToggler(category, true);
        }
        break;
    case 'coffeebar':
        if(!showCafes()){
          markerToggler(category, false);
        } else {
          markerToggler(category, true);
        }
        break;
      }
    };

    // separate function to process the given category,
    // to avoid code duplication.
    markerToggler = function(category, toggleStatus) {
      // loop through markers, setting visibility to
      // status given in previous function.
      for(var i = 0; i<markers.length; i++) {
        if(locations[i].category == category) {
          markers[i].setVisible(toggleStatus);
          markers[i].setAnimation(google.maps.Animation.DROP);
        }
      }
    };

    startup = function() {
      //load up the map api
      $.getScript(mapScript)
        .done(function() {
          // render the map on the page
          initMap();
          //separate locations into category arrays and drop markers in for them
          filterLocs();
          addMarkers();
          //extend bounds of map to cover all markers
          fitBounds();
          // assign definition to infowindow, now that script is loaded, to avoid errors
          infowindow = new google.maps.InfoWindow();
        })
      .fail(function() {
        //error message
        alert('Apologies, dear user, there appears to be a problem loading the Google Maps API.\n\nPlease try again later.');
      });
    };

    initMap = function() {
      //map initialisation based on mapSettings variable
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

    fitBounds = function() {
      //set bounds based on marker location
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
      }
      map.fitBounds(bounds);
    };

    makeMarker = function(loc,icon,id) {
      //marker generation function
      var latLng = new google.maps.LatLng(loc.lat, loc.lng);
      var marker = new google.maps.Marker({
        position : latLng,
        map : map,
        icon : icon,
        animation: google.maps.Animation.DROP
      });
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', function(){
        // make marker bounce once when clicked
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){marker.setAnimation(null);},750);
        //load 'loading' indicator for while api data comes in for infowindow
        infowindow.setContent('<img src = "images/Ajax-loader.gif"></img>');
        //get data based on fourSquare ID
        fetchVenueData(id);
         // Close previously opened infowindows
        infowindow.close();
        infowindow.open(map, marker);
      });
    };

    addMarkers = function() {
      // make a marker for each location in array
      for(var i=0; i<locations.length; i++) {
        makeMarker(locations[i], locations[i].icon, locations[i].venue_id);
      }
    };

    fetchVenueData = function(id) {
      //set url of data to fetch from FourSquare
      const fsqPrefix = 'https://api.foursquare.com/v2/venues/';
      const fsqSuffix = '?client_id=QMLLVFQXWDAXQAVRJCCHJBDJZF4KNA0E3V4MZIKU4JCSO0KQ&client_secret=HZIP1WQ4TCBAY3VQIG4SWQYJIOFT3CADVSR3BU4QXJIJWIST&v=20171010';
      const url = fsqPrefix + id + fsqSuffix;
      fetch(url).then(function(response) {
        // convert response to json
        return response.json();
      }).then(function(data) {
        // helper variable to abbreviate response for use elsewhere
        const d = data.response.venue;
        // start of the url of the location's website
        const fsq_urlStart = '<a href = "' + d.url + '" target="_blank">';
        // name of location
        const fsqName = d.name;
        // end of url (this could probably all have been done more concisely, but I went for
        // readability over concision).
        const fsq_urlEnd = '</a>';
        // twitter logo from their branding website
        const twitterLogo = '<img src = "images/Twitter_Logo_Blue.png" class = "tinylogo"></img>';
        // twitter url for each location
        const fsqTwitter = '<a href="https://twitter.com/' + d.contact.twitter + '" target="_blank">' + twitterLogo + '</a>';
        // category of location
        const fsqCategory = d.categories[0].name;
        // opening hours of location
        const fsqHours = d.hours.status;
        // general price range of items at location
        const fsqPrice = d.price.message;
        // 1st-4th lines of the infoWindow
        let firstLine = '<div class="parent">' + fsq_urlStart + fsqName + fsq_urlEnd + fsqTwitter + '</div>';
        let secondLine = '<div class="locDetails">' + fsqCategory + '</div>';
        let thirdLine = '<div class="locDetails">' + fsqHours + '</div>';
        let fourthLine = '<div class="locDetails">Price: ' + fsqPrice + '</div>';
        infowindow.setContent(firstLine + secondLine + thirdLine + fourthLine);
      }).catch(function() {
        // error message for if the fourSquare api call fails.
        infowindow.setContent('There appears to have been a problem<br>connecting to the FourSquare servers.');
      });
    };

//end of ViewModel
startup();
};

ko.applyBindings(new ViewModel());
