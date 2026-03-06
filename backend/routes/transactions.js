const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authentication')
const {
   createTransaction,
   getAllTransactions,
   getTransaction,
   updateTransaction,
   deleteTransaction,
} = require('../controllers/transactions')

router
   .route('/')
   .get(authenticateUser, getAllTransactions)
   .post(authenticateUser, createTransaction)

router
   .route('/:id')
   .get(authenticateUser, getTransaction)
   .patch(authenticateUser, updateTransaction)
   .delete(authenticateUser, deleteTransaction)

module.exports = router
