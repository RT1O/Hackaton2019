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
            const pointsGained = (isCorrect ? awardedPoints[diff - 1] + game.pointBonus : 0);

            nextButton.removeClass('disabled');
            answerElem.removeClass('btn-light');

            if (!isCorrect) {
              game.pointBonus = 0;
              $('#answer' + everyAnswer.indexOf(correctAnswer))
                .removeClass('btn-light')
                .addClass('btn-success');
            }

            answerElem.addClass(isCorrect ? 'btn-success' : 'btn-danger');

            game.pointBonus += isCorrect ? 25 : 0;
            game.totalPoints += pointsGained;
            game.currentPoints += pointsGained;

            $('#point-bonus').text(game.pointBonus);
            $('#total-points').text(game.totalPoints);
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
      $('#next').text('Nākamais');

      function generateQuestions(diff, amt = 3) {
        const generated = [];
        while (generated.length < amt) {
          const q = questions[diff][randInt(0, questions[diff].length)];
          if (generated.includes(q))
            continue;
          generated.push(q);
        }
        return generated;
      }
      openQuestion(generateQuestions(0, 3));
    }
  },
  onMouseOver: (event, layer, feature) => {
    if (feature.properties.diff > 0 && !feature.properties.completed) {
      layer.setStyle({
        weight: 4,
        fillOpacity: 1.0
      });
    }
  }
};

geoJson = setMapData(map, mapData, mapOptions);