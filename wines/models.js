'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const WineSchema = mongoose.Schema({
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  // password: {
  //   type: String,
  //   required: true
  // }
});

// UserSchema.methods.serialize = function() {
//   return {
//     username: this.username || ''
//   };
// };

// UserSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

// UserSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password, 10);
// };

const Wine = mongoose.model('Wine', WineSchema);

module.exports = {Wine};
