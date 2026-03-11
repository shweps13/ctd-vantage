const filterXSS = require('xss')

function sanitizeObject(obj) {
   if (obj === null || typeof obj !== 'object') {
      return obj
   }
   if (Array.isArray(obj)) {
      return obj.map((item) =>
         typeof item === 'string' ? filterXSS(item) : sanitizeObject(item)
      )
   }
   const out = {}
   for (const key of Object.keys(obj)) {
      const val = obj[key]
      out[key] =
         typeof val === 'string' ? filterXSS(val) : sanitizeObject(val)
   }
   return out
}

function xssSanitize(req, res, next) {
   if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body)
   }
   next()
}

module.exports = xssSanitize
