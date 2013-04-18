/* loc_Leaflet.js*/
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
    //se crea un mapa en el "mapa" div, se establece un lugar determinado y la opcion del zoom
    var zoom = 16;
    var loc = L.map('map').setView([coords.latitude, coords.longitude], zoom);

    //se añadir una capa de mosaico OpenStreetMap
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(loc);

    var titulo = "Tu localizacion";
    var contenido = "Estas aqui: " + coords.latitude + ", " + coords.longitude;
    adicionarMarcador(loc, titulo, contenido, coords);
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

function adicionarMarcador(latlong, titulo, contenido, coords) {
    //se adiciona un marcador de la ubicación, sea añade la descripcion en el popup
    L.marker([coords.latitude, coords.longitude]).addTo(latlong)
            .bindPopup(contenido).openPopup();
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
    var zoom = 16;
    var latlong = L.map('map').setView([coords.latitude, coords.longitude], zoom);
    map.panTo(latlong);
    adicionarMarcador(latlong, "Tu nueva localizacion", "Te moviste a: " + latitude + ", " + longitude);
}