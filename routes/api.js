const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const tracker = require('../tracker')

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Any query from /api route will be check the access_token in "params" or Authorization on "header"
 */
router.use((req, res, next) => {
  const token = req.headers['Authorization'] || req.query['access_token']
  if (token) {
    jwt.verify(token, JWT_SECRET, (error, user) => {
      if (error) {
        tracker.error(error)
      }
      req.user = user
    })
  }

  next()
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource', req.user)
})

module.exports = router
