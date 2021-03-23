const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");
const Review = require("../models/review");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
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
        return Author.findById(parent.authorId);
      },
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent, args) {
        return Review.find({ bookId: parent.id  })
      } 
    }
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
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    body: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      },
    },
    review: {
      type: ReviewType,
      args: { id: {  type: GraphQLID } },
      resolve(parent, args) {
        return Review.findById(args.id)
      }
    },
    // hobby: {
    //   type: HobbyType,
    //   args: { title: { type: GraphQLString } },
    //   resolve(parent, args) {
    //     return Hobby.find({ title: args.title });
    //   },
    // },
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
        title: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        if (args.title.length < 1 || args.genre.length < 1) {
          throw new Error("empty string not allowed");
        }
        let book = new Book({
          title: args.title,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
    addReview: {
      type: ReviewType,
      args: {
        body: { type: GraphQLString},
        bookId: {type: GraphQLID}
      },
      resolve(parent, args) {
        let review = new Review({
          body: args.body,
          bookId: args.bookId,
        });
        return review.save();
      }
    }
    // addHobby: {
    //   type: HobbyType,
    //   args: {
    //     title: { type: new GraphQLNonNull(GraphQLString) },
    //     body: {
    //       type: GraphQLString,
    //       defaultValue: "I am placeholder default value",
    //     },
    //   },
    //   resolve(parent, args) {
    //     let hobby = new Hobby({
    //       title: args.title,
    //       body: args.body,
    //     });
    //     return hobby.save();
    //   },
    // },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
