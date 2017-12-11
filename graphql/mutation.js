const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql')
const User = require('./schema/user')
const UserRegistration = require('./schema/user-registration')
const { connect } = require('../database')

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
      type: User,
      description: 'Sign up an account to the database',
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
              const user = await db.collection('user').insertOne(args.registration)
              resolve(user)
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
