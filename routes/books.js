const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');
const { response } = require('express');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

const upload = multer({
  dest: uploadPath,
  fileFilter: (request, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

const renderNewPage = async (response, book, hasError = false) => {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = 'Error creating new book';
    response.render('bookz/new', params);
  } catch (err) {
    console.error(err.message);
    response.redirect('/bookz');
  }
};

// see 32:30  https://www.youtube.com/watch?v=Zi2UwhpooF8
const removeBookCover = (fileName) => {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) {
      console.error(err);
    }
  });
};

// ***** ROUTES BELOW *******

// ALL BOOKS ROUTE
router.get('/', async (request, response) => {
  response.send('all books');
});

// NEW BOOK ROUTE
router.get('/new', async (request, response) => {
  renderNewPage(response, new Book());
});

// CREATE NEW BOOK ROUTE
router.post('/', upload.single('cover'), async (request, response) => {
  const fileName = request.file != null ? request.file.filename : null;

  const book = new Book({
    title: request.body.title,
    author: request.body.author,
    publishDate: new Date(request.body.publishDate),
    pageCount: request.body.pageCount,
    coverImageName: fileName,
    description: request.body.description,
  });
  try {
    const newBook = await book.save();
    // response.redirect(`bookz/${newBookz.id}`);
    response.redirect('bookz');
  } catch {
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    renderNewPage(response, book, true);
  }
});

module.exports = router;
