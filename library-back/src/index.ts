// Get the required modules
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require("cors");
import { Book } from './book';

// Initial the application
const app = express();
app.use(fileUpload());
//app.use(bodyParser.raw({ type: ['image/jpeg', 'image/png'], limit: '5mb' }));
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

// set the port
const port = process.env.PORT || 3000;

// set directories
const coverPath = path.join(__dirname, 'images', 'covers');
const bookData = path.join(__dirname, 'books.json');

// Read the books.json file
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
        const index = books.indexOf(book);
        books.splice(index, 1);
        resp.status(200);
        return resp.json(book);
    } else {
        resp.status(404);
        return resp.json({
            error: `Book with id ${req.params.id} is not found`
        });
    }
});

/* ========================================== */

app.get('/api/covers/:name', (req: any, resp: any) => {
    console.log("Hello");
    resp.status(200);
});

app.post('/api/covers', (req: any, resp: any) => {

    let file = req['files'].cover;
    console.log("File uploaded: ", file.name);
    
    resp.sendStatus(200);

 });

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});