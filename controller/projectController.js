const Project = require("../models/Project");
const Users = require("../models/Users");
module.exports.createProject = async (req, res) => {
  console.log(req.user);
  let user = req.user;
  //   create a new project document
  try {
    let newProject = await Project.create({
      ...req.body,
      projectAuthor: user._id,
    });
    Project;
    console.log("create project new project is", newProject);
    user.projects.push(newProject._id);
    await user.save();
    let userQuery = await Users.findById(user._id);
    console.log("user query is ", userQuery, user);
    return res.json(JSON.stringify(req.user));
  } catch (error) {
    return res.json("error creating a new project");
  }
};
