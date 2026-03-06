const Transaction = require('../models/Transaction')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

const createTransaction = async (req, res) => {
   req.body.user = req.user.userId
   const transaction = await Transaction.create(req.body)
   res.status(StatusCodes.CREATED).json({ transaction })
}

const getAllTransactions = async (req, res) => {
   const { type, limit = 20, skip = 0 } = req.query
   const query = { user: req.user.userId }

   if (type && ['expense', 'revenue'].includes(type)) {
      query.transactionType = type
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
   const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
   )

   if (!transaction) {
      throw new NotFoundError(`No transaction with id ${transactionId}`)
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

   res.status(StatusCodes.OK).json({ message: 'Transaction removed' })
}

module.exports = {
   createTransaction,
   getAllTransactions,
   getTransaction,
   updateTransaction,
   deleteTransaction,
}
