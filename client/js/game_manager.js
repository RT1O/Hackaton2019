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

function getRandom(array, amount, excludes = [], result = []) {
  let a = 0;
  console.log(excludes, a)
  while (excludes.includes(a) || result.includes(a) || a == 0)
    a = array[Math.floor(Math.random() * array.length)];
  result.push(a);
  if (result.length < amount) {
    excludes.push(a);
    return getRandom(array, amount, excludes, result);
  }
  return result;
}

const questions = {
  '0': [
    {
      msg: 'Cik iedzīvotāju šeit bija 2018. gadā?',
	  source: 'iedzivotaju_skaits_novados',
	  row: '2018', 
      getAnswer (data) {
        return Math.max(...data);
      },
      getAnswers (data) {
        return shuffle([
          this.getAnswer(data), ...getRandom(data, 3, [this.getAnswer(data)])
        ]);
      }
    },
    {
      msg: ''
    }
  ],
  '1': [

  ],
  '2': [

  ],
  '3': [

  ]
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
    'rgb(196, 57, 58)',
    'rgb(121, 86, 135)'
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
      $('#novada-modal').modal('show');

      $('#novada-name')
        .text(properties.id);

      $('#novada-question')
        .text(questions['0'][0].msg);

      const question = questions['0'][0];
	  let data = [637971,367266,188494,243032,232759,264857,637971,83250,56383];
	  
	  /*
	  $ajax({
	    url: API_BASE_URL + '/chart/' + question.source,
		method: 'GET',
		dataType: 'json',
		success: (_data) => {
			data = _data.map((x) => {
				return x;
			});
		},
		error: (err) => {
		
		}
	  });
	  */
	  
	  const answers = question.getAnswers(data);
	  const correctAnswer = question.getAnswer(data);
		
      for (let i = 0; i < 4; i++) {
        $('#novada-answer-' + i).text(answers[i]);
		$('#novada-answer-' + i).click(() => {
			console.log(answers[i], correctAnswer, $('#novada-answer-' + i));
			if (answers[i] != correctAnswer) {
				$('#novada-answer-' + i).removeClass('btn-light').addClass('btn-danger');
				alert('Nepareizi!');
			} else {
				$('#novada-answer-' + i).removeClass('btn-light').addClass('btn-success');
				alert('Pareizi!');
			}
		});
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

function generateDifficulty(values) {
  const set = [0, 0, 0, 0];
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

          const properties = final[i].properties;
          // const question  = questions[i][Math.floor(Math.random() * questions[i].length)];

          properties.diff = (x + 1);

          /*
          $.ajax({
            url: API_BASE_URL + '/chart/' + question.source,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
              properties.question = question.msg.replace(':x:', properties.id.charAt(1).toUpperCase() + properties.id.substr(2));
              properties.answers  = {
                correct: 0,
                incorrect: [0, 0, 0]
              }
            },
            error: (err) => {

            });*/

          final[i].properties = properties;
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

const geoJson = setGeoJson(map, generateDifficulty([15, 10, 5, 1]));