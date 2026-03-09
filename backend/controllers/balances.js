const Balance = require('../models/Balance')
const Transaction = require('../models/Transaction')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

const createBalance = async (req, res) => {
   req.body.user = req.user.userId
   const balance = await Balance.create(req.body)
   res.status(StatusCodes.CREATED).json({ balance })
}

const getAllBalances = async (req, res) => {
   const balances = await Balance.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .lean()
   res.status(StatusCodes.OK).json({ balances })
}

const getBalance = async (req, res) => {
   const { id: balanceId } = req.params
   const balance = await Balance.findOne({ _id: balanceId, user: req.user.userId })

   if (!balance) {
      throw new NotFoundError(`No balance with id ${balanceId}`)
   }

   res.status(StatusCodes.OK).json({ balance })
}

const updateBalance = async (req, res) => {
   const { id: balanceId } = req.params
   const balance = await Balance.findOneAndUpdate(
      { _id: balanceId, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
   )

   if (!balance) {
      throw new NotFoundError(`No balance with id ${balanceId}`)
   }

   res.status(StatusCodes.OK).json({ balance })
}

const deleteBalance = async (req, res) => {
   const { id: balanceId } = req.params
   const balance = await Balance.findOneAndDelete({
      _id: balanceId,
      user: req.user.userId,
   })

   if (!balance) {
      throw new NotFoundError(`No balance with id ${balanceId}`)
   }

   res.status(StatusCodes.OK).json({ message: 'Balance removed' })
}

const getBalanceDetails = async (req, res) => {
   const { balanceId } = req.params
   const { limit = 10, skip = 0 } = req.query

   const balance = await Balance.findOne({ _id: balanceId, user: req.user.userId }).lean()
   if (!balance) {
      throw new NotFoundError(`No balance with id ${balanceId}`)
   }

   const transactions = await Transaction.find({
      user: req.user.userId,
      balance: balanceId,
   })
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .lean()

   const total = await Transaction.countDocuments({
      user: req.user.userId,
      balance: balanceId,
   })

   res.status(StatusCodes.OK).json({
      balanceInfo: balance,
      transactions,
      total,
      limit: Number(limit),
      skip: Number(skip),
   })
}

module.exports = {
   createBalance,
   getAllBalances,
   getBalance,
   updateBalance,
   deleteBalance,
   getBalanceDetails,
}
