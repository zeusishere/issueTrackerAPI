let express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    console.log("req.user is ", req.user);
    res.json({ success: true, message: "server works." });
  }
);
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    });
  }
);
// redirect to user.js router file
router.use("/user", require("./user.js"));
router.use("/project", require("./project"));
router.use("/issue", require("./issue"));
module.exports = router;
