const express = require('express');
const bodyParser = require('body-parser');
const csvParse = require('csv-parse');
const fs = require('fs');

const app = express();

const parsedCsv = {};
const csvOptions = {
  trim: true,
  relax: true,
  columns: true
}

fs.readdirSync(__dirname + '/data')
  .forEach((file) => {
    const filename = file.split('.')[0];
    parsedCsv[filename] = [];
    fs.createReadStream(__dirname + '/data/' + file)
      .pipe(csvParse(csvOptions))
      .on('data', (row) => {
        parsedCsv[filename].push(row);
      })
      .on('end', () => {
        // console.log(parsedCsv);
        // console.log(filename);
      })
      .on('error', (e) => {
        // console.error(e);
      });
  });

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json(parsedCsv);
});

app.get('/chart/:chart', (req, res) => {
  res.json(
    parsedCsv[req.paramas.chart]
  );
});

app.listen(8081, () => {
  console.log('Listening on http://localhost:' + 8081);
});