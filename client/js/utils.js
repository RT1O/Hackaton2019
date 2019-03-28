const mapboxURL = 'https://api.mapbox.com/styles/v1/rt1o/cjtijj0di2p881fp5d8n8gs27/tiles/{z}/{x}/{y}?access_token=';
function randInt(from, to) {
  return Math.floor(Math.random() * to) + from;
}

function getMap(id, coordinates, zoom, url = null) {
  const map = L.map(id, {
    preferCanvas: true
  }).setView(coordinates, zoom - 1);

  L.tileLayer((url == null ? mapboxURL : url) + config.mapbox.token, {
    minZoom: zoom - 1
  }).addTo(map);

  map.setMaxBounds(map.getBounds());
  map.setZoom(zoom);

  return map;
}

function setMapData(map, data, options) {
  let geoJson;
  geoJson = L.geoJson(data, {
    style: (feature) => {
      if (typeof options.style == undefined)
        return {
          fillColor: 'rgb(0, 49, 66)'
        };
      return options.style(feature, feature.properties);
    },
    onEachFeature: (feature, layer) => {
      layer.on({
        click: (event) => {
          if (typeof options.onClick == undefined) {
            // ... Defaults
          } else {
            options.onClick(event, layer, feature);
          }
        },
        mouseover: (event) => {
          if (typeof options.onMouseOver == undefined) {
            // ... Defaults
          } else {
            options.onMouseOver(event, layer, feature);
					}
					if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge)
						layer.bringToFront();
        },
        mouseout: (event) => {
          if (typeof options.onMouseOut == undefined) {
            // ... Defaults
          } else {
            options.onMouseOut(event, layer, feature);
          }
          geoJson.resetStyle(layer);
        }
      });
    }
  }).addTo(map);
  return geoJson;
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function getOpenData(source, eAlert = 'error-alert') {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: config.host + '/chart/' + source,
      method: 'GET',
      dataType: 'JSON',
      success: (result) => {
        resolve(result);
      },
      error: (err) => {
        const alert = $('#' + eAlert);
        alert.find('#message')
          .text(config.error.ajax);
        alert.show();
        reject(err);
      }
    });
  });
}

// Taken from the depths of the internet.
function shuffleArray(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Another one of those mystery functions.
function removeDiacritics (input) {
  let output = "";
  let normalized = input.normalize('NFD');
  let i = 0;
  let j = 0;
  while (i < input.length) {
    output += normalized[j];
    j += (input[i] == normalized[j]) ? 1 : 2;
    i++;
  }
  return output;
}


$(window).scroll(() => {
	if ($(this).scrollTop() >= 50) {
		$('#return-to-top').fadeIn(200);
	} else {
		$('#return-to-top').fadeOut(200);
	}
});

$('#return-to-top').click(() => {
	$('body, html').animate({
		scrollTop: 0
	}, 500);
});

$('.checkbox-menu').on('change', "input[type='checkbox']", () => {
	$(this).closest('li').toggleClass('active', this.checked);
});

$(document).on('click', '.allow-focus', (e) => {
	e.stopPropagation();
});

$(function () {
  $('.button-checkbox').each(function () {

      // Settings
      var $widget = $(this),
          $button = $widget.find('button'),
          $checkbox = $widget.find('input:checkbox'),
          color = $button.data('color'),
          settings = {
              on: {
                  icon: 'glyphicon glyphicon-check'
              },
              off: {
                  icon: 'glyphicon glyphicon-unchecked'
              }
          };

      // Event Handlers
      $button.on('click', function () {
          $checkbox.prop('checked', !$checkbox.is(':checked'));
          $checkbox.triggerHandler('change');
          updateDisplay();
      });
      $checkbox.on('change', function () {
          updateDisplay();
      });

      // Actions
      function updateDisplay() {
          var isChecked = $checkbox.is(':checked');

          // Set the button's state
          $button.data('state', (isChecked) ? "on" : "off");

          // Set the button's icon
          $button.find('.state-icon')
              .removeClass()
              .addClass('state-icon ' + settings[$button.data('state')].icon);

          // Update the button's color
          if (isChecked) {
              $button
                  .removeClass('btn-default')
                  .addClass('btn-' + color + ' active');
          }
          else {
              $button
                  .removeClass('btn-' + color + ' active')
                  .addClass('btn-default');
          }
      }

      // Initialization
      function init() {

          updateDisplay();

          // Inject the icon if applicable
          if ($button.find('.state-icon').length == 0) {
              $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
          }
      }
      init();
  });
});