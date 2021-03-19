const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");
const Hobby = require("../models/hobby");

//const { books, authors } = require("../data/_Data");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId)
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({authorId: parent.id})
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id)
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id)
      },
    },
    hobby: {
      type: HobbyType,
      args: { title: { type: GraphQLString } },
      resolve(parent, args) {
        return Hobby.find({title: args.title})
      }
    },
    allBooks: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
          return Book.find({});
      },
    },
    allAuthors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
          return Author.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save((err, author) => {
          author.log();
        });
      },
    },
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let book = new Book({
          title: args.title,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
    addHobby: {
      type: HobbyType,
      args: {
        title: {type: GraphQLString },
        body: {type: GraphQLString}
      },
      resolve(parent, args) {
        let hobby = new Hobby({
          title: args.title,
          body: args.body
        })
        return hobby.save()
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
