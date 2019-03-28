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

const lineColors = [
  'rgb(0, 0, 100)', //Savieno vienu novadu ar potencialu novadu
  'rgb(255, 255, 255)', //Savieno apmekletos novadus
];

var CurrentN;
var latlngs = Array();
var Path = Array();

const markers = [];
const maxTurns = 15;

function generateDifficulty(values) {
  let total = 0;

  for (let v of values)
    total += v;

  const days = [];
  const diffs = values.map((_) => 0);
  const final = shuffleArray(konturas.features.map((feature) => {

    feature.properties.diff = 0;
    feature.properties.startsOn = 0;
    feature.properties.completed = false;

    if (requiredStates.includes(feature.properties.id))
      feature.properties.diff = randInt(0, values.length);

    return feature;
  }));

  for (let x = 0; x < 15; x++) {
    days[x] = 0;
  }

  for (let x = 0; x < values.length; x++) {
    while (diffs[x] < values[x]) {
      for (let i = 0; i < final.length; i++) {
        if (final[i].properties.diff > 0)
          continue;
        if (randInt(0, 100) > 80) {
          if (diffs[x] >= values[x])
            break;

          diffs[x] += 1;
          final[i].properties.diff = (x + 1);

          if (x == 3)
            final[i].properties.startsOn = maxTurns;
        }
      }
    }
  }

  let x = 0;

  for (let i = 0; i < final.length; i++) {
    if (final[i].properties.diff == 0 || final[i].properties.startsOn != 0)
      continue;
    if (x < maxTurns - 1) {
      final[i].properties.startsOn = x + 1; x++;
    } else {
      final[i].properties.startsOn = parseInt(randInt(1, maxTurns - 1));
    }
  }

  return final;
}

let geoJson;
let mapData = generateDifficulty([45, 35, 19, 1]);

let currentMarkers = [];
const game = {
  pointBonus: 0,
  totalPoints: 0,
  currentPoints: 0,
  currentTurn: 1,
  currentQuestion: 0,
  totalCorrect: 0,
  perfectTurns: 0,
  inARow: 0,
  largestPointBonus: 0
};
const awardedPoints = [100, 200, 300, 400];

function getColor(properties) {
  if (properties.diff == 0)
    return colors[0];
  if (properties.completed)
    return 'rgb(120, 120, 120)';
  if (properties.startsOn < game.currentTurn)
    return 'rgb(120, 120, 120)';
  if (properties.startsOn == 0 || properties.startsOn > game.currentTurn)
    return colors[0];
  return colors[properties.diff % colors.length];
}

const map = getMap('game-map', [56.946285, 24.105078], 7);

