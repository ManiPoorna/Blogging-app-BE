const express = require('express');
const AuthRouter = express.Router();

const bcrypt = require("bcrypt")
const UserClass = require("../Models/UserModel");
const VerifyUserDetails = require('../Utils/Auth');
const Auth = require("../Middelwares/Auth")

// Signup API
AuthRouter.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;
  // returns a promise whether user passed req data or not
  try {
    await VerifyUserDetails({ name, username, email, password })
  }
  catch (error) {
    return res.send({
      status: 400,
      message: "Database error",
      error: error
    })
  }
  // checking user exits or not 
  try {
    const userExists = await UserClass.checkUserExists({ email, username })
    // if user not exists then create a userObj and save in DB
    const userObj = new UserClass({
      name, email, password, username
    })
    // saving user in DB
    const savedUser = await userObj.createUser()
    return res.send({
      status: 201,
      message: "Registered Successfully",
      userdata: savedUser
    })
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database error",
      error: error,
    })
  }
})

// Login API
AuthRouter.post("/login", async(req, res) => {
  const { loginId, password } = req.body;
  try {
    const userObj = await UserClass.checkUserExistsToLogin({ loginId, password });

    const isPasswordMatched = await bcrypt.compare(password, userObj.password);

    if (!isPasswordMatched) {
      return res.send({
        status: 401,
        error: "Wrong Password"
      })
    }

    req.session.isAuth = true;
    req.session.user = {
      userId: userObj._id,
      username: userObj.username,
      email : userObj.email
    }
    return res.send({
      status: 200,
      message : "Login Successful"
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database Error",
      error
    })
  }
})

// Logout API
AuthRouter.post("/logout",Auth, (req, res) => {
  req.session.destroy((error) =>{
    if (error) throw error
    return res.send({
      status: 200,
      message: "Logged out Successfully"
    })
  })
})

module.exports = AuthRouter