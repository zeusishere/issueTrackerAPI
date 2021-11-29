const express = require("express");
const passport = require("passport");
const router = express.Router();
const issueController = require("../controller/issueController");
// post  body includes issue details and projectID
router.post(
  "/add-issue",
  passport.authenticate("jwt", { session: false }),
  issueController.addIssueToProject
);
router.post(
  "/update-issue-assignee",
  passport.authenticate("jwt", { session: false }),
  issueController.updateAssigneeOnIssue
);
router.patch(
  "/update-issue-status",
  passport.authenticate("jwt", { session: false }),
  issueController.updateStatusOnIssue
);
module.exports = router;
