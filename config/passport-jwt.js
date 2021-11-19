const passportJWT = require("passport-jwt");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const Users = require("../models/Users");
const pathToPublicKey = path.join(__dirname, "..", "/file", "publicRSAkey.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf8");
// console.log(PUB_KEY);
// index.js will pass the global object here and this function will configure it
module.exports = (passport) => {
  passport.use(
    new passportJWT.Strategy(
      {
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: PUB_KEY,
        algorithms: ["RS256"],
      },
      function (jwt_payload, done) {
        Users.findOne({ id: jwt_payload.sub }, function (err, user) {
          // error ocurred and authentication failed
          if (err) {
            return done(err, false);
          }
          // authentication is successful
          if (user) {
            return done(null, user);
          }
          // user was not found in the database and authentication failed
          else {
            return done(null, false);
          }
        });
      }
    )
  );
};
// the jwt payload is passed into the verify callback
