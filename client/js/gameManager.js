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

function removeDiacritics(input)
{
    var output = "";

    var normalized = input.normalize("NFD");
    var i=0;
    var j=0;

    while (i<input.length)
    {
        output += normalized[j];

        j += (input[i] == normalized[j]) ? 1 : 2;
        i++;
    }

    return output;
}

function getColor(properties) {
  return properties.completed ? 'rgb(120, 120, 120)' : colors[properties.diff % colors.length];
}

let geoJson;
let mapData = generateDifficulty([15, 9, 5, 1]);

let totalPoints = 0;
let currentPoints = 0;
let currentTurn = 1;
let pointBonus = 0;

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
    const novadaModal = $('#novada-modal');

    function updateTheMap() {
      mapData.forEach((f, i) => {
        if (f.properties.id == properties.id)
          mapData[i].properties.completed = true;
      });

      for (i in map._layers) {
        if (map._layers[i].options.format == undefined && map._layers[i]._url == undefined) {
          try {
            map.removeLayer(map._layers[i]);
          } catch (err) {
            console.log("Problem with removing:  " + e  + ":" + map._layers[i]);
          }
        }
      }

      setMapData(map, mapData, mapOptions);
    }

    function endTurn() {
      novadaModal.modal('toggle');

      currentTurn += 1;
      currentPoints = 0;

      $('#current-turn').text(currentTurn);
      $('#current-points').text('0');

      updateTheMap();
    }

    function unbindClickEvent() {
      for(let i = 0; i < 4; i++) {
        novadaModal.find('#answer' + i).unbind('click');
      }
    }

    if (properties.diff > 0 && !properties.completed) {
      const random = randInt(0, questions[0].length);
      const question = questions[0][random];
      //const question = questions[properties.diff - 1][randInt(0, questions[properties.diff - 1].length - 1)];

      if (question == undefined)
        return;

      novadaModal.modal({
        backdrop: 'static',
        keyboard: false
      }).show();

      novadaModal.find('#label').text(properties.id);
      novadaModal.find('#question').text(question.msg);

      let data = [637971, 367266, 188494, 243032, 232759, 264857, 637971, 83250, 56383];

      const answers = shuffleArray(question.getAnswers(data));
      const correctAnswer = question.getAnswer(data);

      for (let i = 0; i < 4; i++) {
        novadaModal.find('#answer' + i)
          .removeClass('btn-danger btn-success')
          .addClass('btn-light');
      }

      const endButton = novadaModal.find('#end');

      endButton.unbind('click');
      endButton.click(() => {
        unbindClickEvent();
        endTurn();
      });

      const nextButton = novadaModal.find('#next');

      if (!nextButton.hasClass('disabled'))
        nextButton.addClass('disabled');
      nextButton.unbind('click');
      nextButton.click(() => {
        if (nextButton.hasClass('disabled'))
          return;
        unbindClickEvent();
        endTurn();
      });

      for (let i = 0; i < 4; i++) {
        const answerElem = novadaModal.find('#answer' + i);

        answerElem.text(answers[i]);
        answerElem.click(() => {

          let points = 0;

          nextButton.removeClass('disabled');

          if (answers[i] != correctAnswer) {
            pointBonus = 0;
            answerElem.removeClass('btn-light').addClass('btn-danger');
          } else {
            points = awardedPoints[properties.diff - 1] + pointBonus;
            answerElem.removeClass('btn-light').addClass('btn-success');
            pointBonus += 25;
          }

          totalPoints   += points;
          currentPoints += points;

          $('#point-bonus').text(pointBonus);
          $('#total-points').text(totalPoints);

          novadaModal.find('#current-points').text(currentPoints);

          if (answerElem.has('strong'))
            answerElem.find('strong').remove();
          answerElem.append('<strong> +' + points + '</strong>')

          unbindClickEvent();
        });
      }
    }
  },
  onMouseOver: (event, layer, feature, ctx) => {
    if (feature.properties.diff > 0 && !feature.properties.completed) {
      layer.setStyle({
        weight: 4,
        fillOpacity: 1.0
      });
    }
  }
};

setMapData(map, mapData, mapOptions);