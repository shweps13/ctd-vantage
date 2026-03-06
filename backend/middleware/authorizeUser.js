const { ForbiddenError } = require('../errors')


const authorizeUser = (req, res, next) => {
  const { userId: paramUserId } = req.params
  const authenticatedUserId = req.user?.userId?.toString()

  if (!paramUserId || !authenticatedUserId || paramUserId !== authenticatedUserId) {
    throw new ForbiddenError('Access denied')
  }

  next()
}

module.exports = authorizeUser
