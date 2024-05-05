const Auth = (req, res, next) => {
  // console.log("session ==> ", req.session);
  console.log("req.sessionOption",req.sessionOptions);

  if (req.session.isAuth) {
    next();
  }
  else {
    res.send({
      status: 401,
      message : "You are not authorised, Please login"
    })
  }
}

module.exports = Auth;