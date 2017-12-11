const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const graphqlHTTP = require('express-graphql')
const requestIp = require('request-ip')

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
router.use((req, res, next) => {
  const token = req.headers['Authorization'] || req.query['access_token'] || req.body['access_token']
  if (token) {
    jwt.verify(token, JWT_SECRET, (error, user) => {
      if (error) {
        return tracker.error(error)
      }

      // user credentials are added to graphQL context
      req.user = user
    })
  }

  next()
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
