const charts = [
  {
    type: 'line',
    id: 'iedzivotaju-skaits',
    source: 'iedzivotaju_skaits_latvija',
    data: [
      {
        label: 'Iedzīvotāju skaits Latvijā',
        key: 'Skaits'
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
  },
  {
    id: 'majdzivnieki-latvija',
    source: 'majdzivnieki_latvija',
    data: [
      {
        label: 'Suņi',
        key: 'Suņi'
      },
      {
        label: 'Kaķi',
        key: 'Kaķi'
      },
      {
        label: 'Seski',
        key: 'Seski'
      }
    ],
    options: {
      title: {
        display: true,
        text: 'Mājdzīvnieki Latvijā'
      }
    }
  }
];