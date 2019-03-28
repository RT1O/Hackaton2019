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

const recycleMarkers = [];
const recycleCluster = L.markerClusterGroup({
  ...markerClusterDefaults,
	iconCreateFunction: (cluster) => {
		return getMarkerIcon(cluster, 'recycle-marker');
	}
});

const pieturuMarkers = [];
const pieturuCluster = L.markerClusterGroup({
  ...markerClusterDefaults,
	iconCreateFunction: (cluster) => {
		return getMarkerIcon(cluster, 'pieturu-marker');
	}
});

function getColor(d, v = [10, 20, 50, 100, 200, 500, 1000]) {
  return d > v[6] ? '#800026' :
         d > v[5] ? '#BD0026' :
         d > v[4] ? '#E31A1C' :
         d > v[3] ? '#FC4E2A' :
         d > v[2] ? '#FD8D3C' :
         d > v[1] ? '#FEB24C' :
         d > v[0] ? '#FED976' :
                    '#FFEDA0';
}

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

function removeInfo() {
  if (info != null)
    map.removeControl(info);
}

function removeLegend() {
  if (legend != null)
    map.removeControl(legend);
}

function addInfo() {
  removeInfo();
  info = L.control();
  info.update = (props) => {
    this._div.innerHTML = (props ? '<b>' + props.name + '</b><br>' + props.value : 'Uzliec kursoru virs novada, lai redzētu papildinformāciju.');
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
    // div.innerHtml = `<i style="background: ${getColor(12312, v = grades)}"></i>`;
    for (let i = 0; i < grades.length; i++)
      div.innerHTML += `<i style="background: ${getColor(grades[i] + 1, v = grades)}"></i>
        ${grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + suffix + '<br>' : '+' + suffix)}`;
    return div;
  };
  legend.addTo(map);
}

