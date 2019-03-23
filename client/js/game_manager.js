const questions = {

}

function getMap(coordinates, zoom, token) {
  const map = L.map('game-map').setView(coordinates, zoom);
  L.tileLayer('https://api.mapbox.com/styles/v1/rt1o/cjtijj0di2p881fp5d8n8gs27/tiles/{z}/{x}/{y}?access_token=' + token, {
    minZoom: zoom - 1
  }).addTo(map);
  return map;
}

function setGeoJson(map, data) {
  let geoJson;

  const colors = [
    'rgb(200, 200, 200)',
    'rgb(117, 206, 135)',
    'rgb(255, 165, 0)',
    'rgb(196, 57, 58)'
  ];

  function getColor(properties) {
    if (properties.completed)
      return 'rgb(120, 120, 120)';
    return colors[properties.diff % colors.length];
  }

  function style(feature) {
    return {
      fillColor: getColor(feature.properties),
      fillOpacity: 1.0,
      weight: 2,
      color: 'rgb(255, 255, 255)'
    };
  }

  function highlightFeature(e) {
    let layer = e.target;

    if (layer.feature.properties.diff > 0 && !layer.feature.properties.completed) {
      layer.setStyle({
        weight: 4,
        fillOpacity: 1.0
      });
    }

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge)
      layer.bringToFront();
  }

  function resetHighlight(e) {
    geoJson.resetStyle(e.target);
  }

  function clickEvent(e) {
    const properties = e.target.feature.properties;

    if (properties.diff > 0 && !properties.completed) {
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

const map = getMap([56.946285, 24.105078], 7,
  'pk.eyJ1IjoicnQxbyIsImEiOiJjanRoN2Rwb24wZm1nM3lwNjRjOWlmaGlkIn0.KQ0vUQXa5yDTCq9QF7siPA');

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function generateDifficulty(values) {
  const set = [0, 0, 0];
  const final = shuffle(konturas.features.map((f) => {
    if (f.properties.id != 'priga') {
      f.properties.diff = 0;
    } else {
      f.properties.diff = Math.ceil(Math.random() * 2) + 1;
    }
    f.properties.completed = false;
    return f;
  }));

  for (var x = 0; x < values.length; x++) {
    while (set[x] < values[x]) {
      for (var i = 0; i < final.length; i++) {
        if (final[i].properties.diff > 0)
          continue;
        if (Math.floor(Math.random() * 100) > 80) {
          if (set[x] >= values[x])
            break;
          final[i].properties.diff = (x + 1);
          set[x] += 1;
        }
      }
    }
  }

  /*
  for (var i = 0; i < final.length; i++) {
    if (final[i].properties.diff > 0) {
      final[i].properties.completed = (Math.floor(Math.random() * 100) > 80 ? true : false);
    }
  }
  */

  return final;
}

const geoJson = setGeoJson(map, generateDifficulty([15, 10, 5]));