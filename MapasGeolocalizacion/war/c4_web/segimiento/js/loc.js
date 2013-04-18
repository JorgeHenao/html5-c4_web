/* loc.js */
var seguirId = null;
var map = null;
var uscCordenadas = {
    latitude: 3.40332,
    longitude: -76.54930
};

window.onload = darMiLocalizacion;

function darMiLocalizacion() {
    if (navigator.geolocation) {
        var btnSeguir = document.getElementById("seguir");
        btnSeguir.onclick = seguirLocalizacion;
        var btnLimpiar = document.getElementById("limpiar");
        btnLimpiar.onclick = limpiarVista;
    } else {
        alert("Oops, no soporta geolocalizacion");
    }
}

function mostrarLocalizacion(position) {
    var latitud = position.coords.latitude;
    var longitud = position.coords.longitude;

    var div = document.getElementById("localizacion");
    div.innerHTML = "Tu estas en, Latitud: " + latitud + ", Longitud: " + longitud;
    div.innerHTML += " (con una precision" + position.coords.accuracy + " metros)";
    var km = calcularDistancia(position.coords, uscCordenadas);
    var distancia = document.getElementById("distancia");
    distancia.innerHTML = "Tu estas a " + km + " km de la cancha de futbol #1 de la Universidad USC";
    if (map == null) {
        mostrarMapa(position.coords);
    } else {
        scrollMapAPosicion(position.coords);
    }
}

//
// Ley de los cosenos para calcular la distiacia
//
function calcularDistancia(coordenadasInciales, coordenadasFinales) {
    var latInicialRad = gradosARadianes(coordenadasInciales.latitude);
    var longIncialRads = gradosARadianes(coordenadasInciales.longitude);
    var latFinalRads = gradosARadianes(coordenadasFinales.latitude);
    var longFinalRads = gradosARadianes(coordenadasFinales.longitude);

    var radio = 6371;
    // radio de la tierra en km
    var distancia = Math.acos(Math.sin(latInicialRad) * Math.sin(latFinalRads) + Math.cos(latInicialRad) * Math.cos(latFinalRads) * Math.cos(longIncialRads - longFinalRads)) * radio;

    return distancia;
}

function gradosARadianes(grados) {
    radianes = (grados * Math.PI) / 180;
    return radianes;
}

function mostrarMapa(coords) {
    var loc = new google.maps.LatLng(coords.latitude, coords.longitude);
    var mapOptions = {
        zoom: 16,
        center: loc,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);


    var titulo = "Tu localizacion";
    var contenido = "Estas aqui: " + coords.latitude + ", " + coords.longitude;
    adicionarMarcador(map, loc, titulo, contenido);
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

function adicionarMarcador(map, latlong, titulo, contenido) {
    var opcionesMarcador = {
        position: latlong,
        map: map,
        title: titulo,
        clickable: true
    };
    var marcador = new google.maps.Marker(opcionesMarcador);

    var opcionesInfoWindow = {
        content: contenido,
        position: latlong
    };

    var infoWindow = new google.maps.InfoWindow(opcionesInfoWindow);

    google.maps.event.addListener(marcador, 'click', function() {
        infoWindow.open(map);
    });
}

function seguirLocalizacion() {
    seguirId = navigator.geolocation.watchPosition(mostrarLocalizacion, mostrarError);
}

function limpiarVista() {
    if (seguirId) {
        navigator.geolocation.clearWatch(seguirId);
        seguirId = null;
    }
}

function scrollMapAPosicion(coords) {
    var latitude = coords.latitude;
    var longitude = coords.longitude;

    var latlong = new google.maps.LatLng(latitude, longitude);
    map.panTo(latlong);


    adicionarMarcador(map, latlong, "Tu nueva localizacion", "Te moviste a: " +
            latitude + ", " + longitude);
}
