function getRandomAnswers(array, result = []) {
  let a = null;

  while (a == null || result.includes(a)) {
    a = array[Math.floor(Math.random() * array.length)];
  }

  result.push(a);

  if (result.length < 3)
    return getRandomAnswers(array, result);
  return result;
}

function getNovadaData(id, data) {
  let answer = 0;
  data.forEach((d) => {
    Object.keys(d).forEach((k) => {
      if (k == id)
        answer = d[k];
    });
  });
  return answer;
}

const requiredStates = ['Riga'];
const questions = {
  '0': [
    {
      msg: 'Kurš no minētajiem mājdzīvniekiem šajā novadā ir visvairāk?',
      getAnswer (id, data = []) {
        return 'Suņi'
      },
      getAnswers (id, data = []) {
        const incorrect = [
          'Kaķi', 'Seski', 'Dinozauri', 'Papagaiļi', 'Truši', 'Zirgi',
          'Lāči', 'Lapsas', 'Kāmji', 'Lauvas', 'Žurkas'
        ];
        return [
          this.getAnswer(id), ...getRandomAnswers(incorrect)
        ];
      }
    },
    {
      msg: 'Kāda bija vidējā alga šajā novadā 2018.gada beigās?',
      source: 'alga_novados',
      suffix: '€',
      getAnswer (id, data) {
        return getNovadaData(id, data);
      },
      getAnswers (id, data) {
        const answer = this.getAnswer(id, data);
        return [
          answer + this.suffix,
          parseInt(answer * randInt(110, 135) / 100) + this.suffix,
          parseInt(answer * randInt(50, 75) / 100) + this.suffix,
          parseInt(answer * randInt(75, 90) / 100) + this.suffix
        ];
      }
    },
    {
      msg: 'Cik procenti no iedzīvotājiem šajā novadā ir Latvijas pilsoņi?',
      source: 'latviesu_pilsoni_novados',
      suffix: '%',
      getAnswer (id, data) {
        return getNovadaData(id, data);
      },
      getAnswers (id, data) {
        const answer = this.getAnswer(id, data);
        return [
          answer + this.suffix,
          parseInt(answer * 0.85) + this.suffix,
          parseInt(answer * 0.9) + this.suffix,
          parseInt(answer * 0.8) + this.suffix
        ];
      }
    },
    {
      msg: 'Cik daudz laulības tika slēgtas šajā novadā 2017.gada beigās?',
	    source: 'slegtas_laulibas_novados',
      getAnswer (id, data) {
        return getNovadaData(id, data);
      },
      getAnswers (id, data) {
        const answer = this.getAnswer(id, data);
        return [
          answer,
          parseInt(answer * randInt(110, 135) / 100),
          parseInt(answer * randInt(50, 75) / 100),
          parseInt(answer * randInt(75, 90) / 100)
        ];
      }
    },
    {
      msg: 'Kāda bija dzimstība (uz 1000 iedzīvotājiem) šajā novadā 2018.gada beigās?',
      source: 'dzimstiba_novados',
      suffix: '',
      getAnswer (id, data) {
        return getNovadaData(id, data);
      },
      getAnswers (id, data) {
        const answer = this.getAnswer(id, data);
        return [
          answer,
          round(answer * 0.75, 1),
          round(answer * 1.25, 1),
          round(answer * 0.85, 1)
        ];
      }
    },
    {
      msg: 'Cik tūkst. mājokļu bija šajā novadā 2009.gada beigās?',
      source: 'majoklu_skaits_novados',
      suffix: ' tūkst.',
      getAnswer (id, data) {
        return round(getNovadaData(id, data) / 1000, 1);
      },
      getAnswers (id, data) {
        const answer = this.getAnswer(id, data);
        return [
          answer + this.suffix,
          round((answer * randInt(110, 135) + 1) / 100 , 1) + this.suffix,
          round((answer * randInt(50, 75) - 1) / 100, 1) + this.suffix,
          round((answer * randInt(75, 90) - 1) / 100, 1) + this.suffix
        ];
      }
    },
    {
      msg: 'Cik liels bija reģistrēto noziedzīgo nodarījumu skaits šajā novadā 2017.gada beigās?',
	    source: 'noziedzigie_nodarijumi_novados',
      getAnswer (id, data) {
        return getNovadaData(id, data);
      },
      getAnswers (id, data) {
        const answer = this.getAnswer(id, data);
        return [
          answer,
          parseInt(answer * randInt(110, 135) / 100),
          parseInt(answer * randInt(50, 75) / 100),
          parseInt(answer * randInt(75, 90) / 100)
        ];
      }
    },
    {
      msg: 'Cik tūkst. iedzīvotāju bija šajā novadā 2018. gada beigās?',
      source: 'iedzivotaju_skaits_novados',
      suffix: ' tūkst.',
      getAnswer (id, data) {
        return round(getNovadaData(id, data) / 1000, 1);
      },
      getAnswers (id, data) {
        const answer = this.getAnswer(id, data);
        return [
          answer + this.suffix,
          round((answer * randInt(110, 135) + 1) / 100, 1) + this.suffix,
          round((answer * randInt(50, 75) - 1) / 100, 1) + this.suffix,
          round((answer * randInt(75, 90) - 1) / 100, 1) + this.suffix
        ];
      }
    }
  ],
  '1': [],
  '2': []
}

/*
 "IT'S A ME, MARIO."
▒▒▒▒▒▒▒▒▒▄▄▄▄▒▒▒▒▒▒▒
▒▒▒▒▒▒▄▀▀▓▓▓▀█▒▒▒▒▒▒
▒▒▒▒▄▀▓▓▄██████▄▒▒▒▒
▒▒▒▄█▄█▀░░▄░▄░█▀▒▒▒▒
▒▒▄▀░██▄░░▀░▀░▀▄▒▒▒▒
▒▒▀▄░░▀░▄█▄▄░░▄█▄▒▒▒
▒▒▒▒▀█▄▄░░▀▀▀█▀▒▒▒▒▒
▒▒▒▄▀▓▓▓▀██▀▀█▄▀▀▄▒▒
▒▒█▓▓▄▀▀▀▄█▄▓▓▀█░█▒▒
▒▒▀▄█░░░░░█▀▀▄▄▀█▒▒▒
▒▒▒▄▀▀▄▄▄██▄▄█▀▓▓█▒▒
▒▒█▀▓█████████▓▓▓█▒▒
▒▒█▓▓██▀▀▀▒▒▒▀▄▄█▀▒▒
▒▒▒▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*/