const MongoClient = require('mongodb').MongoClient
const ms = require('ms')
const tracker = require('./tracker')

// Connection URL
const dbUrl = process.env.DATABASE_URL

// Database Name
const dbName = process.env.DATABASE_NAME

module.exports.connect = async (callback) => {
  // Use connect method to connect to the server
  const client = await MongoClient.connect(dbUrl)
  const db = await client.db(dbName)

  await callback(db)

  client.close()
}

module.exports.initDatabase = () => {
  try {
    module.exports.connect(async (db) => {
      const User = db.collection('user')
      const Session = db.collection('session')

      // Username shoule be unique
      User.createIndex('username', { unique: true }, (error) => {
        error && tracker.error(error)
      })

      // Create ascending index for name
      User.createIndex('name', (error) => {
        error && tracker.error(error)
      })

      // IP must be unique
      Session.createIndex('ip', { unique: true }, (error) => {
        error && tracker.error(error)
      })

      // Session will be expired after 15 days
      Session.createIndex('expired_at', { expireAfterSeconds: 0 }, (error) => {
        error && tracker.error(error)
      })
    })
  } catch (error) {
    tracker.error(error)
    process.exit()
  }
}
