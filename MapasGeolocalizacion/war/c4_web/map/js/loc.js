/* loc.js */
var map = null;
var uscCordenadas = {
    latitude: 3.40332,
    longitude: -76.54930
};

window.onload = darMiLocalizacion;

function darMiLocalizacion() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
                mostrarLocalizacion,
                mostrarError);
    }
    else {
        alert("Oops, no soporta geolocalizacion");
    }
}

function mostrarLocalizacion(position) {
    var latitud = position.coords.latitude;
    var longitud = position.coords.longitude;

    var div = document.getElementById("localizacion");
    div.innerHTML = "Tu estas en, Latitud: " + latitud + ", Longitud: " + longitud;

    var km = calcularDistancia(position.coords, uscCordenadas);
    var distancia = document.getElementById("distancia");
    distancia.innerHTML = "Tu estas a " + km + " km de la cancha de futbol #1 de la Universidad USC";

    mostrarMapa(position.coords);
}

//
// Ley de los cosenos para calcular la distiacia
//
function calcularDistancia(coordenadasInciales, coordenadasFinales) {
    var latInicialRad = gradosARadianes(coordenadasInciales.latitude);
    var longIncialRads = gradosARadianes(coordenadasInciales.longitude);
    var latFinalRads = gradosARadianes(coordenadasFinales.latitude);
    var longFinalRads = gradosARadianes(coordenadasFinales.longitude);

    var radio = 6371; // radio de la tierra en km
    var distancia = Math.acos(Math.sin(latInicialRad) * Math.sin(latFinalRads) +
            Math.cos(latInicialRad) * Math.cos(latFinalRads) *
            Math.cos(longIncialRads - longFinalRads)) * radio;

    return distancia;
}

function gradosARadianes(grados) {
    radianes = (grados * Math.PI) / 180;
    return radianes;
}


function mostrarMapa(coords) {
    var loc = new google.maps.LatLng(coords.latitude,
            coords.longitude);
    var mapOptions = {
        zoom: 16,
        center: loc,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);
}

function mostrarError(error) {
    var tiposDeError = {
        0: "Unknown error",
        1: "Permission denied",
        2: "Position is not available",
        3: "Request timeout"
    };
    var mensajeError = tiposDeError[error.code];
    if (error.code == 0 || error.code == 2) {
        mensajeError = mensajeError + " " + error.message;
    }
    var div = document.getElementById("localizacion");
    div.innerHTML = mensajeError;
}
