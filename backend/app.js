require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const errorHandlerMiddleware = require('./middleware/error-handler');

const authenticateUser = require('./middleware/authentication');

app.use(express.json());
app.use('/api/v1/auth', authRouter);

app.use(errorHandlerMiddleware);

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