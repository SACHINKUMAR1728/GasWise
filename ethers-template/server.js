const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require("cors");
const routes = require('./routes');
require('dotenv').config();
const compile = require('./compile.js');

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

async function startserver(){
  try {
   
    // Start the server after gas estimation
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

startserver();
