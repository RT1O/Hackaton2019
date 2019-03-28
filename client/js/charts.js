Chart.defaults.global.colors = [
  {
    borderColor: 'rgb(0, 49, 66)',
    backgroundColor: 'rgb(0, 49, 66)'
  },
  {
    borderColor: 'rgb(201, 209, 0)',
    backgroundColor: 'rgb(201, 209, 0)'
  },
  {
    borderColor: 'rgb(214, 89, 167)',
    backgroundColor: 'rgb(214, 89, 167)'
  }
];

Chart.defaults.global.type = 'bar';
Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;

function getFirstKey(object) {
  return Object.keys(object)[0];
}

function getFirstKeyValue(object) {
  return object[getFirstKey(object)];
}

function getColors(index) {
  return Chart.defaults.global.colors[index % Chart.defaults.global.colors.length];
}

function renderChart(element, result, chart) {
  if (chart.amount > 0)
    result = result.slice(result.length - chart.amount, result.length);
  const chartData = {
    type: chart.type || Chart.defaults.global.type,
    data: {
      labels: result.map((row) => {
        return getFirstKeyValue(row);
      }),
      datasets: chart.data.map((dataset, index) => {
        return Object.assign({}, getColors(index), chart.options, dataset.options, {
          label: dataset.label,
          data: result.map((row) => {
            return parseInt(row[dataset.col]);
          })
        });
      })
    }
  };
  const chartObject = new Chart(element, chartData);
}

function createCharts() {
  charts.forEach((chart) => {
    const chartElement = $('#' + chart.id);

    chartElement
      .append('<p></p>')
      .find('p')
      .html(`
      <div class="pt-5 chart-spinner-container d-flex justify-content-center">
        <div class="mt-5">
          <div class="mt-4 chart-spinner spinner-border align-middle text-dark" role="status">
            <span class="sr-only align-middle">Loading...</span>
          </div>
        </div>
      </div>`);

    getOpenData(chart.source)
      .then((result) => {
        chartElement
          .find('p')
          .html('');
        chartElement
          .addClass('chart-container chart-body')
          .append('<canvas></canvas>');
        renderChart(chartElement.find('canvas'), result, chart);
      });
  });
}

$(document).ready(() => {
  createCharts();
});