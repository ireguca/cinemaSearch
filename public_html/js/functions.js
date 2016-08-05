/* global google */

//var cine = $( "input:first" ).val();


//function bringCine(array) {
//    for (cineIndex in array) {
//        console.log(cineIndex);
//        var element = $('<img>');
//        element.attr('src', array[imageIndex]);
//
//        $('.container-image').append(element);
//    };
//}



//    $(".submitCine").click(function () {
//        var cineName = $(".cinemaInput").val();
//        var cineLatitude = $(".latitudeInput").val();
//        var cineLongitude = $(".longitudeInput").val();
//        var latLong = cineLatitude + "," + cineLongitude;
//        
//        cinemasObject[cineName] = latLong;
//        
//        window.localStorage.setItem("cinemas", JSON.stringify(cinemasObject));
//        
//        
//        alert (cinemasObject);
//        console.log(cineName);
//        console.log(cineLatitude);
//        console.log(cineLongitude);
//    });


var map;

function addCine() {
    var cineName = $("#cinemaInput").val();
    var cineLatitude = $("#latitudeInput").val();
    var cineLongitude = $("#longitudeInput").val();
    var collectCinemas = JSON.parse(window.localStorage.getItem("cinesitos")) || {};

    var cinemas = {};
    cinemas["name"] = cineName;
    cinemas["latitude"] = cineLatitude;
    cinemas["longitude"] = cineLongitude;

    collectCinemas[Object.keys(collectCinemas).length + 1] = cinemas;
    window.localStorage.setItem("cinesitos", JSON.stringify(collectCinemas));
}

$("#submitCine").on("click", addCine);





var options = {
    enableHighAccuracy: true // retrieve more accurate position, takes longer
};

if ("geolocation" in navigator) {
    console.log("geolocation is available!");
} else {
    console.log("geolocation IS NOT available");
}

navigator.geolocation.getCurrentPosition(onLocation, onError, options);

function onLocation(position) {
    console.log('Your latitude is ' + position.coords.latitude);
    console.log('Your longitude is ' + position.coords.longitude);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var collectCinemas = JSON.parse(window.localStorage.getItem("cinesitos")) || {};

    var closestCine;
 
    var distanceCine = Infinity;

    var locations = [
        ['Te encuentras aquí', position.coords.latitude, position.coords.longitude, 0]
    ];

    var cinetemp;
    var indexCineSuccess;
    var distanceTemporal;

    for(var i=1;i<=Object.keys(collectCinemas).length;i++){
        cinetemp=collectCinemas[i];
        distanceTemporal = distance(cinetemp.latitude, cinetemp.longitude, position.coords.latitude, position.coords.longitude);
        if(distanceCine>distanceTemporal){
            indexCineSuccess = i;
            distanceCine = distanceTemporal;
        }
    }

    console.log(collectCinemas[indexCineSuccess].name);













    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            };
        })(marker, i));
    }
}

function onError(error) {
    console.error(error);
}

function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.853159;

    return dist;
}

