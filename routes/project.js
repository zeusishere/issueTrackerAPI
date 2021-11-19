const express = require("express");
const passport = require("passport");
const router = express.Router();
let projectController = require("../controller/projectController");

router.post(
  "/add-project",
  passport.authenticate("jwt", { session: false }),
  projectController.createProject
);
module.exports = router;
