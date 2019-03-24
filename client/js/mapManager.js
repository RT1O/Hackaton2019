const map = getMap('region-map', [56.946285, 24.105078], 7);
const mapOptions = {
  style: (feature, properties) => {
    return {
      fillColor: 'rgb(0, 49, 66)',
      fillOpacity: 1.0,
      weight: 2,
      color: 'rgb(255, 255, 255)'
    };
  },
  onClick: (event, layer, feature) => {

  },
  onMouseOver: (event, layer, feature) => {

  }
}
setMapData(map, konturas, mapOptions);