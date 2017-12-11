const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

const UserCredentials = new GraphQLInputObjectType({
  name: 'UserCredentials',
  description: 'A bunch of user information for signing up an account to database',
  fields: {
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

module.exports = UserCredentials
