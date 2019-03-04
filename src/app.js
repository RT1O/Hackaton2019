const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.get('/', (req, res) => {
  res.send({
    message: 'Hi'
  });
});

app.listen(8080, () => {
  console.log(`Listening on: http://localhost:8080`);
});