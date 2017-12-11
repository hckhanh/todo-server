const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')
const Session = require('./session')

const User = new GraphQLObjectType({
  name: 'User',
  description: 'A user is an account of the system',
  fields: {
    id: {
      type: GraphQLID,
      description: 'id of user',
      resolve: user => user._id
    },
    name: {
      type: GraphQLString,
      description: 'display name of the user'
    },
    username: {
      type: GraphQLString,
      description: 'The unique name of the user is used to login or verify'
    },
    sessions: {
      type: new GraphQLList(Session),
      description: 'When user login, a session will be added to this list',
      resolve: () => ([])
    }
  }
})

module.exports = User
