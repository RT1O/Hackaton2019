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
      msg: 'Cik iedzīvotāju šeit bija 2018. gadā?',
	    row: '2018',
	    source: 'iedzivotaju_skaits_novados',
      getAnswer (data = []) {
        return Math.max(...data);
      },
      getAnswers (data = []) {
        return [
          this.getAnswer(data),
          ...getRandomAnswers(data, [this.getAnswer(data)])
        ];
      }
    },
    {
      msg: 'Kurš no minētajiem mājdzīvniekiem šeit bija visvairāk?',
      getAnswer (data = []) {
        return 'Suņu'
      },
      getAnswers (data = []) {
        const incorrect = [
          'Kaķu', 'Sesku', 'Dinozauru', 'Papagaiļu', 'Trušu'
        ];
        return [
          this.getAnswer(),
          ...getRandomAnswers(incorrect, [this.getAnswer()])
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