var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var {requireAuth, checkUser} = require('./middleware/auth.middleware');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth.route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://ayesha_005:jintech005005@cluster0.vfi8p.mongodb.net/node-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false})
  .then((result) => {
    console.log('App is UP', checkUser);
    app.listen(3000)
  })
  .catch((err) => console.log(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(cookieParser());

app.get('*', checkUser);
app.use('/', indexRouter);
app.use(authRouter);

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