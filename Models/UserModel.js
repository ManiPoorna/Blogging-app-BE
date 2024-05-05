const bcrypt = require("bcrypt");
const UserSchema = require("../Schemas/UserSchema");
const ObjectId = require('mongodb').ObjectId;


let UserClass = class {
  name;
  email;
  password;
  username;

  constructor({ email, name, username, password }) {
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // function to Create/Register User
  createUser() {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.SALT))
        const userObj = new UserSchema({
          name: this.name,
          email: this.email,
          username: this.username,
          password: hashedPassword
        })
        // saving user to DB
        const savedUser = userObj.save();
        resolve(savedUser);
      } catch (error) {
        reject(error)
      }
    })
  }

  //function to check if user already exists or not
  static checkUserExists({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExists = await UserSchema.findOne({
          $or: [{ email: email }, { username: username }]
        })

        if (userExists && userExists.email === email) {
          reject("Email Already Exists")
        }
        else if (userExists && userExists.username === username) {
          reject("Username Already Exists")
        }
        resolve();
      }
      catch (error) {
        reject(error);
      }
    })
  }

  // fucntion to check whether user registered or not to login
  static checkUserExistsToLogin({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!loginId || !password) reject("Credentials missing");
        if (loginId.length < 3 || password.length < 6) reject("Invalid Credentials")

        const userObj = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }]
        })
        
        if (!userObj) reject("User not found, Please register");

        resolve(userObj);
      } catch (error) {
        reject(error)
      }
    })
  }

  // function to check whether udserID is valid or not
  static verifyUserId({ userId }) {
    return new Promise(async(resolve, reject) => {
      if (!ObjectId.isValid(userId)) reject("Invalid userId")
      
      try {
        const userDb = await UserSchema.findOne({ _id: userId });
        if (!userDb) reject(`User not found with ${userId}`);
        resolve(userDb.username)
      } catch (error) {
        reject(error);
      }
    })
  }
  
}

module.exports = UserClass;