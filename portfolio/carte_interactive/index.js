var mymap = L.map('map').setView([46.23, 8.84], 9);

// Limiter la carte au Tessin:
mymap.setMaxBounds([[45.248, 7.026], [47.197, 10.871]]);
mymap.setMinZoom(8);

// Définir les différentes couches de base:

// OSM standard
var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});

//OSM relief et chemins
var osmReliefchem = L.tileLayer(
  'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=1ef4ca437d90432a98347bc9b228948a', { 
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }
);

//OSM relief
var osmRelief = L.tileLayer(
  'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=1ef4ca437d90432a98347bc9b228948a', { 
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }
);

//Photos aériennes ESRI
var esriImagery = L.tileLayer(
  'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/t\ile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="http://www.esri.com">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
);

// Ajouter la couche de base par défaut à la carte.
osmReliefchem.addTo(mymap);

// Créer les boutons pour changer la couche de base

var baseLayers = {
    "OSM: Relief et chemins": osmReliefchem,
    "OSM: Relief": osmRelief,
    "Photos aériennes ESRI": esriImagery,
    "OSM: standard": osmLayer
  };
  
  var overlays = {};
  
  L.control.layers(baseLayers, overlays).addTo(mymap);


// Créer les icônes pour nos marqueurs
var icones = {};


// Icône pour les parkings 
icones['parking'] = L.icon({
  iconUrl: 'icones/iconeparking.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les refuges 
icones['refuge'] = L.icon({
  iconUrl: 'icones/refuge_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les restaurants 
icones['restaurant'] = L.icon({
  iconUrl: 'icones/restaurant_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les gares 
icones['gare'] = L.icon({
  iconUrl: 'icones/train_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les téléphériques   
icones['téléphérique'] = L.icon({
  iconUrl: 'icones/telepherique_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les ponts 
icones['pont'] = L.icon({
  iconUrl: 'icones/pont_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les arrêts de bus 
icones['arret'] = L.icon({
  iconUrl: 'icones/bus_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les montagnes 
icones['sommet'] = L.icon({
  iconUrl: 'icones/sommet_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

// Icône pour les musées 
icones['musee'] = L.icon({
  iconUrl: 'icones/musee_icone.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});



// Ajouter les points d'intêret

for (var k in point_interet.features){   
  // Boucle à travers les points d'intérêt
  var poi = point_interet.features[k];
  var type_poi = poi.properties.type;
  var icone_marqueur = icones[type_poi];

  // Créer un marqueur Leaflet avec une icône spécifique pour chaque type de point d'intérêt
  var marqueur = L.marker([poi.geometry.coordinates[1], poi.geometry.coordinates[0]],{icon: icone_marqueur})
  .addTo(mymap)
  .bindPopup(poi.properties.nom); // Ajouter une infobox avec le nom du point d'intérêt
};

// Fermer le infobox lorsque on clique sur la carte
mymap.on('click', function() {
    mymap.closePopup(); 
});


// Afficher les randonnées 

for (var i in randonnees.features) {
  var feature = randonnees.features[i];
  var randonneesStyle = {
    "color": feature.properties.color, // couluer défini dans le document chemins.js
  	"weight": 3,
  	"opacity": 0.7
  };
  L.geoJSON(feature, randonneesStyle).addTo(mymap); // les ajouter sur la carte
}

// Zoom sur une randonnée sélectionnée et affichage des informations correspondantes

function zoomToRandonnee(randonnee) {
  var coordinates = randonnee.geometry.coordinates[0]; 

  var latLngs = coordinates.map(function (coord) {
    return L.latLng(coord[1], coord[0]); // Inverser l'ordre des coordonnées, Leaflet utilise (lat, lon)
  });

  // Calculer les limites pour ajuster la vue du zoom
  var bounds = L.latLngBounds(latLngs);
  mymap.fitBounds(bounds, { padding: [20, 20], maxZoom: 14 });

  // Ajouter les informations des randonnées une fois sélectionnées
  var description = randonnee.properties.description
  var infoBox = document.getElementById("fiche");
  infoBox.innerHTML = "<span class='titrerando'><h3>" + randonnee.properties.nom +"</h3></span><p>" + description + "</p>";

  // Ajouter aussi les images une fois selectionnée la randonnée
  var photo = document.getElementById("photos");
  photo.innerHTML = ""; // permet de supprimer les photos une fois changé la randonnée (autrement ils ajoutent toutes une après l'autre)

 // Itérer à travers toutes les images dans le tableau et créer les éléments image
  randonnee.properties.images.forEach(function (imagePath) {
    var imgElement = document.createElement("img");
    imgElement.src = imagePath;
    photo.appendChild(imgElement);
  });
}

// Réinitialiser la sélection de randonnée à chaque chargement de la page

window.onload = function() {      
  var selectElement = document.getElementById("randonnee");
  selectElement.value = ""; 
};

