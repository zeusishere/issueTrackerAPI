const mongoose = require("mongoose");
const { Schema } = mongoose;
const issueSchema = new Schema(
  {
    issueName: {
      type: String,
      required: true,
    },
    issueDescription: {
      type: String,
      default: "This field is Empty",
      max: 400,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
    label: {
      type: String,
      ref: "Label",
      default: "Bug",
    },

    issueAuthor: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    issueAssignee: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    issueStatus: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    issueDueDate: {
      type: Date,
    },
    issuePriority: {
      type: String,
      enum: ["High", "Normal", "Low"],
      default: "Normal",
    },
  },
  {
    timestamps: true,
  }
);

// creator user, project ,status , labels

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;
