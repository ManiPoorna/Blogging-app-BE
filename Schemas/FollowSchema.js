const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
  myAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  userAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  followedDate: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model("follow", FollowSchema);
