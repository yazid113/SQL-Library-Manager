var express = require('express');
var router = express.Router();
var Book = require('../models').Book;



/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/books');
});

/* GET book page. */
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books: books, title: "Books" });
}));;

/* GET new book page. */
router.get('/books/new', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("new-book", { books, title: "New Book" });
}));;

/* POST new book page. */
router.post('/books', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect("/books");
  }
  catch (error){
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("form-error", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
}));;

/* GET book detail page. */
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("update-book", { book });
}));;

/* Edit book form. */
router.get("/books/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render(`books/${book.id}`, { book, title: "Update Book" });
  }
  else {
    res.sendStatus(404);
  }
  
}));

/* Update a book. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("form-error-update", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete book form. */
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book, title: "Delete book" });
  }
  else{
    res.sendStatus(404);
  }
}));

/* Delete individual book. */
router.post('/books/:id', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books")
  }
  else{
    res.sendStatus(404);
  }
  ;
}));

module.exports = router;
