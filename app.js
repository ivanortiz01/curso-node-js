var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletasApiRouter = require('./routes/api/bicicletas');
var mailerApiRouter = require('./routes/api/mailer');
//var usuariosApiRouter = require('./routes/api/usuarios');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');

var app = express();

const mongoose = require('mongoose');
var mongoDb = 'mongodb+srv://usuario1:ZgCRi9bztAWExZ4@cluster0.yjasg.azure.mongodb.net/red_bicicletas'
mongoose.connect(mongoDb, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/bicicletas', bicicletasRouter);
app.use('/api/bicicletas', bicicletasApiRouter);
app.use('/api/mailer', mailerApiRouter);
//app.use('/api/usuarios', usuariosApiRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);

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
