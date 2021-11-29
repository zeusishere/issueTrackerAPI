const { request } = require("express");
const express = require("express");
const passport = require("passport");
const router = express.Router();
let projectController = require("../controller/projectController");
router.get(
  "/all-projects",
  passport.authenticate("jwt", { session: false }),
  projectController.getAllProjectsAuthoredBySpecificUser
);
router.get(
  "/get-project/",
  passport.authenticate("jwt", { session: false }),
  projectController.getProjectDetails
);
router.post(
  "/add-project",
  passport.authenticate("jwt", { session: false }),
  projectController.createProject
);
router.post(
  "/add-users",
  passport.authenticate("jwt", { session: false }),
  projectController.updateProjectAndUserModel
);
// start work from here
router.delete(
  "/delete/",
  passport.authenticate("jwt", { session: false }),
  projectController.deleteProject
);
module.exports = router;
