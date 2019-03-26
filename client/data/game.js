function getRandomAnswers(array, excludes = [], result = []) {
  let a = 0;

  array = shuffleArray(array);

  while (a == 0 || excludes.includes(a) || result.includes(a)) {
    a = array[Math.floor(Math.random() * array.length)];
  }

  result.push(a); excludes.push(a);

  if (result.length < 3)
    return getRandomAnswers(array, excludes, result);
  return result;
}

const requiredStates = ['Riga'];
const questions = {
  '0': [
    {
      msg: 'Cik iedzīvotāju bija šijā novadā 2018. gadā?',
	    source: 'iedzivotaju_skaits_novados',
      getAnswer (id, data) {
        let answer = 0;
        data.forEach((d) => {
          Object.keys(d).forEach((k) => {
            if (removeDiacritics(k) == id)
              answer = d[k];
          });
        });
        return answer;
      },
      getAnswers (id, data) {
        return [
          this.getAnswer(id, data), ...getRandomAnswers(data, [this.getAnswer(id, data)])
        ];
      }
    },
    {
      msg: 'Kurš no minētajiem mājdzīvniekiem šijā novadā bija visvairāk?',
      getAnswer (id, data = []) {
        return 'Suņi'
      },
      getAnswers (id, data = []) {
        const incorrect = [
          'Kaķi', 'Seski', 'Dinozauri', 'Papagaiļi', 'Truši'
        ];
        return [
          this.getAnswer(id), ...getRandomAnswers(incorrect, [this.getAnswer(id)])
        ];
      }
    }
  ],
  '1': [

  ],
  '2': [

  ],
  '3': [

  ]
}