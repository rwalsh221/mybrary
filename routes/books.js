const express = require('express');
const router = express.Router();
// const path = require('path');
// const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');
const { response } = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
// const uploadPath = path.join('public', Book.coverImageBasePath);

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
// FOR MULTER NO LONGER NEEDED

// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (request, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

const renderNewPage = async (response, book, hasError = false) => {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = 'Error creating new book';
    response.render('books/new', params);
  } catch (err) {
    console.error(err.message);
    response.redirect('/books');
  }
};

// see 32:30  https://www.youtube.com/watch?v=Zi2UwhpooF8
// const removeBookCover = (fileName) => {
//   fs.unlink(path.join(uploadPath, fileName), (err) => {
//     if (err) {
//       console.error(err);
//     }
//   });
// };

// https://youtu.be/Xm5MzWvklbI?t=709
const saveCover = (book, coverEncoder) => {
  if (coverEncoder == null) {
    return;
  }
  const cover = JSON.parse(coverEncoder);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
};

// ***** ROUTES BELOW *******

// ALL BOOKS ROUTE
router.get('/', async (request, response) => {
  let query = Book.find();
  // SEARCH TITLE
  if (request.query.title != null && request.query.title != '') {
    query = query.regex('title', new RegExp(request.query.title, 'i'));
  }
  // SEARCH PUBLISHED BEFORE
  if (
    request.query.publishedBefore != null &&
    request.query.publishedBefore != ''
  ) {
    // lte = less  than or equal
    query = query.lte('publishDate', request.query.publishedBefore);
  }
  // SEARCH PUBLISHED AFTER
  if (
    request.query.publishedAfter != null &&
    request.query.publishedAfter != ''
  ) {
    // lte = less  than or equal
    query = query.gte('publishDate', request.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    response.render('books/index', {
      books: books,
      searchOptions: request.query,
    });
  } catch {
    res.redirect('/');
  }
});

// NEW BOOK ROUTE
router.get('/new', async (request, response) => {
  renderNewPage(response, new Book());
});

// CREATE NEW BOOK ROUTE
router.post('/', async (request, response) => {
  const book = new Book({
    title: request.body.title,
    author: request.body.author,
    publishDate: new Date(request.body.publishDate),
    pageCount: request.body.pageCount,
    description: request.body.description,
  });

  saveCover(book, request.body.cover);

  try {
    const newBook = await book.save();
    // response.redirect(`books/${newbooks.id}`);
    response.redirect('books');
  } catch {
    // if (book.coverImageName != null) {
    //   removeBookCover(book.coverImageName);
    // }
    renderNewPage(response, book, true);
  }
});

module.exports = router;
