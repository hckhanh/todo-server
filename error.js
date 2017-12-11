const isProduction = process.env.NODE_ENV === 'production'

let formatError

if (isProduction) {
  formatError = (error) => ({
    message: error.message,
    locations: error.locations,
    path: error.path
  })
} else {
  formatError = (error) => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path
  })
}

module.exports.formatError = formatError
