// Get the required modules
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
// Mongo DB
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const multer = require('multer');
const CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.6iackud.mongodb.net/?retryWrites=true&w=majority";
const DATABASENAME="librarydb";
let database: any;

// Initialization
const app = express();
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());

// Set dirctories
const bookData = path.join(__dirname, 'data', 'books.json');
const coverPath = path.join(__dirname, 'images', 'covers');
const userData = path.join(__dirname, 'data', 'users.json');
const adminData = path.join(__dirname, 'data', 'admins.json');

// Set the port
require('dotenv').config();
const port = process.env.PORT || 3000;

// Import data
let books: any[] = [];
let users: any[] = [];

fs.readFile(bookData, (err: any, data: any) => {
    if (err) {
        console.error(`Unable to file: ${bookData}`);
    } else {
        books = JSON.parse(data);
    }
});

fs.readFile(userData, (err: any, data: any) => {
    if (err) {
        console.error(`Unable to file: ${userData}`);
    } else {
        users = JSON.parse(data);
    }
});

//test http://localhost:3000/api/test to see if it is connected with Mongo db
app.get('/api/test', (req: any, res: any)=> {
    database.collection("books").find({}).toArray((error: any, result: any)=>{
      res.send(result);
    })
  });

// Create a GET endpoint for users
app.get('/api/users/:email', (req: any, resp: any) => {
    const user = users.find(user => user.email == req.params.email);
    if (user) {
        resp.status(200);
        return resp.json(user);
    } else {
        resp.status(404);
        return resp.json({
            error: `User with email ${req.params.email} is not found`
        });
    }
});

// Create a GET endpoint for users with Mongo DB
app.get('/api-test/users/:email', async (req: any, resp: any) => {
    const user = await database.collection("users").findOne({email:req.params.email});
    if (user) {
        resp.status(200);
        return resp.json(user);
    } else {
        resp.status(404);
        return resp.json({
            error: `User with email ${req.params.email} is not found`
        });
    }
})

// Create a PUT endpoint for users
app.put('/api/users', (req: any, resp: any) => {
    const userNew = req.body;
    const userOri = users.find(user => user.email == userNew.email);
    if (userOri) {
        const index = users.indexOf(userOri);
        users[index] = userNew;
    }
    resp.status(200);
    return resp.json(userNew);
});

// Create a PUT endpoint for users with Mongo DB, not tested yet
// TODO test this put function
app.put('/api-test/users', async (req: any, resp: any)=> {
    const userNew = req.body;
    const userOri = await database.collection("users").findOne({email:req.params.email});
    if (userOri) {
        await database.collection("users").updateOne(
            {email: req.params.email},
            {$set: {
                name: userNew.name,
                currentBorrows: userNew.currentBorrows,
                historyBorrows: userNew.historyBorrows
            }}
        )
        resp.status(200);
        return resp.json(userNew);
    }
    return resp.status(400);
})

// Create a POST endpoint for users
app.post('/api/users', (req: any, resp: any) => {
    const userNew = req.body;
    users.push(userNew);
    resp.status(200);
    return resp.json(userNew);
});

// Create a POST endpoint for users in Mongo DB
// TODO
app.post('/api-test/users', async (req: any, resp: any) => {

})

// Create a GET endpoint for books
app.get('/api/books', (req: any, resp: any) => {
    if (req.query.title) {
        const booksReq = books.filter(book => book.title.toUpperCase().includes(req.query.title.toUpperCase()));
        resp.status(200);
        return resp.json(booksReq);
    } else {
        resp.status(200);
        return resp.json(books);
    }
});

// Create a GET endpoint for books in Mongo DB
// TODO
app.get('/api-test/books', async (req: any, resp: any) => {

})

app.get('/api/books/:id', (req: any, resp: any) => {
    const book = books.find(book => book.id == req.params.id);
    if (book) {
        resp.status(200);
        return resp.json(book);
    } else {
        resp.status(404);
        return resp.json({
            error: `Book with id ${req.params.id} is not found`
        });
    }
});

// Create a PUT endpoint for books
app.put('/api/books', (req: any, resp: any) => {
    const bookNew = req.body;
    const bookOri = books.find(book => book.id == bookNew.id);
    if (bookOri) {
        const index = books.indexOf(bookOri);
        books[index] = bookNew;
    }
    resp.status(200);
    return resp.json(bookNew);
});

// Create a POST endpoint for books
app.post('/api/books', (req: any, resp: any) => {
    const bookNew = req.body;
    bookNew.id = books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
    books.push(bookNew);
    resp.status(200);
    return resp.json(bookNew);
});

// Create a DELETE endpoint for books
app.delete('/api/books/:id', (req: any, resp: any) => {
    const book = books.find(book => book.id == req.params.id);
    if (book) {
        const targetPath = path.join(coverPath, `cover${book.id}.jpg`); 
        const index = books.indexOf(book);
        books.splice(index, 1);
        fs.unlink(targetPath, (err: any) => {
            if (!err) {
                console.log(`cover${book.id}.jpg was deleted`);
            }
        });
        resp.status(200);
        return resp.json(book);
    } else {
        resp.status(404);
        return resp.json({
            error: `Book with id ${req.params.id} is not found`
        });
    }
});

// Create a GET endpoint for cover images
app.get('/api/covers/:name', (req: any, resp: any) => {
    const coverPath = path.join(__dirname, 'images', 'covers', req.params.name);
    return resp.sendFile(coverPath);
});

// Create a POST endpoint for cover images
app.post('/api/covers', async (req: any, resp: any) => {
    let file = req.files.cover;
    let targetPath = path.join(coverPath, file.name);
    file.mv(targetPath);
    resp.status(200);
    return resp.json({
        url: `http://localhost:${port}/api/covers/${file.name}`
    });
});

// Listener
app.listen(port, () => {
    //connect to Mongodb
    // MongoClient.connect(CONNECTION_STRING, (error:any, client:any)=> {
    //     database = client.db(DATABASENAME);
    //     console.log("Mongo db connection successful.");
    //   });
    console.log(`Running on port ${port}`);
});