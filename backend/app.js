require('dotenv').config();

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const port = process.env.PORT || 4000;

const start = async () => {
  try{
      await connectDB()
      app.listen(port, console.log(`Server is running on ${port}`))
  } catch (err) {
      console.log(err)
  }
}

start();