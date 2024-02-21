const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainTopicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('myMainTopicSchema', mainTopicSchema);
