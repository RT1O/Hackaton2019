function getMap(coordinates, zoom, token) {
  const map = L.map('region-map').setView(coordinates, zoom);
  L.tileLayer('https://api.mapbox.com/styles/v1/rt1o/cjtijj0di2p881fp5d8n8gs27/tiles/{z}/{x}/{y}?access_token=' + token, {
    minZoom: zoom - 1
  }).addTo(map);
  return map;
}

const map = getMap([56.946285, 24.105078], 7,
  'pk.eyJ1IjoicnQxbyIsImEiOiJjanRoN2Rwb24wZm1nM3lwNjRjOWlmaGlkIn0.KQ0vUQXa5yDTCq9QF7siPA');

function setGeoJson(map, data) {
  let geoJson;

  function style(feature) {
    return {
      fillColor: 'rgb(0, 49, 66)',
      fillOpacity: 1.0,
      weight: 2,
      color: 'rgb(255, 255, 255)'
    };
  }

  function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
      weight: 4,
      fillOpacity: 1.0
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge)
      layer.bringToFront();
  }

  function resetHighlight(e) {
    geoJson.resetStyle(e.target);
  }

  function clickEvent(e) {
    //
  }

  function onEachFeature(feature, layer) {
    layer.on({
      click: clickEvent,
      mouseout: resetHighlight,
      mouseover: highlightFeature
    });
  }

  geoJson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  return geoJson;
}

setGeoJson(map, konturas);