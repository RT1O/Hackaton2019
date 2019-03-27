$(window).bind("beforeunload", () => {
  return "Vai tu esi pārliecināts ka gribi iziet?";
});

const colors = [
  'rgb(200, 200, 200)',
  'rgb(117, 206, 135)',
  'rgb(255, 165, 0)',
  'rgb(196, 57, 58)',
  'rgb(121, 86, 135)'
];

function generateDifficulty(values) {
  const set = values.map((_) => 0);
  const final = shuffleArray(konturas.features.map((feature) => {
    feature.properties.diff = 0;
    feature.properties.completed = false;

    if (requiredStates.includes(feature.properties.id))
      feature.properties.diff = randInt(0, values.length);

    return feature;
  }));

  for (let x = 0; x < values.length; x++) {
    while (set[x] < values[x]) {
      for (let i = 0; i < final.length; i++) {
        if (final[i].properties.diff > 0)
          continue;
        if (randInt(0, 100) > 80) {
          if (set[x] >= values[x])
            break;
          set[x] += 1; final[i].properties.diff = (x + 1);
        }
      }
    }
  }

  return final;
}

function getColor(properties) {
  return properties.completed ? 'rgb(120, 120, 120)' : colors[properties.diff % colors.length];
}

let geoJson;
let mapData = generateDifficulty([15, 9, 5, 1]);

const game = {
  pointBonus: 0,
  totalPoints: 0,
  currentPoints: 0,
  currentTurn: 1,
  currentQuestion: 0
};
const awardedPoints = [100, 200, 300, 400];

const map = getMap('game-map', [56.946285, 24.105078], 7);

var CurrentN;
var polylines;
var Path = Array();
const lineColors = [
  'rgb(0, 0, 100)',
  'rgb(100, 100, 150)',
];

map.on("overlayadd", function (event) {
  polylines.bringToFront();
  for (i in Path) {
    Path[i].bringToFront();
  }
})

const mapOptions = {
  style: (feature, properties) => {
    return {
      weight: 2,
      color: 'rgb(255, 255, 255)',
      fillColor: getColor(properties),
      fillOpacity: 1.0
    };
  },

  onClick: (event, layer, feature) => {
    if (feature.properties.diff > 0){
     if(typeof polylines !== 'undefined'){
        var latlngs = Array();

        latlngs.push([CurrentN.properties.Latitude, CurrentN.properties.Longitude]);
        latlngs.push([feature.properties.Latitude, feature.properties.Longitude]);

        Path.push(L.polyline(latlngs, {color: lineColors[1]}).addTo(map));
      }
      CurrentN = feature;
    }

    const properties = feature.properties;
    const diff = properties.diff;
    const novadaModal = $('#novada-modal');

    function updateTheMap() {
      mapData.forEach((f, i) => {
        if (f.properties.id == properties.id)
          mapData[i].properties.completed = true;
      });
      for (i in map._layers) {
        if (map._layers[i].options.format == undefined && map._layers[i]._url == undefined) {
          try {
            if(map._layers[i].options.color !== lineColors[1]){
              map.removeLayer(map._layers[i]);
            }
          } catch (err) {
            console.log("Problem with removing:  " + e  + ":" + map._layers[i]);
          }
        }
      }
      setMapData(map, mapData, mapOptions);
      for (i in Path) {
        Path[i].bringToFront();
      }
    }

    function endQuestion() {
      novadaModal.modal('toggle');

      game.currentTurn += 1;
      game.currentPoints = 0;

      $('#current-turn')
        .text(game.currentTurn);
      $('#current-points')
        .text(game.currentPoints);

      updateTheMap();
    }

    function unbindClickEvent() {
      for(let i = 0; i < 4; i++) {
        novadaModal.find('#answer' + i).unbind('click');
      }
    }

    function openQuestion() {
      if (game.currentQuestion >= 2)
        $('#next').text('Pabeigt');

      const question = game.questions[game.currentQuestion];

      if (question == undefined)
        return;

      novadaModal.modal({
        backdrop: 'static',
        keyboard: false
      }).show();

      novadaModal.find('#label')
        .text(properties.id);
      novadaModal.find('#question')
        .text(question.msg);

      const data = [123123, 12312, 213123, 51232, 5123, 412];

      const answers = shuffleArray(question.getAnswers(data));
      const correctAnswer = question.getAnswer(data);

      for (let i = 0; i < 4; i++) {
        novadaModal
          .find('#answer' + i)
          .removeClass('btn-danger btn-success')
          .addClass('btn-light');
      }

      const endButton = novadaModal.find('#end');

      endButton.unbind('click');
      endButton
        .click(() => {
          unbindClickEvent();
          endQuestion();
        });

      const nextButton = novadaModal.find('#next');

      if (!nextButton.hasClass('disabled'))
        nextButton.addClass('disabled');

      nextButton.unbind('click');
      nextButton
        .click(() => {
          if (nextButton.hasClass('disabled'))
            return;
          unbindClickEvent();

          if (game.currentQuestion >= 2)
            endQuestion();

          game.currentQuestion += 1;

          openQuestion();
        });

      for (let i = 0; i < 4; i++) {
        const currentAnswer = answers[i];
        const answerElem = novadaModal.find('#answer' + i);

        answerElem.text(currentAnswer);
        answerElem
          .click(() => {

            const isCorrect = currentAnswer == correctAnswer;
            const pointsGained = (isCorrect ? awardedPoints[diff - 1] + game.pointBonus : 0);

            nextButton.removeClass('disabled');
            answerElem.removeClass('btn-light');

            answerElem.addClass(isCorrect ? 'btn-success' : 'btn-danger');

            game.pointBonus += isCorrect ? 25 : 0;
            game.totalPoints += pointsGained;
            game.currentPoints += pointsGained;

            $('#point-bonus').text(game.pointBonus);
            $('#total-points').text(game.totalPoints);
            $('#current-points').text(game.currentPoints);

            if (answerElem.has('strong'))
              answerElem.find('strong').remove();
            answerElem.append(`<strong> +${pointsGained}</strong>`);

            unbindClickEvent();
          });
      }
    }

    if (properties.diff > 0 && !properties.completed) {
      $('#next').text('Nākamais');

      game.questions = [
        questions[0][randInt(0, questions[0].length)],
        questions[0][randInt(0, questions[0].length)],
        questions[0][randInt(0, questions[0].length)]
      ];

      game.currentQuestion = 0;

      openQuestion();
    }
  },
  onMouseOver: (event, layer, feature) => {
    if (feature.properties.diff > 0 && !feature.properties.completed) {
      layer.setStyle({
        weight: 4,
        fillOpacity: 1.0
      });
    }
    for (i in Path) {
      Path[i].bringToFront();
    }
    if (feature.properties.diff > 0){
      if(typeof CurrentN !== 'undefined'){

        if(typeof polylines !== 'undefined'){
          map.removeLayer(polylines);
        }
      
        var latlngs = Array();

        latlngs.push([CurrentN.properties.Latitude, CurrentN.properties.Longitude]);
        latlngs.push([feature.properties.Latitude, feature.properties.Longitude]);
      
        polylines = L.polyline(latlngs, {color: lineColors[0]}).addTo(map);
      }
    }
  }
};

setMapData(map, mapData, mapOptions);