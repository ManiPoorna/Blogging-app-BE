// constants
const cookieSession = require('cookie-session');
const express = require('express');
const cors = require('cors');
// creating Express app
const app = express();
// Connecting to MongoDb
const mongoDb = require("./MongoDb");
require('dotenv').config();
const PORT = process.env.PORT
// Api's
const AuthRouter = require("./controllers/AuthController");
const BlogRouter = require('./controllers/BlogController');
//Express session
const session = require("express-session");
// Auth is to check whether user logged in or not
const Auth = require('./Middelwares/Auth');
const FollowRouter = require('./controllers/FollowController');
const mongoSession = require("connect-mongodb-session")(session);
const store = new mongoSession({
  uri: process.env.MONGO_URI,
  collection: "sessions"
})




// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
// app.use(cookieSession({
//   name : "sesison",
//   keys: ['secret'],
//   maxAge: 365 * 24 * 60 * 60,
// })); 
app.use(session({
  // cookie: {
  //   secure: false,
  //   sameSite: "production" ? 'none' : 'lax',
  // },
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store: store,
}))

app.get("/", (req, res) => {
  return res.send("Server is Running")
})

// Auth
// api's for signup and login
app.use("/auth", AuthRouter)

// api's for blogs CRUD
app.use("/blogs",Auth, BlogRouter)

// api's for Followers and following
app.use("/follow", Auth, FollowRouter)

app.listen(PORT, (req, res) => {
  console.log(`server running on http://localhost:${PORT}`)
})
