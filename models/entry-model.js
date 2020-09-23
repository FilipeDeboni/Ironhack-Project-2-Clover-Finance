const { Schema, model } = require("mongoose");

const entrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    amount: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: "Categories" },
    desciption: String,
    date: { type: Date, required: true, default: Date.now }
  },
  {
    timestamp: true,
  }
);

module.exports = model("Entries", entrySchema);