// Nezinu kapēc rakstīju angliski, tā vieglāk,
// ceru ka sapratīsi kā tālāk izdarīt, lai ievietot jaunus
// grafikus.

const API_BASE_URL = "http://localhost:8081";

// The colors of the charts, the loop through the provided ones.
const defaultColors = [
  // RGBA (RED, GREEN, BLUE, APLHA(transparency 0.0 - 1.0)).
  'rgb(0, 49, 66)',
  'rgb(201, 209, 0)',
  'rgb(214, 89, 167)'
]

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
    id: 'ISG010-0',
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
    id: 'ISG010-1',
    source: 'ISG010',
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
    id: 'DSG001',
    source: 'DSG001',
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
    id: 'MAJDZIVNIEKI-0',
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
]

// \/\/\/\/\/\/\/\/\/\/\/\/\/
// Only functions below here.
// /\/\/\/\/\/\/\/\/\/\/\/\/\

function getFirstKey(object) {
  return Object.keys(object)[0];
}

function getFirstKeyValue(object) {
  return object[getFirstKey(object)];
}

function getChartLabels(data, chart) {
  if (!chart.rows)
    return data.map((a) => {
      return getFirstKeyValue(a);
    });
  return Object.keys(data[0])
    .filter((a) => {
      return !chart.excludes.includes(a)
        && a != getFirstKey(data[0]);
    });
}

function getDatasetData(data, chart, dataset) {
  if (!chart.rows)
    return data.map((a) => {
      return parseInt(a[dataset.key]);
    });
  let _data = [];
  let datasetData = null;
  for (let i = 0; i < data.length; i++) {
    if (getFirstKeyValue(data[i]) == dataset.row) {
      datasetData = data[i]; break;
    }
  }
  Object.keys(datasetData)
    .forEach((key) => {
      console.log(key);
      if (!chart.excludes.includes(key)
        && key != getFirstKey(datasetData))
        _data.push(datasetData[key]);
    });
  return _data;
}

function getColors(chart, index = 0) {
  let colors;
  if (!chart.rows) {
    colors = defaultColors[index % defaultColors.length];
  } else {
    colors = defaultColors.map((color) => {
      return color;
    }).concat(colors);
  }
  return {
    borderColor: colors,
    backgroundColor: colors
  };
}

function getChartOptions(chart) {
  return {

  };
}

function renderChart(ctx, data, chart) {
  if (chart.amount > 0) {
    try {
      data = data.slice(data.length - chart.amount, data.length);
    } catch (err) {
      console.log('An error occured while slicing the data: ', err.message);
    }
  }
  const chartLabels = getChartLabels(data, chart);
  const chartData = chart.data.map((dataset, index) => {
    return Object.assign({}, dataset.options, chart.options, getColors(chart, index),
      {
        label: dataset.label,
        data: getDatasetData(data, chart, dataset)
      });
  });
  const noGridLines = ['pie', 'doughnut'];
  const xGridLines = (noGridLines.includes(chart.type) ? false : false);
  const yGridLines = (noGridLines.includes(chart.type) ? false : true);
  new Chart(ctx, {
    type: chart.type || 'bar',
    data: {
      labels: chartLabels,
      datasets: chartData
    },
    options: { // getChartOptions(chart)
      responsive: true,
      /*
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'nearest',
        intersect: false
      },
      */
      elements: {
        point: {
          radius: 3
        }
      },
      scales: {
        xAxes: [
          {
            display: xGridLines,
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            display: yGridLines,
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
      .append('<p></p>')
    $('#' + chart.id + ' p')
      .html('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
    $.ajax({
        url: API_BASE_URL + '/chart/' + chart.source,
        method: 'GET',
        dataType: 'json',
        success: (result) => {
          $('#' + chart.id + ' p')
            .html('');
          $('#' + chart.id)
            .append('<canvas></canvas>');
          renderChart($('#' + chart.id + ' canvas'), result, chart);
        },
        error: (err) => {
          console.log(err);
          // $('#' + chart.id + ' p')
          //   .html('<p>An error occured.</p>');
        }
      });
  });
}

$(document).ready(() => {
  createCharts();
});