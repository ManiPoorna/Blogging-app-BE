const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    minLength: 3,
    maxLength : 70
  },
  description: {
    type: String,
    require: true,
    minLength: 4,
    maxLength: 1200,
  },
  creationDate: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require:true,
  },
  username: {
    type: String,
    require: true,
  }
})

module.exports = mongoose.model("blogs",BlogSchema)