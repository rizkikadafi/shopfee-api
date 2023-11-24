var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
var logger = require('morgan');
require('dotenv').config();


var indexRouter = require('./routes/index');
var adminLoginRouter = require('./routes/login');
var adminLogoutRouter = require('./routes/logout');
var insertRouter = require('./routes/insert');
var editRouter = require('./routes/edit');
var deleteRouter = require('./routes/delete');

var coffeeRouter = require('./routes/coffee');

var app = express();
var cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', adminLoginRouter);
app.use('/logout', adminLogoutRouter);
app.use('/insert', insertRouter);
app.use('/edit', editRouter);
app.use('/delete', deleteRouter);

app.use('/api/v1/coffees', coffeeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
