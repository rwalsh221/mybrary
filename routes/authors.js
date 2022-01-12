const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const Author = require('../models/author');

// ALL AUTHORS ROUTE
router.get('/', async (request, response) => {
  let searchOptions = {};

  if (request.query.name != null && request.query !== '') {
    searchOptions.name = new RegExp(request.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    response.render('authors/index', {
      authors: authors,
      searchOptions: request.query,
    });
  } catch {
    response.redirect('/');
  }
});

// NEW AUTHOR ROUTE
router.get('/new', (request, response) => {
  response.render('authors/new', { author: new Author() });
});

// CREATE NEW AUTHOR ROUTE
router.post('/', async (request, response) => {
  // .name === _form_field.ejs input with name="name"
  const author = new Author({
    name: request.body.name,
  });

  try {
    const newAuthor = await author.save();
    // response.redirect(`authors/${newAuthor.id}`);
    response.redirect('authors');
  } catch {
    response.render('authors/new', {
      author: author,
      errorMessage: 'Error creating author',
    });
  }
});

module.exports = router;
