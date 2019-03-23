function getMap(coordinates, zoom, token) {
  const map = L.map('game-map').setView(coordinates, zoom);
  L.tileLayer('https://api.mapbox.com/styles/v1/rt1o/cjtijj0di2p881fp5d8n8gs27/tiles/{z}/{x}/{y}?access_token=' + token, {
    minZoom: zoom
  }).addTo(map);
  return map;
}

function setGeoJson(map, data) {
  let geoJson;
  const colors = [
    'rgb(0, 49, 66)',
    'rgb(201, 209, 0)',
    'rgb(214, 89, 167)'
  ];

  function getColor(diff) {
    return colors[diff % colors.length];
  }

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.diff),
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
    const properties = e.target.feature.properties;
    const id = properties.id.substr(1);

    let name = id.charAt(0).toUpperCase() + id.substr(1);

    $('#novada-modal').modal('show');

    if (properties.id.charAt(0) == 'n')
      name += ' Novads';

    $('#novada-name').text(name);

    $('#novada-question')
      .text('Tukšs jautājums.');

    for (let i = 0; i < 4; i++) {
      $('#novada-answer-' + i).text('Atbilde ' + (i + 1));
    }
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

const map = getMap([56.946285, 24.105078], 7, 'pk.eyJ1IjoicnQxbyIsImEiOiJjanRoN2Rwb24wZm1nM3lwNjRjOWlmaGlkIn0.KQ0vUQXa5yDTCq9QF7siPA');
const geoJson = setGeoJson(map, novadi.features.map((f) => {
  f.properties.diff = Math.floor(Math.random() * 3);
  return f;
}));