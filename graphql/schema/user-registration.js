const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

const UserRegistration = new GraphQLInputObjectType({
  name: 'UserRegistration',
  description: 'A bunch of user information for signing up an account to database',
  fields: {
    name: {
      type: GraphQLString,
      description: 'display name of the user'
    },
    username: {
      type: GraphQLString,
      description: 'The unique name of the user is used to login or verify'
    },
    password: {
      type: GraphQLString,
      description: 'Secret key for user account'
    }
  }
})

module.exports = UserRegistration
