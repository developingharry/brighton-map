var locations = [
    {
        name: 'Red Roaster',
        lat: 50.821149,
        lng: -0.1361460000000534,
        category: 'coffeebar',
        icon: 'images/coffee.png',
        index:0,
        marker:[],
        infoPanel:[]
    },
    {
        name: 'La Mucca Nera',
        lat: 50.8207471,
        lng: -0.13421779999998762,
        category: 'coffeebar',
        icon: 'images/coffee.png',
        index: 1,
        marker:[],
        infoPanel:[]
    },
    {
        name: 'Starbucks',
        lat: 50.820873,
        lng: -0.13498470000001817,
        category: 'coffeebar',
        icon: 'images/coffee.png',
        index: 2,
        marker:[],
        infoPanel:[]
    },
    {
        name: 'Twin Pines',
        lat: 50.8210438,
        lng: -0.13516649999996844,
        category: 'coffeebar',
        icon: 'images/coffee.png',
        index: 3,
        marker:[],
        infoPanel:[]
    },
    {
        name: 'Block',
        lat: 50.820647,
        lng: -0.13360199999999622,
        category: 'bar',
        icon: 'images/beer.png',
        index: 4,
        marker:[],
        infoPanel:[]
    },
    {
        name: 'The Queens Arms',
        lat: 50.8213051,
        lng: -0.134762099999989,
        category: 'bar',
        icon: 'images/beer.png',
        index: 5,
        marker:[],
        infoPanel:[]
    },
    {
        name: 'The Ranelagh',
        lat: 50.8216432,
        lng: -0.13242930000001252,
        category: 'bar',
        icon: 'images/beer.png',
        index: 6,
        marker:[],
        infoPanel:[]
    },

];

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

var Menu = function(data) {};

var ViewModel = function() {


    //initially hide list pane
    this.listIsVisible = ko.observable(false);

    //function to reveal list, triggered by click
    toggleList = function() {
        this.listIsVisible(!this.listIsVisible());
    };

    //work in progress - toggles markers on click ok, but doesn't close their infoWindows
    toggleMarker = function() {
      var markerVisibility = (markers[this.index].getVisible() == true) ?  false : true;
      markers[this.index].setVisible(markerVisibility);
      console.log(this.index);
    };

    // toggleInfopanel = function() {
    //   var
    // }

    //initial map loading function
    this.loadMap = function() {
        $.getScript(mapScript)
            //if the google maps api loads, draw map
            .done(function() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {
                        lat: mapSettings.lat,
                        lng: mapSettings.lng
                    },
                    zoom: mapSettings.zoom,
                    mapTypeControl: mapSettings.mapTypeControl,
                    styles: mapSettings.styles
                });

                //also draw a marker for each place in the array
                locations.forEach(function(element) {
                    console.log(element.name);
                    var marker = new google.maps.Marker({
                        position: {
                            lat: element.lat,
                            lng: element.lng
                        },
                        map: map,
                        title: element.name,
                        icon: element.icon
                    });

                    //also add listeners for animation and infoWIndow display
                    google.maps.event.addListener(marker, 'click', function() {
                        //close other windows if necessary
                        infowindow.close();
                        //set infowindow contents
                        infowindow.setContent("this is placeholder info");
                        //open infowindow
                        infowindow.open(map, marker);
                        //bounce
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        //stop bouncing one animation cycle later
                        setTimeout(function(){marker.setAnimation(null);
                        }, 750);
                    });
                    var navObj = $('.navObj');
                    google.maps.event.addDomListener(navObj, 'click', function(){alert('hello');});

                    markers.push(marker);
                    element.marker=marker;
                    console.log(element);
                });
                var infowindow = new google.maps.InfoWindow();

                //finally we'll set up the InfoWindows.
                locations.forEach(function(element) {
                    var infoPanel = new google.maps.InfoWindow({
                        content: location.category
                    });
                    element.infoPanel=infoPanel;
                });

                //if the google maps api fails to load, alert user
            }).fail(function() {
                alert('The Google Maps API has failed to load.  Please try again later.');
            });
    };

    //call the map load function
    //note: I wasn't sure if it was best practice to
    //call the function here, or outside the ViewModel
    //when I apply the Bindings.
    this.loadMap();

};

ko.applyBindings(new ViewModel());
