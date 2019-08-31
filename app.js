require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const random_name = require('node-random-name');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const processName = random_name();

const catalog = require('./handlers/catalog');
catalog.startup(processName);

app.get('/', catalog.handler);

app.get('/mem', (req, res) => {
  res.json({
    name: processName, 
    visitor: counter++, 
    messages
  })
});

app.post('/', (req, res) => {
    const msg = req.body
    messages.push(msg.snack)
    res.json({
      name: processName,
      msg_count: messages.length, 
      received: msg});
})

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
  res.json ({error: err });
});

module.exports = app;
