const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ "Acess-Control-Allow-Origin": "*" }));

const routers = require('./routes/routers');

app.use(express.json());

mongoose
.connect(process.env.MongoDB_string)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

  app.use('/',routers);

  app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.listen(process.env.PORT || 8010, function () {
    console.log("Server is running on " + (process.env.PORT || 8010));
  });
  