$('document').ready(() => {
  getOpenData('skiroviegli_viss')
    .then((result) => {
      result.forEach((r) => {
        const pos = r['Koordinātas'].split(', ');
        try {
          recycleMarkers.push(
            L.marker([
              parseFloat(pos[0]),
              parseFloat(pos[1])
            ], {
              icon: getIcon('green')
            }));
        } catch(err) {
          // ...
        }
      });
      map.addLayer(recycleCluster);
    });

  getOpenData('autobusu_pieturvietas')
    .then((result) => {
      result.forEach((r) => {
        try {
          pieturuMarkers.push(
            L.marker([
              parseFloat(r['Platums']),
              parseFloat(r['Garums'])
            ], {
              icon: getIcon('blue')
            }));
        } catch(err) {
          // ... cheeky errors, BEGONE
        }
      });
      map.addLayer(pieturuCluster);
    });

  $('#recycle-checkbox').change(() => {
    const checked = !$('#recycle-checkbox').is(':checked');
    if (!checked) {
      recycleCluster.addLayers(recycleMarkers);
    } else {
      recycleCluster.removeLayers(recycleMarkers);
    }
  });

  $('#pieturas-checkbox').change(() => {
    const checked = !$('#pieturas-checkbox').is(':checked');

    if (!checked) {
      pieturuCluster.addLayers(pieturuMarkers);
    } else {
      pieturuCluster.removeLayers(pieturuMarkers);
    }
  });

  $('#novadu-checkbox').change(() => {
    const checked = !$('#novadu-checkbox').is(':checked');

    if (!checked) {
      if (legend != null)
        legend.addTo(map);
      geoJson = setMapData(map, geoJson.toGeoJSON(), mapOptions);
    } else {
      removeLegend();
      map.removeLayer(geoJson);
    }
  });

  $('#default-novadi').click(() => {
    removeInfo();
    removeLegend();

    info = null;
    legend = null;

    $('#map-dropdown .dropdown-item').removeClass('active');
    $('#default-novadi').addClass('active');

    map.removeLayer(geoJson);
    geoJson = setMapData(map, konturas, mapOptions);
  });

  $('#algas-novadi').click(() => {
    const grades = [550, 650, 750, 850, 950, 1050, 1150];

    getOpenData('alga_novados', 'error-alert-map')
      .then((result) => {
        $('#novadu-checkbox').prop('checked', true);

        $('#map-dropdown .dropdown-item').removeClass('active');
        $('#algas-novadi').addClass('active');

        addInfo();
        addLegend(grades, suffix = '€');

        map.removeLayer(geoJson);
        geoJson = setMapData(map, (() => {
          const final = [];
          konturas.features.forEach((f) => {
            result.forEach((r) => {
              Object.keys(r).forEach((k) => {
                if (k == f.properties.id)
                  final.push(Object.assign({}, f, {
                    properties: {
                      name: f.properties.id,
                      value: r[k] + '€',
                      color: getColor(r[k], v = grades),
                    }
                  }));
              });
            });
          });
          return final;
        })(), mapOptions);
      }).catch((err) => {
        console.log(err);
      })
  });

  $('#population-novadi').click(() => {
    const grades = [5, 10, 20, 50, 100, 250, 500];

    getOpenData('iedzivotaju_skaits_novados', 'error-alert-map')
      .then((result) => {
        $('#novadu-checkbox').prop('checked', true);

        $('#map-dropdown .dropdown-item').removeClass('active');
        $('#population-novadi').addClass('active');

        addInfo();
        addLegend(grades, suffix = ' tūkst.');

        map.removeLayer(geoJson);
        geoJson = setMapData(map, (() => {
          const final = [];
          konturas.features.forEach((f) => {
            result.forEach((r) => {
              Object.keys(r).forEach((k) => {
                if (k == f.properties.id)
                  final.push(Object.assign({}, f, {
                    properties: {
                      name: f.properties.id,
                      value: round(r[k] / 1000, 1) + ' tūkst. iedzīvotāji',
                      color: getColor(r[k] / 1000, v = grades)
                    }
                  }));
              });
            });
          });
          return final;
        })(), mapOptions);
      }).catch((err) => {
        console.log(err);
      })
  });

  $('#noziegumi-novadi').click(() => {
    const grades = [100, 200, 300, 400, 500, 600, 700];

    getOpenData('noziedzigie_nodarijumi_novados', 'error-alert-map')
      .then((result) => {
        $('#novadu-checkbox').prop('checked', true);

        $('#map-dropdown .dropdown-item').removeClass('active');
        $('#noziegumi-novadi').addClass('active');

        addInfo();
        addLegend(grades, suffix = '');

        map.removeLayer(geoJson);
        geoJson = setMapData(map, (() => {
          const final = [];
          konturas.features.forEach((f) => {
            result.forEach((r) => {
              Object.keys(r).forEach((k) => {
                if (k == f.properties.id)
                  final.push(Object.assign({}, f, {
                    properties: {
                      name: f.properties.id,
                      value: r[k] + ' noziegumi',
                      color: getColor(r[k], v = grades)
                    }
                  }));
              });
            });
          });
          return final;
        })(), mapOptions);
      }).catch((err) => {
        console.log(err);
      })
  });

  $('#housing-novadi').click(() => {
    const grades = [1, 5, 10, 15, 30, 50, 100];

    getOpenData('majoklu_skaits_novados', 'error-alert-map')
      .then((result) => {
        $('#novadu-checkbox').prop('checked', true);

        $('#map-dropdown .dropdown-item').removeClass('active');
        $('#housing-novadi').addClass('active');

        addInfo();
        addLegend(grades, suffix = ' tūkst.');

        map.removeLayer(geoJson);
        geoJson = setMapData(map, (() => {
          const final = [];
          konturas.features.forEach((f) => {
            result.forEach((r) => {
              Object.keys(r).forEach((k) => {
                if (k == f.properties.id)
                  final.push(Object.assign({}, f, {
                    properties: {
                      name: f.properties.id,
                      color: getColor(r[k] / 1000, v = grades),
                      value: round(r[k] / 1000, 1) + ' tūkst. mājokļu'
                    }
                  }));
              });
            });
          });
          return final;
        })(), mapOptions);
      }).catch((err) => {
        console.log(err);
      })
  });

  $('#dzimstiba-novadi').click(() => {
    const grades = [6.5, 8, 9.5, 11, 12.5, 13, 14.5];

    getOpenData('dzimstiba_novados', 'error-alert-map')
      .then((result) => {
        $('#novadu-checkbox').prop('checked', true);

        $('#map-dropdown .dropdown-item').removeClass('active');
        $('#dzimstiba-novadi').addClass('active');

        addInfo();
        addLegend(grades, suffix = '');

        map.removeLayer(geoJson);
        geoJson = setMapData(map, (() => {
          const final = [];
          konturas.features.forEach((f) => {
            result.forEach((r) => {
              Object.keys(r).forEach((k) => {
                if (k == f.properties.id)
                  final.push(Object.assign({}, f, {
                    properties: {
                      name: f.properties.id,
                      color: getColor(r[k], v = grades),
                      value: r[k] + ' dzimstība (uz 1000 iedz.)'
                    }
                  }));
              });
            });
          });
          return final;
        })(), mapOptions);
      }).catch((err) => {
        console.log(err);
      })
  });
});

geoJson = setMapData(map, konturas, mapOptions);

/*
getOpenData('iedzivotaju_skaits_novados')
  .then((result) => {
    const populations = [];
    const data = konturas.features.map((feature) => {
      result.forEach((r) => {
        Object.keys(r).forEach((k) => {
          if (removeDiacritics(k) == feature.properties.id) {
            d = r[k] / 150;
            feature.properties.color =
            d > 1000 ? '#800026' :
            d > 500  ? '#BD0026' :
            d > 200  ? '#E31A1C' :
            d > 100  ? '#FC4E2A' :
            d > 50   ? '#FD8D3C' :
            d > 20   ? '#FEB24C' :
            d > 10   ? '#FED976' :
                       '#FFEDA0';
          }
        });
      });
      return feature;
    });
    setMapData(map, data, mapOptions);
  });
*/