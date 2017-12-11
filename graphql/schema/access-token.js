const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

const AccessToken = new GraphQLObjectType({
  name: 'AccessToken',
  description: 'Access token is created when user login to access authenticated data',
  fields: {
    token: {
      type: GraphQLString,
      description: 'Token string to access data'
    },
    expired_at: {
      type: GraphQLString,
      description: 'The time this token will be expired'
    }
  }
})

module.exports = AccessToken
