require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose')
const Author = require("./models/author");

// const authors = [
//     {name: 'x', age: 68}, {name: 'y', age: 45}
// ]

const cors = require('cors');

const app = express();
app.use(cors());

app.use('/graphiql', graphqlHTTP({
    schema,
    graphiql: true
}))

const port = process.env.PORT || 4000;
const CONNECTION_URL = process.env.MONGO_DB_URI;

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.once('open', () => {
    console.log('conected to db books-and-authors')
    // authors.map(author => {
    //     let newAuthor = new Author({
    //         name: author.name,
    //         age: author.age
    //     })
    //     newAuthor.save()
    // })
})

app.listen('4000', () => {console.log('server is now listening on port', port)})