const crypto = require("crypto");
const jsonWebToken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const pathToKey = path.join(__dirname, "..", "/file", "/privateRSAkey.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");
// verify password
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
// generate password
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}
// utility function to create json web token for  our user
function issueJWT(user) {
  const id = user._id;
  const userName = user.userName;
  const email = user.email;
  const expiresIn = "1d";
  const payload = {
    sub: id,
    email,
    userName,
    iat: Date.now(), //An abbreviation for “issued at”, and represents when this JWT was issued
  };
  const signedToken = jsonWebToken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}
module.exports.issueJWT = issueJWT;
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
