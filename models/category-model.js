const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    name: String,
    tag: String,
  },
  {
    timestamp: false,
  }
);

module.exports = model("Categories", categorySchema);