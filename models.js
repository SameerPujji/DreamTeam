var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;
// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);
// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var User = new Schema({
  username: String,
  password: String,
})

var Problems = new Schema({
  name: String,
  class: String,
  email: String,
  problem: String
})

module.exports = {
  User: mongoose.model('User', User),
  Problems : mongoose.model('Problems', Problems)
}
