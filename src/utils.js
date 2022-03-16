const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

function getUserId (ctx) {
  const Authorization = ctx.request.get('Authorization')
  if(!Authorization) throw new Error('Not authenticated!')

  const token = Authorization.replace('Bearer ', '')
  const {userId} = jwt.verify(token, JWT_SECRET)

  return userId
}

module.exports = { getUserId }
