const Users = require("../models/Users");
let {
  validPassword,
  genPassword,
  issueJWT,
} = require("../config/password-utils");

//  post method to create a new user
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
    let userWithOutPassword = (({ _id, userName, email, projects }) => {
      return { _id, userName, email, projects };
    })(newUser);
    console.log("created new user is ", newUser);
    // redirect
    const TokenObject = issueJWT(userWithOutPassword);
    return res.status(200).json({
      success: true,
      token: TokenObject.token,
      expiresIn: TokenObject.expires,
      user: userWithOutPassword,
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
      return res.status(401).json({
        success: false,
        message:
          "No such User found in the database.\n Please enter valid credentials",
      });
    }
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
      res.status(401).json({
        success: false,
        message:
          "No such User found in the database.\n Please enter valid credentials",
      });
    }
  });
};
// sends all users which match the query to client
module.exports.getUsersByEmail = async (req, res) => {
  console.log("query ", req.query);
  try {
    let users = await Users.find(
      {
        email: { $regex: req.query.email, $options: "i" },
      },
      "userName email _id"
    );
    return res.json({
      success: true,
      message: "get users by email",
      users: users,
    });
  } catch (err) {}
  return res.json({
    success: false,
    message: "there was an error getting users from db",
  });
};
