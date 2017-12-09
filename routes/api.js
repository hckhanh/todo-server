const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const tracker = require('../tracker')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Any query from /api route will be check the access_token in "params" or Authorization on "header"
 */
router.use((req, res, next) => {
  const token = req.headers['Authorization'] || req.query['access_token']
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

const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

const root = { hello: () => 'Hello world!' }

/**
 * GET api for graphQL
 */
router.all('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

module.exports = router
