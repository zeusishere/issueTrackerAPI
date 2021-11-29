const Project = require("../models/Project");
const Users = require("../models/Users");
const Issue = require("../models/Issue");
//  creates an issue and adds it to project
module.exports.addIssueToProject = async (req, res) => {
  try {
    let {
      projectID,
      issueName,
      issueDescription,
      label,
      issuePriority,
      issueDueDate,
      issueAssignee,
    } = req.body;

    let project = await Project.findById(projectID);
    if (project) {
      let createdIssue = await Issue.create({
        project: projectID,
        issueName,
        issueDescription,
        label,
        issuePriority,
        issueDueDate,
        issueAuthor: req.user._id,
      });
      project.issues.push(createdIssue._id);
      await project.save();
      // remember promises isn't supported while populating individual documents
      project = await project.populate("projectMembers", "userName email");
      project = await project.populate("projectAuthor", "userName");
      project = await project.populate({
        path: "issues",
        populate: [
          { path: "issueAuthor", select: "userName" },
          { path: "issueAssignee", select: "userName email" },
        ],
      });

      return res.json({
        success: true,
        message: "Issue has been Successfully added",
        project,
      });
    }
    return res.json({
      success: false,
      message: "There was an error adding an issue , Please Try Again",
    });
  } catch (err) {
    console.log("error is ", err);
    return res.json({
      success: false,
      message: "There was an error adding an issue , Please Try Again",
    });
  }
};

module.exports.updateAssigneeOnIssue = async (req, res) => {
  try {
    let issue = await Issue.findByIdAndUpdate(req.body.issueID);
    if (issue) {
      issue.issueAssignee = req.body.issueAssignee;
      await issue.save();
      let project = await Project.findById(issue.project)
        .populate({
          path: "issues",
          populate: [
            { path: "issueAuthor", select: "userName" },
            { path: "issueAssignee", select: "userName email" },
          ],
        })
        .populate("projectMembers", "userName email")
        .populate("projectAuthor", "userName");

      //    we return whole project instead of only newly updated issue
      return res.json({
        success: true,
        message: "issue Assignee was added",
        project,
      });
    }
  } catch (err) {
    console.log("error is ", err);
    return res.json({
      success: false,
      message: "There was an error adding issue Author ",
    });
  }
};
module.exports.updateStatusOnIssue = async (req, res) => {
  try {
    let issue = await Issue.findById(req.body.issueID);
    if (issue) {
      issue.issueStatus = req.body.issueStatus;
      await issue.save();
      let project = await Project.findById(issue.project)
        .populate({
          path: "issues",
          populate: [
            { path: "issueAuthor", select: "userName" },
            { path: "issueAssignee", select: "userName email" },
          ],
        })
        .populate("projectMembers", "userName email")
        .populate("projectAuthor", "userName");

      //    we return whole project instead of only newly updated issue
      return res.json({
        success: true,
        message: "issue status was updated",
        project,
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "There was an error updating issue status ",
    });
  }
};