map.on("overlayadd", function (event) {
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
      if(typeof CurrentN !== 'undefined'){
        latlngs.push([CurrentN.properties.Latitude, CurrentN.properties.Longitude]);
        latlngs.push([feature.properties.Latitude, feature.properties.Longitude]);
 
        Path.push(L.polyline(latlngs, {color: lineColors[1], dashArray: '20, 20', dashOffset: '0'}, ).addTo(map));
      }
      CurrentN = feature;
    }
 

    const properties = feature.properties;
    const diff = properties.diff;

    const novadaModal = $('#novada-modal');

    function update() {
      mapData.forEach((f, i) => {
        if (f.properties.id == properties.id)
          mapData[i].properties.completed = true;
      });
      map.removeLayer(geoJson);
      geoJson = setMapData(map, mapData, mapOptions);
      L.polyline(latlngs, {color: lineColors[1], dashArray: '20, 20', dashOffset: '0'}).addTo(map);
    }

    function endQuestionTurn() {
      novadaModal.modal('toggle');

      game.currentTurn += 1;
      game.currentPoints = 0;

      $('#current-turn').text(game.currentTurn);
      $('#current-points').text(game.currentPoints);

      update();
    }

    function unbindClickEvent() {
      for(let i = 0; i < 4; i++) {
        novadaModal.find('#answer' + i).unbind('click');
      }
    }

    function endTheGame() {
      const endModal = $('#end-modal');

      novadaModal.modal('toggle');
      endModal.modal({
        backdrop: 'static',
        keyboard: false
      }).show();

      $(window).unbind('beforeunload');
      $('body').addClass('stop-scrolling');

      endModal.find('#total-points')
        .text(game.totalPoints);
      endModal.find('#correct-answers')
        .text(game.totalCorrect);
      endModal.find('#total-answers')
        .text(maxTurns * 3);
      endModal.find('#largest-point-bonus')
        .text(game.largestPointBonus);
      endModal.find('#perfect-turns')
        .text(game.perfectTurns);
    }

    function openQuestion(generatedQuestions, currentQuestion = 0) {
      if (currentQuestion >= 2)
        $('#next').text('Pabeigt');

      const question = generatedQuestions[currentQuestion];

      if (question == null)
        return;

      novadaModal.modal({
        backdrop: 'static',
        keyboard: false
      }).show();

      novadaModal.find('#label').text(properties.id);
      novadaModal.find('#question').text(question.msg);

      function prepareQuestion(data) {
        let correctAnswer = question.getAnswer(properties.id, data);

        if (question.hasOwnProperty('suffix'))
          correctAnswer += question.suffix;

        const everyAnswer = shuffleArray(question.getAnswers(properties.id, data));

        const endButton  = $('#end');
        const nextButton = $('#next');

        endButton.unbind('click');
        endButton.click(() => {
          unbindClickEvent();

          if (game.currentTurn >= maxTurns)
            return endTheGame();
          endQuestionTurn();
        });

        if (!nextButton.hasClass('disabled'))
          nextButton.addClass('disabled');

        nextButton.unbind('click');
        nextButton.click(() => {
          if (nextButton.hasClass('disabled'))
            return;

          unbindClickEvent();

          if (currentQuestion >= 2) {
            if (game.currentTurn >= maxTurns)
              return endTheGame();
            endQuestionTurn();
          } else {
            openQuestion(generatedQuestions, currentQuestion + 1);
          }
         });

        for (let i = 0; i < 4; i++) {
          const currentAnswer = everyAnswer[i];
          const answerElem = novadaModal.find('#answer' + i);

          answerElem.removeClass('btn-danger btn-success').addClass('btn-light');

          answerElem.text(currentAnswer);
          answerElem.click(() => {
            const isCorrect = currentAnswer == correctAnswer;
            const pointsGained = isCorrect ? awardedPoints[diff - 1] + game.pointBonus : 0;

            nextButton.removeClass('disabled');
            answerElem.removeClass('btn-light');


            if (!isCorrect) {
              if (game.largestPointBonus < game.pointBonus)
                game.largestPointBonus = game.pointBonus;
              game.pointBonus = 0;
              $('#answer' + everyAnswer.indexOf(correctAnswer))
                .removeClass('btn-light')
                .addClass('btn-success');
              answerElem.addClass('btn-danger');
            } else {
              game.inARow += 1;

              if (game.inARow >= 3) {
                game.inARow = 0;
                game.perfectTurns += 1;
              }

              game.totalCorrect += 1;
              answerElem.addClass('btn-success');
            }

            // answerElem.addClass(isCorrect ? 'btn-success' : 'btn-danger');

            game.pointBonus    += isCorrect ? 25 : 0;
            game.totalPoints   += pointsGained;
            game.currentPoints += pointsGained;

            $('#point-bonus').text(game.pointBonus);
            $('#total-game-points').text(game.totalPoints);
            $('#current-points').text(game.currentPoints);

            if (answerElem.has('strong'))
              answerElem.find('strong').remove();
            answerElem.append(`<strong> +${ pointsGained }</strong>`);

            unbindClickEvent();
          });
        }
      }

      if (question.hasOwnProperty('source')) {
        getOpenData(question.source)
          .then((result) => {
            prepareQuestion(result);
          });
      } else {
        prepareQuestion([
          // ...
        ]);
      }
    }

    if (properties.diff > 0 && !properties.completed) {
      /*const infoModal = $('#info-modal').modal('show');

      infoModal.find('#label').text(properties.id);

      infoModal.find('#close-game').click(() => {
        infoModal.modal('toggle');
      });*/

      //infoModal.find('#start-game').click(() => {
      //  infoModal.modal('toggle');

      $('#next').text('Nākamais');

      function generateQuestions(d, amt = 3) {
        const generated = [];

        while (generated.length < amt) {
          const q = questions[d][randInt(0, questions[d].length)];
          if (generated.includes(q))
            continue;
          generated.push(q);
        }

        return generated;
      }

      openQuestion(generateQuestions(0, 3));
      // });
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
  },
  onMouseOut: (event, layer, feature) => {
    // ...
  }
};

geoJson = setMapData(map, mapData, mapOptions);

$('#restart-game').click(() => {
  location.reload();
});