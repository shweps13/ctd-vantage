require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const transactionsRouter = require('./routes/transactions');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');
const authorizeUser = require('./middleware/authorizeUser');

app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users/:userId/transactions', authenticateUser, authorizeUser, transactionsRouter);

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