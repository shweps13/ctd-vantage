const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authentication')
const {
   createBalance,
   getAllBalances,
   getBalance,
   updateBalance,
   deleteBalance,
   getBalanceDetails,
} = require('../controllers/balances')

router
   .route('/')
   .get(authenticateUser, getAllBalances)
   .post(authenticateUser, createBalance)

router.route('/:balanceId').get(authenticateUser, getBalanceDetails)

router
   .route('/:id')
   .get(authenticateUser, getBalance)
   .patch(authenticateUser, updateBalance)
   .delete(authenticateUser, deleteBalance)

module.exports = router
