const Project = require("../models/Project");
const Users = require("../models/Users");
module.exports.createProject = async (req, res) => {
  let user = req.user;

  //   create a new project document
  try {
    let newProject = await Project.create({
      ...req.body,
      projectAuthor: user._id,
    });
    user.projects.push(newProject._id);
    await user.save();

    await newProject.populate("projectAuthor", "userName");
    return res.json({
      success: true,
      message: "successfully added Project",
      project: newProject,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "could not add new Project",
    });
  }
};
// get all projects where user is author or user is a member
module.exports.getAllProjectsAuthoredBySpecificUser = async (req, res) => {
  try {
    let projectList = await Project.find({
      $or: [{ projectAuthor: req.user._id }, { projectMembers: req.user._id }],
    })
      .populate("projectAuthor", "userName")
      .populate("projectMembers", "userName")
      .sort({ createdAt: -1 });

    console.log("plist    ", projectList);
    return res.json({ success: true, projects: projectList });
  } catch (err) {
    console.log("err  projectController ", err);

    return res.json({ success: false });
  }
};
// delete a project
module.exports.deleteProject = async (req, res) => {
  try {
    let projectID = req.query.projectID;
    let project = await Project.findByIdAndDelete(projectID);
    if (project) {
      let updatedUsers = await Users.updateMany(
        { _id: { $in: project.projectMembers } },
        { $pull: { projects: project._id } },
        {
          returnDocument: "after",
        }
      );

      return res.json({
        success: true,
        message: "Project has been succesfully deleted",
      });
    }
  } catch (err) {
    console.log("error in deleting ", err);
    return res.json({
      success: false,
      message: "There was an error while trying to delete a Project",
    });
  }
};
// get project details
module.exports.getProjectDetails = async (req, res) => {
  try {
    let projectID = req.query.projectID;
    let project = await Project.findById(projectID)
      .populate({
        path: "issues",
        populate: [
          { path: "issueAuthor", select: "userName" },
          { path: "issueAssignee", select: "userName email" },
        ],
      })
      .populate("projectMembers", "userName email")
      .populate("projectAuthor", "userName");

    if (project) {
      return res.json({ success: true, project });
    }
    return res.json({
      success: false,
      message: "could not retrive project details from the server",
    });
  } catch (error) {
    console.log("error is ", error);
    return res.json({
      success: false,
      message: "could not retrive project details from the server",
    });
  }
};

//  this fn adds selected users to the Project and the same project to Users model
module.exports.updateProjectAndUserModel = async (req, res) => {
  let userIds = req.body.users;
  let projectID = req.body.projectID;
  try {
    let project = await Project.findById(projectID)
      .populate({
        path: "issues",
        populate: [
          { path: "issueAuthor", select: "userName" },
          { path: "issueAssignee", select: "userName email" },
        ],
      })
      .populate("projectAuthor", "userName");
    if (project) {
      for (let id of userIds) {
        let user = await Users.findById(id);
        if (user) {
          if (project.projectMembers.findIndex((user_id) => user_id == id) < 0)
            project.projectMembers.push(id);
          project.save();
          if (
            user.projects.findIndex((project_id) => project_id == project._id) <
            0
          ) {
            user.projects.push(project._id);
            user.save();
          }
        }
      }
      project = await project.populate("projectMembers", "userName email");
      return res.json({
        success: true,
        message: "succedfully added user(s) to Project",
        project,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "there was an error adding" });
  }
};
