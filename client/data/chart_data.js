const charts = [
  {
    type: 'line',
    id: 'iedzivotaju-skaits',
    source: 'iedzivotaju_skaits_latvija',
    data: [
      {
        label: 'Iedzīvotāju skaits Latvijā',
        key: 'Iedzīvotāju skaits gada sākumā'
      }
    ],
    options: {
      pointRadius: 0
    }
  },
  {
    id: 'dzimstiba-latvija',
    source: 'dzimstiba_latvija',
    data: [
      {
        label: 'Dzimstība Latvijā (uz 1000 iedzīvotājiem)',
        key: 'Dzimstība'
      }
    ]
  },
  {
    id: 'mirstiba-latvija',
    source: 'iedzivotaju_mirstiba_latvija',
    data: [
      {
        label: 'Mirstība Latvijā',
        key: 'Mirstība'
      }
    ]
  }
  /*
  {
    id: 'GZG070',
    source: 'GZG070',
    type: 'line',
    data: [
      {
        label: 'Faktiski',
        key: 'Faktiski'
      },
      {
        label: 'Norma',
        key: 'Norma'
      }
    ],
    options: {
      fill: false
    },
    amount: 10
  },
  {
    id: 'IEDZIVOTAJI-SKAITS',
    source: 'iedzīvotāji',
    type: 'line',
    data: [
      {
        label: 'Iedzīvotāju skaits gada sākumā',
        key: 'Iedzīvotāju skaits gada sākumā'
      }
    ],
    options: {
      fill: false
    },
    amount: 30
  },
  {
    id: 'IEDZIVOTAJI-LAULIBAS',
    source: 'iedzīvotāji',
    type: 'bar',
    data: [
      {
        label: 'Noslēgto laulību skaits',
        key: 'Noslēgto laulību skaits'
      },
      {
        label: 'Šķirto laulību skaits',
        key: 'Šķirto laulību skaits'
      }
    ],
    options: {
      fill: false
    },
    amount: 30
  },
  {
    id: 'MINIMALA-ALGA',
    source: 'minimālā_mēnešalga',
    type: 'bar',
    data: [
      {
        label: 'Minimālā mēnešalga',
        key: 'Minimālā mēnešalga'
      }
    ],
    options: {
      fill: false
    },
    amount: 20
  },
  {
    id: 'MAJDZIVNIEKI',
    source: 'majdzivnieki_pa_novadiem',
    type: 'doughnut',
    rows: true,
    excludes: [
      'Kopā'
    ],
    data: [
      {
        label: 'Mājdzīvnieki latvijā',
        row: 'Latvijā kopā'
      }
    ],
    axis: false
  }
  */
];