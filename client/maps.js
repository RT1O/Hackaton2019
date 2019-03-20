const MAPBOX_TOKEN = 'pk.eyJ1IjoicnQxbyIsImEiOiJjanRoN2Rwb24wZm1nM3lwNjRjOWlmaGlkIn0.KQ0vUQXa5yDTCq9QF7siPA';
const MAP_ZOOM = 7;

const map = L.map('map', { zoomControl: false })
  .setView([56.946285, 24.105078], MAP_ZOOM);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + MAPBOX_TOKEN, {
  id: 'mapbox.light',
  minZoom: MAP_ZOOM,
  maxZoom: MAP_ZOOM
}).addTo(map);

let geojson;

function style(feature) {
  return {
    fillColor: '#800026',
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function clickEvent(e) {
  alert("You clicked on: " + e.target.feature.properties.id);
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: clickEvent
  });
}

geojson = L.geoJson(pilsetas, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);