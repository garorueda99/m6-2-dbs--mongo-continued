const express = require('express');
const morgan = require('morgan');

const PORT = 5678;

const app = express();

app.use(express.json()).use(morgan('dev')).use(require('./routes'));

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${PORT}.`);
  }
});
