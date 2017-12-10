const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql')
const User = require('./schema/user')

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'A schema object of graphQL',
  fields: {
    user: {
      type: User,
      description: 'Current user of the session'
    }
  }
})

module.exports = Query
