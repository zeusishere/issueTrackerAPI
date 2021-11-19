const express = require("express");
const db = require("./config/mongoose");
const app = express();
const port = 8000;
const cors = require("cors");
// middlewares
app.use(cors());
app.options("*", cors());
// soln used before using cors librairy
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,PUT,POST,DELETE,PATCH,OPTIONS"
//   );
// res.header(
//   "Access-Control-Allow-Methods",
//   " GET, POST, OPTIONS, PUT, DELETE"
// );
// header("Access-Control-Allow-Headers: Authorization");
//   next();
// });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const passport = require("passport");
require("./config/passport-jwt")(passport);
app.use(passport.initialize());
app.use("/", require("./routes/index"));
// app.get("/", (req, res) => {
//   return res.send("Home Page");
// });
app.listen(port, (err) => {
  if (err) return console.log("error in setting up server ", err);
  console.log("server is running on port = ", port);
});
