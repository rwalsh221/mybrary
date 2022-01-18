const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (request, response) => {
  let books;
  try {
    // https://youtu.be/Zi2UwhpooF8?t=2815
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
  } catch {
    books = [];
  }
  response.render('index', { books: books });
});

module.exports = router;
