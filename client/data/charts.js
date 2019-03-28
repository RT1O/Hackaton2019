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
  },
  {
    id: 'vieglais-transports',
    source: 'transporti_latvija',
    data: [
      {
        label: 'Vieglie automobiļi',
        col: 'Vieglie automobiļi'
      }
    ]
  },
  {
    id: 'smagais-transports',
    source: 'transporti_latvija',
    data: [
      {
        label: 'Kravas automobiļi (ieskaitot vilcējus)',
        col: 'Kravas automobiļi (ieskaitot vilcējus)'
      }
    ]
  },
  {
    id: 'autobusu-transports',
    source: 'transporti_latvija',
    data: [
      {
        label: 'Autobusi',
        col: 'Autobusi'
      }
    ]
  },
  {
    // type: 'line',
    id: 'udens-transports',
    source: 'transporti_latvija',
    data: [
      {
        label: 'Kravas kuģi',
        col: 'kravas kuģi'
      },
      {
        label: 'Zvejas kuģi',
        col: 'zvejas kuģi'
      },
      {
        label: 'Pasažieru kuģi',
        col: 'pasažieru kuģi'
      }
    ],
    amount: 15,
    /*options: {
      fill: false,
      pointRadius: 2
    }*/
  },
  {
    type: 'line',
    id: 'dzelzscela-garums',
    source: 'celu_garums',
    data: [
      {
        label: 'Valsts dzelzceļa līnijas, km',
        col: 'Valsts dzelzceļa līnijas'
      }
    ],
    options: {
      fill: false
    }
  }
];