const charts = [
  {
    type: 'line',
    id: 'iedzivotaju-skaits',
    source: 'iedzivotaju_skaits_latvija',
    data: [
      {
        label: 'Iedzīvotāju skaits Latvijā',
        col: 'Skaits'
      }
    ],
    options: {
      fill: false,
      pointRadius: 2
    }
  },
  {
    id: 'dzimstiba-latvija',
    source: 'dzimstiba_latvija',
    data: [
      {
        label: 'Dzimstība Latvijā (uz 1000 iedzīvotājiem)',
        col: 'Dzimstība'
      }
    ]
  },
  {
    id: 'mirstiba-latvija',
    source: 'iedzivotaju_mirstiba_latvija',
    data: [
      {
        label: 'Mirstība Latvijā',
        col: 'Mirstība'
      }
    ]
  },
  {
    id: 'majdzivnieki-latvija',
    source: 'majdzivnieki_latvija',
    data: [
      {
        label: 'Suņi',
        col: 'Suņi'
      },
      {
        label: 'Kaķi',
        col: 'Kaķi'
      }
    ],
    options: {
      title: {
        display: true,
        text: 'Mājdzīvnieki'
      }
    }
  }
];