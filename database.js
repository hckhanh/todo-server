const MongoClient = require('mongodb').MongoClient
const tracker = require('./tracker')

// Connection URL
const dbUrl = process.env.DATABASE_URL

// Database Name
const dbName = process.env.DATABASE_NAME

async function createCapped(db) {
  return await db.createCollection('myCollection', { 'capped': true, 'size': 100000, 'max': 5000 })
}

module.exports.connect = async (callback) => {
  // Use connect method to connect to the server
  try {
    const client = await MongoClient.connect(dbUrl)
    const db = await client.db(dbName)

    await callback(db)

    client.close()
  } catch (error) {
    tracker.error(error)
  }
}

module.exports.initDatabase = () => {

  module.exports.connect(async (db) => {
    const User = db.collection('user')
    const Session = db.collection('session')

    // Create indexes for User, Session
    User.createIndex('username', { unique: true }).catch(tracker.error)
    Session.createIndex('ip', { unique: true }).catch(tracker.error)
  })
}
