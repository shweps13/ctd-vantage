const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((error) => error.message).join(', ')
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: errors })
  }

  if (err?.name === 'CastError') {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Invalid id' })
  }

  if (err?.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Duplicate value for ${Object.keys(err.keyValue)} field` })
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware
