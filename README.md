# A map of my favourite places in Brighton

## Introduction

> This is for Udacity's Front End Developer Nanodegree.  I've taken the google maps api, added some info from FourSquare, and shown you some of my local bars and coffeeshops.

## Code Samples

I've taken the map information out of the initial api call, and put it into a variable.  This (hopefully) makes the function more readable!

>     initMap = function() {
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


## Installation

> To load the map, go to https://developingharry.github.io/brighton-map/.  Click "show menu" to show the list of locations, which you can then either filter individually, by clicking on them, or by category, with the buttons at the top.

>To see information about a location, click on its associated marker on the map.
You will see the individual locations'
* Homepage address
* Twitter details
* The category of the location (this is also indicated by its marker being a coffee cup or beer stein!)
* Opening hours
* How pricey the place is.

>KnockoutJS Javascript library used for separation of concerns
http://knockoutjs.com/

> Business details taken from https://foursquare.com/

> Button styling by Google's Material Design Lite framework (https://getmdl.io/)

> Fonts: Poiret One by Denis Masharov and Permanent Marker by Font Diner
https://fonts.google.com/specimen/Poiret+One
https://fonts.google.com/specimen/Permanent+Marker
