const express = require('express')
const router = express.Router()
const graphqlHTTP = require('express-graphql')
const requestIp = require('request-ip')

const jwt = require('../jwt')
const tracker = require('../tracker')
const schema = require('../graphql/schema')
const { formatError } = require('../error')

const JWT_SECRET = process.env.JWT_SECRET

/**
 * filter out current ip of the user from the current request
 */
router.use(requestIp.mw())

/**
 * any schema from /api route will be check the access_token in "params" or Authorization on "header" or "body"
 */
router.use(async (req, res, next) => {
  try {
    const token = req.headers['authorization'] || req.query['access_token'] || req.body['access_token']
    if (token) {
      // user credentials are added to graphQL context
      req.auth = await jwt.verify(token, JWT_SECRET)
    }

    next()
  } catch (error) {
    next(error)
  }
})

/**
 * GET api for graphQL
 */
router.all('/', graphqlHTTP({
  schema: schema,
  graphiql: true,
  formatError
}))

module.exports = router
