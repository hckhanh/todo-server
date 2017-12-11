const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql')
const moment = require('moment')
const jwt = require('../jwt')
const bcrypt = require('../bcrypt')
const { connect } = require('../database')

const UserRegistration = require('./schema/user-registration')
const AccessToken = require('./schema/access-token')
const UserCredentials = require('./schema/user-credentials')

const JWT_SECRET = process.env.JWT_SECRET

async function generateToken(db, userId, context) {

  // Generate access token and session
  const createdAt = moment()
  const expiredAt = createdAt.clone().add(15, 'd') // token will be expired after 15 days

  const session = {
    userId,
    ip: context.clientIp,
    created_at: createdAt.toDate(),
    expired_at: expiredAt.toDate()
  }
  const Session = db.collection('session')
  const sessionResult = Session.findOneAndUpdate({ userId, ip: context.clientIp }, session, { upsert: true })

  const payload = { userId, sessionId: sessionResult.insertedId }
  const token = await jwt.sign(payload, JWT_SECRET, {
    noTimestamp: true,
    expiresIn: expiredAt.diff(createdAt) / 1000
  })

  return { expiredAt, token }
}

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The implementation for Mutation type to modify server-side data',
  fields: {
    login: {
      type: AccessToken,
      description: 'Request a login session token by providing user\'s credentials',
      args: {
        credentials: {
          type: UserCredentials,
          description: 'Identified information to verify user'
        }
      },
      resolve: (obj, args, context) => {
        return new Promise((resolve, reject) => {
          connect(async db => {
            try {
              const User = db.collection('user')

              const credentials = args.credentials
              const user = await User.findOne({ username: credentials.username })

              if (user) {
                const correct = await bcrypt.compare(credentials.password, user.password)
                if (correct) {
                  const { expiredAt, token } = await generateToken(db, user._id, context)
                  resolve({ token, expired_at: expiredAt.toISOString() })
                } else {
                  reject(new Error('Incorrect credentials'))
                }
              } else {
                reject(new Error('Incorrect credentials'))
              }
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    },
    register: {
      type: AccessToken,
      description: 'Sign up an account to the database and return back the session token',
      args: {
        registration: {
          type: UserRegistration,
          description: 'User information which is used to register an account'
        }
      },
      resolve: (obj, args, context) => {
        return new Promise((resolve, reject) => {
          connect(async db => {
            try {
              const User = db.collection('user')

              // Encrypt password by bcrypt algorithm
              const registration = args.registration
              registration.password = await bcrypt.hash(registration.password, 10)

              // Add user to database
              const userResult = await User.insertOne(registration)
              const userId = userResult.insertedId

              const { expiredAt, token } = await generateToken(db, userId, context)
              resolve({ token, expired_at: expiredAt.toISOString() })
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    }
  }
})

module.exports = Mutation
