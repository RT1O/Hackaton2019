const mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=';
const map = getMap('region-map', [56.946285, 24.105078], 7, mapboxUrl);

let geoJson;
let infoTitle = 'Bez Datiem';

let info = L.control();
let legend;

// "Only the pureheart can witness his power."
//   ~ Forggoten Namesake
// (https://twitter.com/i/status/1097046364695994368)

const markerClusterDefaults = {
  spiderfyOnMaxZoom: false,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false
}

function getIcon(color) {
  return new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-' + color + '.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

function getMarkerIcon(cluster, name) {
  return L.divIcon({
    html: `<b>${cluster.getChildCount()}</b>`,
    iconSize: L.point(40, 40),
    className: 'marker-cluster ' + name
  });
}

let recycleMarkers = [];
const recycleCluster = L.markerClusterGroup({
  ...markerClusterDefaults,
	iconCreateFunction: (cluster) => {
		return getMarkerIcon(cluster, 'recycle-marker');
	}
});

let pieturuMarkers = [];
const pieturuCluster = L.markerClusterGroup({
  ...markerClusterDefaults,
	iconCreateFunction: (cluster) => {
		return getMarkerIcon(cluster, 'pieturu-marker');
	}
});

const mapOptions = {
  style: (feature, properties) => {
    return {
      fillColor: properties.color || 'rgba(0, 49, 66)',
      fillOpacity: 1.0,
      weight: 2,
      color:'rgba(255, 255, 255)'
    };
  },
  onClick: (event, layer, feature) => {
    /*
    $('#info-novads')
      .modal()
      .show();
    $('#info-novads #label')
      .text(feature.properties.id);
    */
  },
  onMouseOver: (event, layer, feature) => {
    layer.setStyle({
      weight: 4,
      fillOpacity: 1.0
    });
    try {
      info.update(feature.properties);
    } catch(err) {}
  },
  onMouseOut: (event, layer, feature) => {
    try {
      info.update();
    } catch(err) {}
  }
}

function isChecked(elemId) {
  return !$('#' + elemId).is(':checked');
}

function removeInfo() {
  if (info != null)
    map.removeControl(info);
}

function removeLegend() {
  if (legend != null)
    map.removeControl(legend);
}

function getColor(value, grades = [10, 20, 50, 100, 200, 500, 1000]) {
  return value > grades[6] ? '#800026' :
         value > grades[5] ? '#BD0026' :
         value > grades[4] ? '#E31A1C' :
         value > grades[3] ? '#FC4E2A' :
         value > grades[2] ? '#FD8D3C' :
         value > grades[1] ? '#FEB24C' :
         value > grades[0] ? '#FED976' :
                             '#FFEDA0';
}

function addInfo() {
  removeInfo();
  info = L.control();
  info.update = (props) => {
    this._div.innerHTML = (props
      ? '<b>' + props.name + '</b><br>' + props.value
      : 'Uzliec kursoru virs novada, lai redzētu papildinformāciju.');
  };
  info.onAdd = (map) => {
    this._div = L.DomUtil.create('div', 'info');
    info.update();
    return this._div;
  };
  info.addTo(map);
}

function addLegend(grades, suffix = '') {
  removeLegend();
  legend = L.control({
    position: 'bottomright'
  });
  legend.onAdd = (map) => {
    const div = L.DomUtil.create('div', 'info legend');
    for (let i = 0; i < grades.length; i++)
      div.innerHTML += `
      <i style="background: ${getColor(grades[i] + 1, v = grades)}"></i>
      ${grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + suffix + '<br>' : '+' + suffix)}`;
    return div;
  };
  legend.addTo(map);
}

function getMarkersFromData(source, callback, color = 'green') {
  const markers = [];
  getOpenData(source)
    .then((results) => {
      results.forEach((result) => {
        try {
          markers.push(
            L.marker(callback(result), {
              icon: getIcon(color)
            }));
        } catch (err) {
          // ...
        }
      });
    }).catch((err) => {
      // ...
    });
  return markers;
}

function addStateButton(elemId, source, options = {}) {
  const elem = $('#' + elemId);
  const errElemId = options.errElemId || 'error-alert-map';

  const suffix = options.suffix || '';
  const grades = options.grades || [1, 2, 3, 4, 5, 6, 7];
  const label = options.label ? ' ' + options.label : '';

  const hasInfo = options.info || true;
  const hasLegend = options.legend || true;

  const roundTo = options.roundTo || 0;

  function getValue (value) {
    if (options.hasOwnProperty('getValue'))
      return options.getValue(value);
    return value;
  }

  getOpenData(source, errElemId)
    .then((results) => {
      // Ieslēdz novadu redzamību.
      $('#novadu-checkbox')
        .prop('checked', true);

      // Uzliek kā 'active' linku.
      $('#map-dropdown .dropdown-item')
        .removeClass('active');
      elem.addClass('active');

      if (hasInfo)
        addInfo();

      if (hasLegend)
        addLegend(grades, suffix);

      // Izveido jaunos kartes datus, pēc dotajiem .csv datiem.
      const newMapData = (() => {
        const mapData = [];

        konturas.features.forEach((feature) => {
          results.forEach((result) => {
            Object.keys(result).forEach((key) => {
              if (key == feature.properties.id) {
                const value = getValue(result[key]);
                const newFeature = Object.assign({}, feature, {
                  properties: {
                    name: feature.properties.id,
                    value: round(value, roundTo) + suffix + label,
                    color: getColor(value, grades)
                  }
                });
                mapData.push(newFeature);
              }
            });
          });
        });

        return mapData;
      })();

      // Uzliek jaunos datus uz kartes.
      map.removeLayer(geoJson);
      geoJson = setMapData(map, newMapData, mapOptions);
    })
    .catch((err) => {
      console.log('Kļūme pie - ', source, err);
    });
}

$('document').ready(() => {
  $('#novadu-checkbox').change(() => {
    if (!isChecked('novadu-checkbox')) {
      if (legend != null)
        legend.addTo(map);
      if (info != null)
        info.addTo(map);
      geoJson = setMapData(map, geoJson.toGeoJSON(), mapOptions);
    } else {
      removeInfo();
      removeLegend();
      map.removeLayer(geoJson);
    }
  });

  map.addLayer(recycleCluster);

  recycleMarkers = getMarkersFromData('skiroviegli_viss', (result) => {
    const pos = result['Koordinātas'].split(', ');
    return [parseFloat(pos[0]), parseFloat(pos[1])];
  }, 'green');

  $('#recycle-checkbox').change(() => {
    if (!isChecked('recycle-checkbox')) {
      recycleCluster.addLayers(recycleMarkers);
    } else {
      recycleCluster.removeLayers(recycleMarkers);
    }
  });

  map.addLayer(pieturuCluster);

  pieturuMarkers = getMarkersFromData('autobusu_pieturvietas', (result) => {
    return [parseFloat(result['Platums']), parseFloat(result['Garums'])];
  }, 'blue');

  $('#pieturas-checkbox').change(() => {
    if (!isChecked('pieturas-checkbox')) {
      pieturuCluster.addLayers(pieturuMarkers);
    } else {
      pieturuCluster.removeLayers(pieturuMarkers);
    }
  });

  $('#default-novadi').click(() => {
    removeInfo();
    removeLegend();

    info = null;
    legend = null;

    $('#map-dropdown .dropdown-item')
      .removeClass('active');
    $('#default-novadi').addClass('active');

    map.removeLayer(geoJson);
    geoJson = setMapData(map, konturas, mapOptions);
  });

  $('#algas-novadi').click(() => {
    addStateButton('algas-novadi', 'alga_novados', {
      suffix: '€',
      grades: [550, 650, 750, 850, 950, 1050, 1150]
    });
  });

  $('#population-novadi').click(() => {
    addStateButton('population-novadi', 'iedzivotaju_skaits_novados', {
      label: 'iedzīvotāji',
      suffix: ' tūkst.',
      grades: [5, 10, 20, 50, 100, 250, 500],
      roundTo: 1,
      getValue: (value) => {
        return value / 1000
      }
    });
  });

  $('#noziegumi-novadi').click(() => {
    addStateButton('noziegumi-novadi', 'noziedzigie_nodarijumi_novados', {
      label: 'noziegumi',
      grades: [100, 200, 300, 400, 500, 600, 700]
    });
  });

  $('#housing-novadi').click(() => {
    addStateButton('housing-novadi', 'majoklu_skaits_novados', {
      label: 'mājokļu',
      suffix: ' tūkst.',
      grades: [1, 5, 10, 15, 30, 50, 100],
      roundTo: 1,
      getValue: (value) => {
        return value / 1000
      }
    });
  });

  $('#dzimstiba-novadi').click(() => {
    addStateButton('dzimstiba-novadi', 'dzimstiba_novados', {
      label: 'dzimstība (uz 1000 iedz.)',
      grades: [6.5, 8, 9.5, 11, 12.5, 13, 14.5]
    });
  });

  $('#pilsoni-novadi').click(() => {
    addStateButton('pilsoni-novadi', 'latviesu_pilsoni_novados', {
      suffix: '%',
      grades: [92, 93, 94, 95, 96, 97, 98]
    });
  });
});

geoJson = setMapData(map, konturas, mapOptions);