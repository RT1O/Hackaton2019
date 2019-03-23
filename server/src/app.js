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
let csvAmt = 0;

fs.readdirSync(__dirname + '/data')
  .forEach((file) => {
    const filename = file.split('.')[0];
    parsedCsv[filename] = [];
    csvAmt++;
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
        console.error(e);
      });
  });

console.log('Loaded ' + csvAmt + ' .csv(s)');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.json(parsedCsv);
});

app.get('/chart/:chart', (req, res) => {
  try {
    res.json(parsedCsv[req.params.chart]);
  } catch(err) {
    res.statusCode(404);
  }
});

app.listen(8081, () => {
  console.log('Listening on http://localhost:' + 8081);
});