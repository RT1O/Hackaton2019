// Nezinu kapēc rakstīju angliski, tā vieglāk,
// ceru ka sapratīsi kā tālāk izdarīt, lai ievietot jaunus
// grafikus.

const API_BASE_URL = "http://localhost:8081";

// The colors of the charts, the loop through the provided ones.
const defaultColors = {
  // RGBA format (RED, GREEN, BLUE, APLHA(transparency 0.0 - 1.0)).
  borders: [
    'rgba(255, 0, 0, 0.6)',
    'rgba(0, 255, 0, 0.6)',
    'rgba(0, 0, 255, 0.6)'
  ],
  backgrounds: [
    'rgba(255, 0, 0, 0.2)',
    'rgba(0, 255, 0, 0.2)',
    'rgba(0, 0, 255, 0.2)'
  ]
}

/* GRAFIKA PIEMĒRS:
const chart = {
  id: 'CHART-ID', // ID of the canvas element, for this chart.
  source: 'CHART-SOURCE', // The name of the .csv file found in the server ./data/ folder.
  type: 'line', // The type of the chart. More can be found on http://chartjs.org/
  data: [
    {
      label: '# of VALUE', // Label of the dataset.
      key: 'CHART-KEY', // Primary key for the values.
      background: 'rgba(0, 0, 0, 1.0)', // Custom color of the background.
      border: 'rgba(0, 0, 0, 1.0)', // Custom color of the border.
      options: {} // Extra options.
    },
    // ...more datasets.
  ],
  options: {}, // Global options, applied to every dataset.
  atZero: false, // Should the chart start at zero?
  amount: 10, // How many values should be used?
}
*/

// All the charts should be added here.
// Add new charts into the array using
// the example provided above.
const charts = [
  {
    id: 'GZG070',
    source: 'GZG070',
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
      borderWidth: 1
    },
    amount: 10
  },
  {
    id: 'ISG010',
    source: 'ISG010',
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
    id: 'DSG001',
    source: 'DSG001',
    type: 'line',
    data: [
      {
        label: 'Minimālā mēnešalga',
        key: 'Minimālā mēnešalga'
      }
    ],
    options: {
      fill: false
    }
  }
]

// \/\/\/\/\/\/\/\/\/\/\/\/\/
// Only functions below here.
// /\/\/\/\/\/\/\/\/\/\/\/\/\

function renderChart(ctx, data, chart) {
  if (chart.amount > 0) {
    try {
      data = data.slice(data.length - chart.amount, data.length);
    } catch (err) {
      console.log('An error occured while slicing the data: ', err.message);
    }
  }
  const chartLabels = data.map((x) => {
    return x[Object.keys(x)[0]];
  });
  const chartData = chart.data.map((x, i) => {
    return Object.assign({}, chart.options || {}, x.options || {}, {
      label: x.label,
      data: data.map((a) => {
        return parseInt(a[x.key]);
      }),
      borderColor: (x.color != null
        ? x.color[1]
        : defaultColors.borders[i % defaultColors.borders.length]),
      backgroundColor: (x.color != null
        ? x.color[0]
        : defaultColors.backgrounds[i % defaultColors.backgrounds.length]),
    });
  });
  new Chart(ctx, {
    type: chart.type || 'bar',
    data: {
      labels: chartLabels,
      datasets: chartData
    },
    options: {
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'nearest',
        intersect: false
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            ticks: {
              beginAtZero: chart.atZero || false
            }
          }
        ]
      }
    }
  });
}

function createCharts() {
  charts.forEach((chart) => {
    $('#' + chart.id)
      .append('<div></div>', '<canvas></canvas>')
    $('#' + chart.id + ' div')
      .html('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
    $.ajax({
        url: API_BASE_URL + '/chart/' + chart.source,
        method: 'GET',
        dataType: 'json',
        success: (result) => {
          $('#' + chart.id + ' div')
            .html('');
          renderChart($('#' + chart.id + ' canvas'), result, chart);
        },
        error: (err) => {
          console.log(err);
          $('#' + chart.id)
            .html('<p>An error occured.</p>');
        }
      });
  });
}

$(document).ready(() => {
  createCharts();
});