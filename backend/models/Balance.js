const mongoose = require('mongoose')

const BalanceSchema = new mongoose.Schema(
   {
      accountType: {
         type: String,
         required: [true, 'Account type is required'],
         enum: {
            values: ['Credit Card', 'Checking', 'Savings', 'Investment', 'Loan'],
            message: '{VALUE} is not a valid account type',
         },
      },
      bankName: {
         type: String,
         required: [true, 'Bank name is required'],
         trim: true,
         maxlength: [20, 'Bank name cannot exceed 20 characters'],
      },
      accountNumber: {
         type: String,
         required: [true, 'Account number is required'],
         trim: true,
         maxlength: [16, 'Account number cannot exceed 16 characters'],
      },
      balance: {
         type: Number,
         required: true,
         default: 0,
      },
      branchName: {
         type: String,
         trim: true,
         maxlength: [50, 'Branch name cannot exceed 50 characters'],
         default: '',
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
   },
   { timestamps: true }
)

BalanceSchema.index({ user: 1 })

module.exports = mongoose.model('Balance', BalanceSchema)
