const util = require('util')
const bcrypt = require('bcryptjs')

module.exports = {
  hash: util.promisify(bcrypt.hash),
  compare: util.promisify(bcrypt.compare)
}
