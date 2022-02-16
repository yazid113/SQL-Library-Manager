var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

/* 404 handler error */
app.use((req, res, next) => {{
  const error = new Error();
  error.status = 404;
  error.message = 'The desire page is not found please try again';
  res.render('page-not-found', {error}); 
}
});

/* Global error handler */
app.use((err, req, res, next) => {
  if (err) {
    console.log('Global error handler called', {err});
  }
  if (err.status === 404) {  
    res.status(404).render('page-not-found', {err});
  } else {
    err.message = err.message || `Server error`;
    res.status(err.status || 500).render('error', {err});
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});

(async () => {
  await db.sequelize.authenticate()
  console.log('Established connection')
  db.sequelize.sync();
  
})()

module.exports = app;
