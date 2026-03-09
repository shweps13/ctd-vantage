const Transaction = require('../models/Transaction')
const Balance = require('../models/Balance')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

function getBalanceDelta(transactionType, amount) {
   return transactionType === 'revenue' ? amount : -amount
}

const createTransaction = async (req, res) => {
   const balanceId = req.body.balance || req.body.balanceId
   if (balanceId) {
      const balance = await Balance.findOne({ _id: balanceId, user: req.user.userId })
      if (!balance) throw new NotFoundError(`No balance with id ${balanceId}`)
   }

   req.body.user = req.user.userId
   if (balanceId) req.body.balance = balanceId
   delete req.body.balanceId
   const transaction = await Transaction.create(req.body)

   if (balanceId) {
      const delta = getBalanceDelta(transaction.transactionType, transaction.amount)
      await Balance.findOneAndUpdate(
         { _id: balanceId, user: req.user.userId },
         { $inc: { balance: delta } }
      )
   }

   const payload = { transaction }
   if (balanceId) {
      const balance = await Balance.findById(balanceId).lean()
      if (balance) payload.balance = balance
   }
   res.status(StatusCodes.CREATED).json(payload)
}

const getAllTransactions = async (req, res) => {
   const { type, limit = 20, skip = 0, balanceId } = req.query
   const query = { user: req.user.userId }

   if (type && ['expense', 'revenue'].includes(type)) {
      query.transactionType = type
   }
   if (balanceId) {
      query.balance = balanceId
   }

   const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .lean()

   const total = await Transaction.countDocuments(query)

   res.status(StatusCodes.OK).json({
      transactions,
      total,
      limit: Number(limit),
      skip: Number(skip),
   })
}

const getTransaction = async (req, res) => {
   const { id: transactionId } = req.params
   const transaction = await Transaction.findOne({
      _id: transactionId,
      user: req.user.userId,
   })

   if (!transaction) {
      throw new NotFoundError(`No transaction with id ${transactionId}`)
   }

   res.status(StatusCodes.OK).json({ transaction })
}

const updateTransaction = async (req, res) => {
   const { id: transactionId } = req.params
   const oldTransaction = await Transaction.findOne({
      _id: transactionId,
      user: req.user.userId,
   })
   if (!oldTransaction) {
      throw new NotFoundError(`No transaction with id ${transactionId}`)
   }

   if (oldTransaction.balance) {
      const deltaOld = getBalanceDelta(
         oldTransaction.transactionType,
         oldTransaction.amount
      )
      await Balance.findOneAndUpdate(
         { _id: oldTransaction.balance, user: req.user.userId },
         { $inc: { balance: -deltaOld } }
      )
   }

   const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
   )

   if (transaction.balance) {
      const deltaNew = getBalanceDelta(transaction.transactionType, transaction.amount)
      await Balance.findOneAndUpdate(
         { _id: transaction.balance, user: req.user.userId },
         { $inc: { balance: deltaNew } }
      )
   }

   res.status(StatusCodes.OK).json({ transaction })
}

const deleteTransaction = async (req, res) => {
   const { id: transactionId } = req.params
   const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: req.user.userId,
   })

   if (!transaction) {
      throw new NotFoundError(`No transaction with id ${transactionId}`)
   }

   if (transaction.balance) {
      const delta = getBalanceDelta(transaction.transactionType, transaction.amount)
      await Balance.findOneAndUpdate(
         { _id: transaction.balance, user: req.user.userId },
         { $inc: { balance: -delta } }
      )
   }

   res.status(StatusCodes.OK).json({ message: 'Transaction removed' })
}

module.exports = {
   createTransaction,
   getAllTransactions,
   getTransaction,
   updateTransaction,
   deleteTransaction,
}
