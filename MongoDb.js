const mongoose = require("mongoose");
require("dotenv").config();
// DB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected")
})
  .catch(() => {
    console.log("MongoDb Connection failed")
  })
