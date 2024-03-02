const express = require('express');
const config = require("./config.js");
const mongoose = require('mongoose');
const Book = require("./models/bookstoremodel");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

mongoose.connect(config.mongostring)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(config.port, () => {
            console.log(`Listening on port ${config.port}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
// for getting all the books
app.get('/get/books', async (req, res) => {
    try {
        const booktable = await Book.find();
        return res.json({
            count: booktable.length,
            data: booktable
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// for getting one book
// for getting one book
app.get('/get/books/:id', async (req, res) => {
    try {
        const { id } = req.params; // Change 'request' to 'req'
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put('/get/books/:id', async (req, res) => {
    try {
        // Assuming you have a database connection and a Book model
        const { id } = req.params;

        // Retrieve the book from the database
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update the book properties with data from the request
        if (req.body.title) {
            book.title = req.body.title;
        }

        if (req.body.author) {
            book.author = req.body.author;
        }

        // You can add more fields as needed

        // Save the updated book back to the database
        await book.save();

        res.status(200).json({ message: 'Book updated successfully', updatedBook: book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.delete('/get/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Assuming you have a database connection and a Book model
        const result = await Book.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Use POST to add new books
app.post('/get/books', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author) {
            return res.status(400).json({ message: "Title and author are required." });
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
        };
        const book = await Book.create(newBook);
        return res.status(201).json(book);
    } catch (error) {
        console.error("Error adding a book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});