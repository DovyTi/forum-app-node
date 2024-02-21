const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    require: true,
    default: [],
  },
});

module.exports = mongoose.model('myPosts', userSchema);
