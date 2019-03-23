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
];