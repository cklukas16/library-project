// Get the required modules
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const credentials = require('./credentials.json');

// Initialization
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
const app = express();
app.use(fileUpload());
app.use(bodyParser.json());

const bookData = path.join(__dirname, 'books.json');
const coverPath = path.join(__dirname, 'images', 'covers');

// set the port
require('dotenv').config();
const port = process.env.PORT || 3000;

// Import books
import { Book } from './book';
let books: Book[] = [];

fs.readFile(bookData, (err: any, data: any) => {
    if (err) {
        console.error(`Unable to file: ${bookData}`);
    } else {
        books = JSON.parse(data);
    }
});

// Create a GET endpoint for books
app.get('/api/books', (req: any, resp: any) => {
    if (req.query.title) {
        const booksReq = books.filter(book => book.title.includes(req.query.title));
        resp.status(200);
        return resp.json(booksReq);
    } else {
        resp.status(200);
        return resp.json(books);
    }
});

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

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});