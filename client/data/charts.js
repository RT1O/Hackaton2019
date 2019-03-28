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
    },
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value / 1000000 + ' milj.';
            }
          }
        }]
      }
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
    ],
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value / 1000 + ' tūkst.';
            }
          }
        }]
      }
    }
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
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value / 1000 + ' tūkst.';
            }
          }
        }]
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
    ],
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value / 1000000 + ' milj.';
            }
          }
        }]
      }
    }
  },
  {
    id: 'smagais-transports',
    source: 'transporti_latvija',
    data: [
      {
        label: 'Kravas automobiļi (ieskaitot vilcējus)',
        col: 'Kravas automobiļi (ieskaitot vilcējus)'
      }
    ],
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value / 1000 + ' tūkst.';
            }
          }
        }]
      }
    }
  },
  {
    id: 'autobusu-transports',
    source: 'transporti_latvija',
    data: [
      {
        label: 'Autobusi',
        col: 'Autobusi'
      }
    ],
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value / 1000 + ' tūkst.';
            }
          }
        }]
      }
    }
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
    amount: 22,
    _options: {
      title: {
        display: true,
        text: 'Kuģi'
      }
    }
    /*options: {
      fill: false,
      pointRadius: 2
    }*/
  },
  {
    id: 'dzelzscela-garums',
    source: 'celu_garums',
    data: [
      {
        label: 'Valsts dzelzceļa līnijas',
        col: 'Valsts dzelzceļa līnijas'
      }
    ],
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value + 'km';
            }
          }
        }]
      }
    }
  },
  {
    type: 'line',
    id: 'minimala-alga',
    source: 'minimala_alga_latvija',
    data: [
      {
        label: 'Minimālā mēnešalga',
        col: 'Minimālā mēnešalga'
      }
    ],
    options: {
      fill: false,
      pointRadius: 2,
    },
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value + '€';
            }
          }
        }]
      }
    }
  },
  {
    type: 'line',
    id: 'bezdarbnieki',
    source: 'bezdarbnieki_latvija',
    data: [
      {
        label: 'Bezdarbnieki',
        col: 'PAVISAM'
      }
    ],
    options: {
      fill: false,
      pointRadius: 2,
    },
    _options: {
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => {
              return value + ' tūkst.';
            }
          }
        }]
      }
    }
  },
  {
    type: 'bar',
    id: 'filmas',
    source: 'filmu_razosana',
    data: [
      {
        label: 'Spēlfilmas',
        col: 'spēlfilmas'
      },
      {
        label: 'Animācijas',
        col: 'animācijas'
      },
      {
        label: 'Dokumentālās',
        col: 'dokumentālās'
      }
    ],
    options: {
      fill: false
    },
    _options: {
      title: {
        display: true,
        text: 'Filmu ražošana'
      }
    }
  }
];