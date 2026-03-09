const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
   {
      itemDescription: {
         type: String,
         required: [true, 'Provide item description'],
         trim: true,
         maxlength: [200, 'Item description cannot exceed 200 characters'],
      },
      shopName: {
         type: String,
         required: [true, 'Provide shop name'],
         trim: true,
         maxlength: [100, 'Shop name cannot exceed 100 characters'],
      },
      date: {
         type: Date,
         required: [true, 'Provide transaction date'],
         default: Date.now,
      },
      paymentMethod: {
         type: String,
         required: [true, 'Provide payment method'],
         enum: {
            values: ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other'],
            message: '{VALUE} is not a valid payment method',
         },
      },
      amount: {
         type: Number,
         required: [true, 'Provide amount'],
         min: [0, 'Amount cannot be negative'],
      },
      transactionType: {
         type: String,
         required: [true, 'Provide transaction type'],
         enum: {
            values: ['expense', 'revenue'],
            message: '{VALUE} is not valid. Use "expense" or "revenue".',
         },
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Provide user'],
      },
      balance: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Balance',
         default: null,
      },
   },
   { timestamps: true }
)

TransactionSchema.index({ user: 1, date: -1 })
TransactionSchema.index({ user: 1, transactionType: 1 })
TransactionSchema.index({ user: 1, balance: 1 })

module.exports = mongoose.model('Transaction', TransactionSchema)
