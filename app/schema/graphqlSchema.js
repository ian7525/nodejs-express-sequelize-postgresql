const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLID,
} = require('graphql')

const db = require('../models')
const Tutorial = db.tutorials

const TutorialType = new GraphQLObjectType({
  name: 'Tutorial',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    published: { type: GraphQLBoolean },
  },
})

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    tutorials: {
      type: new GraphQLList(TutorialType),
      resolve(parent, args) {
        console.log('args=', args)
        return Tutorial.findAll()
      },
    },
    tutorial: {
      type: TutorialType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Tutorial.findByPk(args.id)
      },
    },
    publishedTutorials: {
      type: new GraphQLList(TutorialType),
      resolve(parent, args) {
        return Tutorial.findAll({ where: { published: true } })
      },
    },
  },
})

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTutorial: {
      type: TutorialType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        published: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        return Tutorial.create({
          title: args.title,
          description: args.description,
          published: args.published,
        })
      },
    },
    updateTutorial: {
      type: TutorialType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        published: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        return Tutorial.update(
          {
            title: args.title,
            description: args.description,
            published: args.published,
          },
          { where: { id: args.id } }
        ).then(() => Tutorial.findByPk(args.id))
      },
    },
    deleteTutorial: {
      type: TutorialType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Tutorial.destroy({ where: { id: args.id } })
      },
    },
    deleteAllTutorial: {
      type: GraphQLString,
      resolve(parent, args) {
        return Tutorial.destroy({ where: {} }).then(
          () => 'All tutorials deleted'
        )
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationType,
})
