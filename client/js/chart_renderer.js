const API_BASE_URL = config.host || "http://localhost:8081";
const defaultColors = [
  'rgb(0, 49, 66)',
  'rgb(201, 209, 0)',
  'rgb(214, 89, 167)'
];

function getFirstKey(object) {
  return Object.keys(object)[0];
}

function getFirstKeyValue(object) {
  return object[getFirstKey(object)];
}

function getChartLabels(data) {
  return data.map((a) => {
    return getFirstKeyValue(a);
  });
}

function getDatasetData(data, dataset) {
  return data.map((a) => {
    return parseInt(a[dataset.key]);
  });
}

function getColors(chart, index = 0) {
  const colors = defaultColors[index % defaultColors.length];

  /*colors = defaultColors.map((color) => {
    return color;
  }).concat(colors);*/

  return {
    borderColor: colors,
    backgroundColor: colors
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
  const chartLabels = getChartLabels(data);
  const chartData = chart.data.map((dataset, index) => {
    return Object.assign({}, dataset.options, getColors(chart, index), chart.options,
      {
        label: dataset.label,
        data: getDatasetData(data, dataset)
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
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 3
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: xGridLines,
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: yGridLines,
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
      .append('<p></p>')
    // please ignore this one : ^) (vertical alignment is pain)
    $('#' + chart.id + ' p')
      .html(
      '<div class="pt-5 chart-spinner-container d-flex justify-content-center">' +
      '<div class="mt-4"><div class="mt-5 chart-spinner spinner-border align-middle text-dark" role="status">' +
      '<span class="sr-only align-middle">Loading...</span>' +
      '</div></div></div>');
    $.ajax({
      url: API_BASE_URL + '/chart/' + chart.source,
      method: 'GET',
      dataType: 'json',
      success: (result) => {
        $('#' + chart.id + ' p')
          .html('');
        $('#' + chart.id)
          .addClass('chart-container')
          .addClass('chart-body')
          .append('<canvas></canvas>');
        renderChart($('#' + chart.id + ' canvas'), result, chart);
      },
      error: (err) => {
        console.log(err);
      }
    });
  });
}

$(document).ready(() => {
  createCharts();
});