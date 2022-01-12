const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// ALL AUTHORS ROUTE
router.get('/', (request, response) => {
  response.render('authors/index');
});

// NEW AUTHOR ROUTE
router.get('/new', (request, response) => {
  response.render('authors/new', { author: new Author() });
});

// CREATE NEW AUTHOR ROUTE
router.post('/', (request, response) => {
  // .name === _form_field.ejs input with name="name"
  response.send(request.body.name);
});

module.exports = router;
