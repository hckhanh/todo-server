const Rollbar = require('rollbar')

const isProduction = process.env.NODE_ENV === 'production'

const rollbar = new Rollbar({
  enabled: isProduction,
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: isProduction,
  captureUnhandledRejections: isProduction
})

module.exports = {
  errorHandler() {
    return rollbar.errorHandler()
  },
  error(...args) {
    !isProduction && console.error(...args)
    return rollbar.error(...args)
  }
}
