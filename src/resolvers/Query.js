const moment = require('moment')
const { getUserId } = require('./../utils')

function user (_, args, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.query.user({where: {id: userId}}, info)
}

function accounts (_, args, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.query.accounts({
    where: {
      OR: [
        { user: { id: userId } },
        { user: null }
      ]
    },
    orderBy: 'description_ASC'
  }, info)
}

function records (_, { type, month, accountIds, categoriesIds }, ctx, info) {
  const userId = getUserId(ctx)
  const AND = [ {user: {id: userId}} ]

  if(type) 
    AND.push({type})
  if(accountIds && accountIds.length > 0) 
    AND.push({OR: accountIds.map(id => ({account: {id}})) })
  if(categoriesIds && categoriesIds.length > 0) 
    AND.push({OR: categoriesIds.map(id => ({category: {id}})) })
  if(month) {
    const date = moment(month, 'MM-YYYY')
    AND.push({date_gte: date.startOf('month').toISOString()})
    AND.push({date_lte: date.endOf('month').toISOString()})
  }

  return ctx.db.query.records({
    where: {AND},
    orderBy: 'date_ASC'
  }, info)
}

function categories (_, { operation }, ctx, info) {
  const userId = getUserId(ctx)
  let AND = [
    {
      OR: [
        { user: { id: userId } },
        { user: null }
      ]
    }
  ]

  AND = !operation ? AND : [...AND, {operation}]

  return ctx.db.query.categories({
    where: { AND },
    orderBy: 'description_ASC'
  }, info)
}

module.exports = {
  user,
  accounts,
  categories,
  records
}
