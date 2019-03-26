const debug = false;
const debugData = 'iedzivotaju_skaits_novados';

const map = getMap('region-map', [56.946285, 24.105078], 7, 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=');

function getDebugColor(data, properties) {
  let found = false;

  data.forEach((r) => {
    Object.keys(r).forEach((k) => {
      if (removeDiacritics(k) == properties.id)
        found = true;
    });
  });

  if (!found)
    console.log(properties.id);

  return found ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)';
}

function getColor(result, properties) {
  if (result != null)
    return getDebugColor(result, properties);
  return 'rgba(0, 49, 66, 0.3)';
}

function getMapOptions(result = null) {
  return {
    style: (feature, properties) => {
      return {
        fillColor: getColor(result, properties),
        fillOpacity: 1.0,
        weight: 2,
        color:'rgba(0, 49, 66, 0.3)'
      };
    },
    onClick: (event, layer, feature) => {
      $('#info-novads')
        .modal()
        .show();
      $('#info-novads #label')
        .text(feature.properties.id);
    },
    onMouseOver: (event, layer, feature) => {

    }
  }
}

const recycleIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const recycleMarkers = L.markerClusterGroup({
  spiderfyOnMaxZoom: false,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false,
	iconCreateFunction: (cluster) => {
		return L.divIcon({
      html: `<b>${cluster.getChildCount()}</b>`,
      iconSize: L.point(40, 40),
      className: 'marker-cluster recycle-marker'
    });
	}
});

const pieturuIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pieturuMarkers = L.markerClusterGroup({
  spiderfyOnMaxZoom: false,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false,
	iconCreateFunction: (cluster) => {
		return L.divIcon({
      html: `<b>${cluster.getChildCount()}</b>`,
      iconSize: L.point(40, 40),
      className: 'marker-cluster pieturu-marker'
    });
	}
});

$('document').ready(() => {
  $('#recycle-checkbox').click(() => {
    getOpenData('skiroviegli_viss')
      .then((result) => {
        result.forEach((r) => {
          try {
            recycleMarkers.addLayer(L.marker(r['Koordinātas'].split(', '), { icon: recycleIcon }));
          } catch(err) {
            console.log(err);
          }
        });
        map.addLayer(recycleMarkers);
      });
  });
  $('#pieturas-checkbox').click(() => {
    getOpenData('autobusu_pieturvietas')
      .then((result) => {
        result.forEach((r) => {
          try {
            pieturuMarkers.addLayer(L.marker([r['Platums'], r['Garums']], { icon: pieturuIcon }));
          } catch(err) {
            console.log(err);
          }
        });
        map.addLayer(pieturuMarkers);
      });
  });
});

if (!debug) {
  setMapData(map, konturas, getMapOptions());
} else {
  // Pārbauda vai katram novadam ir dati.
  getOpenData(debugData)
    .then((result) => {
      setMapData(map, konturas, getMapOptions(result));
    });
}