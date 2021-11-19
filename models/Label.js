const mongoose = require("mongoose");
const { Schema } = mongoose;
const labelSchema = new Schema({
  lableTitle: String,
});
const Label = mongoose.model("Label", labelSchema);
module.exports = Label;
