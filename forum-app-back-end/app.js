const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const mainRouter = require('./router/mainRouter');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    console.log('Connection okay');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(2500);
app.use(cors());
app.use(express.json());
app.use('/', mainRouter);
