const validator = require("validator");

const VerifyUserDetails = ({ name, email, password, username }) => {
  
  return new Promise((resolve, reject) => {
    // Performing all checks needed to validate user info
    if (!name || !username || !password || !email) reject("All fields are required")

    if (!validator.isEmail(email)) reject("Enter a valid Email")

    if (password.length <= 5) reject("Password must be at least 6 characters")

    if (name.length < 3) reject("Name should be atleast 3 characters")
    
    if (username.length < 3) reject("Username should be atleast 3 characters")

    //resolving promise that user provided correct info 
    resolve("Registration Successful");
  })
}

module.exports = VerifyUserDetails;