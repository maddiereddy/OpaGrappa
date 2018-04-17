'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const app = express();

const { router: usersRouter } = require('./users');
const { router: winesRouter } = require('./wines');
const { router: listRouter } = require('./mylist');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

//app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});


// static files in public directory (index.html and others)
app.use(express.static('public'));

// gets all wines data
app.use('/wines/', winesRouter);

// gets all mylist data
app.use('/mylist/', listRouter);

// for user login 
app.use('/users/', usersRouter);

// for user authentication
app.use('/auth/', authRouter);

// all other routes display not found message
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

// start express server and connect to db
function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}


// disconnect from db and then shut down express server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
