const express = require('express');
const router = express.Router();
const Book = require('../model/Book');
const upload = require('../controllers/FileUploading');
const authenticateToken = require('../middleware/authenticateToken');

// Route to get all books ...
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();

        if(books.length == 0) {
            res.status(404).send("No Books Found");
        } else {
            res.status(200).json({message: "Books found", data: books});
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}); 

// Route to get the latest books ...
router.get('/books/latest', async (req, res) => {
    try {
        // retrieve a list of Book objects from a database, 
        // (likely using Mongoose or a similar library) where the createdDate of each book is within the last 7 days ...
        // const books = await Book.find(book => book.createdDate > new Date().setDate(new Date().getDate() - 7));
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const books = await Book.find({ createdDate: { $gt: oneWeekAgo } });

        if(books.length == 0) {
            res.status(404).send("No Books Found");
        } else {
            res.status(200).json({message: "Books found", data: books});
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}); 

// Route to get a book by its ID ...
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if(!book) {
            res.status(404).send("Book not found");
        } else {
            res.status(200).json({message: "Book found", data: book});
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}); 

// Route to get a book by its name ...
router.get('/books/name/:name', async (req, res) => {
    try {
        // Check whether the book exists ...
        const book = await Book.findOne({ name: req.params.name });

        if (!book) {
            res.status(404).send("Book not found");
        } else {
            res.status(200).json({ message: "Book found", data: book });
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Route to add a book ...
router.post('/books/add', upload.single('image'), async (req, res) => {
    try {
        console.log(req.file);
        const { name, auther, publishers, publishedYear, description, price, genre } = req.body;
        // Declare the image path and name...
        const imagePath = req.file ? req.file.path : null;
        console.log(imagePath);
        const imageName = req.file ? req.file.filename : null; 
        console.log(imageName);

        // Check if the book exists ...
        const existingBook = await Book.findOne({ name: name, auther: auther, publishers: publishers, publishedYear: publishedYear, description: description, price: price, genre: genre });
        console.log(existingBook);
        console.log(existingBook.image.name , existingBook.image.path);
        if (existingBook) {
            res.status(409).send("Book already exists");
        } else {
            if(existingBook.image.name !== null && existingBook.image.name !== null) {
                // Condition one ... already exists an image ... now adding another image to change the image ...
                    if(req.file) {
                        // save the book data ...
                        var book = await Book.create(
                            { 
                                name: name, 
                                auther: auther, 
                                publishers: publishers, 
                                description: description, 
                                price: price, 
                                genre: genre, 
                                publishedYear: publishedYear, 
                                image: {path: imagePath, name: imageName} 
                            }
                        );
                    } else {
                        // Condition two ... there is an existing image ... not adding another image to change the image ...
                        // save the book data ...
                        var book = await Book.create(
                            { 
                                name: name, 
                                auther: auther, 
                                publishers: publishers, 
                                description: description, 
                                price: price, 
                                genre: genre, 
                                publishedYear: publishedYear, 
                            }
                        );
                    }
            } else {
                // Condition three ... no existing image ... now adding another image to change the image ...
                // save the book data ...
                var book = await Book.create(
                    { 
                        name: name, 
                        auther: auther, 
                        publishers: publishers, 
                        description: description, 
                        price: price, 
                        genre: genre, 
                        publishedYear: publishedYear, 
                        image: imagePath ? {path: imagePath, name: imageName} : {path: null, name: null} 
                    }
                );    
            } 

            res.status(201).json({ message: "Book added", data: book });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }
});

// Route to update a book ...
router.put('/books/update/:name', upload.single('image'), async (req, res) => {
    try {
        console.log(req.file);
        const { name, auther, publishers, publishedYear, description, price, genre } = req.body;
        // Declare the image path and name...
        const imagePath = req.file ? req.file.path : null;
        console.log(imagePath);
        const imageName = req.file ? req.file.filename : null; 
        console.log(imageName);
        // Check if the book exists ...
        const book = await Book.findOne({name: req.params.name});
        if(book) {
            if(book.image.path !== null && book.image.name !== null) {
                if(req.file) {
                    // Update the book details ...
                    var updateBook = await Book.findOneAndUpdate( { name: req.params.name }, { $set: { name: name, auther: auther, publisher: publishers, publishedYear: publishedYear, description: description, price: price, genre: genre, image: {path: imagePath, name: imageName }}}, { new: true, runValidators: true });
                } else {
                    // Update the book details ...
                    var updateBook = await Book.findOneAndUpdate( { name: req.params.name }, { $set: {name: name, auther: auther, publisher: publishers, publishedYear: publishedYear, description: description, price: price, genre: genre}}, { new: true, runValidators: true });
                }
            } else {
                // Update the book details ...
                var updateBook = await Book.findOneAndUpdate({ name: req.params.name }, { $set: {name: name, auther: auther, publisher: publishers, publishedYear: publishedYear, description: description, price: price, genre: genre, image: imagePath ? {path: imagePath, name: imageName} : {path: null, name: null}}}, { new: true, runValidators: true });
            } 
            res.status(200).json({message: "Book updated", data: updateBook});
        } else {
            res.status(404).send("Book not found");
            console.log("Book not found");
        }
    } catch (error) {
        console.log(error.message);
        console.log(error.status);
        return res.status(500).send(error.message);
    }
});

// Route to delete a book ...
router.delete('/books/delete/:name', async (req, res) => {
    try {
        // Delete the book ...
        const deleteBook = await Book.findOneAndDelete({name: req.params.name});
        if(!deleteBook) {
            res.status(404).send("Book not found");
        } else {
            res.status(200).json({message: "Book deleted", data: deleteBook});
        }
    } catch (error) {
        console.error(error.message);
        return req.status(500).send(error.message);
    }
});

module.exports = router;