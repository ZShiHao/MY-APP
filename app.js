const createError = require('http-errors');
const { MongoClient } = require('mongodb');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'library';

async function main() {
 // Use connect method to connect to the server
 await client.connect();
 console.log('Connected successfully to server');
 const db = client.db(dbName);
 const collection = db.collection('users');
 // the following code examples can be pasted here...
 const findResult = await collection.find().toArray();
 console.log('Inserted documents =>', findResult);

 return 'done.';
}
main()
 .then(console.log)
 .catch(console.error)
 .finally(() => client.close());


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
