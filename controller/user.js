const Users = require("../models/Users");
let {
  validPassword,
  genPassword,
  issueJWT,
} = require("../config/password-utils");

//  post method to create a new user
// updated to work with api
module.exports.createUser = async (req, res) => {
  console.log(req.body);
  //   check if user already exists in the database
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    console.log("user already exists");
    return res.json({
      success: false,
      message: "user already exists in the database",
    });
  } else if (req.body.password1 == req.body.password2) {
    let { salt, hash } = genPassword(req.body.password1);
    let newUser = await Users.create({
      email: req.body.email,
      userName: req.body.userName,
      password: {
        hash: hash,
        salt: salt,
      },
    });
    console.log("created new user is ", newUser);
    // redirect
    return res.json({
      success: true,
      message: "successfully created new user",
    });
  }
  // in any other case
  console.log("could not create user");
  return res.json({ success: false, message: "could not create new User" });
};
// to let the user login
module.exports.signInUser = (req, res, next) => {
  Users.findOne({ email: req.body.email }, function (err, user) {
    if (err || !user) {
      console.log("cannot find user ", err);
      return res
        .status(401)
        .json({ success: false, message: "could not find user" });
    }
    console.log("User is ", user);
    const isValid = validPassword(
      req.body.password,
      user.password.hash,
      user.password.salt
    );
    if (isValid) {
      let userWithOutPassword = (({ _id, userName, email, projects }) => {
        return { _id, userName, email, projects };
      })(user);
      console.log(userWithOutPassword);
      const TokenObject = issueJWT(userWithOutPassword);
      res.status(200).json({
        success: true,
        token: TokenObject.token,
        expiresIn: TokenObject.expires,
        user: userWithOutPassword,
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "invalid password entered" });
    }
  });
};
