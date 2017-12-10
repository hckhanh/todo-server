const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

const Session = new GraphQLObjectType({
  name: 'Session',
  description: 'A session of a user when user sign in the system',
  fields: {
    id: {
      type: GraphQLID,
      description: 'id of session'
    },
    userId: {
      type: GraphQLID,
      description: 'Id of a user who has signed in'
    },
    ip: {
      type: GraphQLString,
      description: 'Unique ip from the user per session'
    }
  }
})

module.exports = Session
