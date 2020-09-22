const { Schema, model } = require("mongoose");

const entrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    tag: String,
    amount: Number,
    category: String,
    desciption: String,
    date: { type: Date, default: Date.now() }
  },
  {
    timestamp: true,
  }
);

module.exports = model("Entries", entrySchema);