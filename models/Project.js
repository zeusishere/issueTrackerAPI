const mongoose = require("mongoose");

const { Schema } = mongoose;
const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
    },
    projectDescription: {
      type: String,
      max: 200,
    },
    projectAuthor: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      // type:String,
      // required :true
    },
    projectMembers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
      },
    ],
    label: [
      {
        type: mongoose.Schema.ObjectId,
        // ref :"Label"
        type: String,
      },
    ],
    issues: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Issue",
      },
    ],
  },
  {
    timestamps: true,
  }
);
projectSchema.virtual("projectLink").get(function () {
  return `/projects/${this.id}`;
});
// members and issues to be added
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
