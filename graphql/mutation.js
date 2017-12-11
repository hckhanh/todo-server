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
const User = require('./schema/user')
const UserRegistration = require('./schema/user-registration')
const AccessToken = require('./schema/access-token')
const { connect } = require('../database')

const JWT_SECRET = process.env.JWT_SECRET

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The implementation for Mutation type to modify server-side data',
  fields: {
    login: {
      type: User,
      description: 'Request a login session token by providing user\'s credentials',
      args: {
        username: {
          type: GraphQLString,
          description: 'Unique name of user to distinguish and verify user'
        },
        password: {
          type: GraphQLString,
          description: 'You know that, dude!'
        }
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
              const Session = db.collection('session')

              // Add user to database
              const userResult = await User.insertOne(args.registration)
              const userId = userResult.insertedId

              // Generate access token and session
              const createdAt = moment()
              const expiredAt = createdAt.clone().add(15, 'd') // token will be expired after 15 days

              const sessionResult = await Session.insertOne({
                userId,
                ip: context.clientIp,
                created_at: createdAt.toDate(),
                expired_at: expiredAt.toDate()
              })

              const payload = { userId, sessionId: sessionResult.insertedId }
              const token = await jwt.sign(payload, JWT_SECRET, {
                noTimestamp: true,
                expiresIn: expiredAt.diff(createdAt) / 1000
              })

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
