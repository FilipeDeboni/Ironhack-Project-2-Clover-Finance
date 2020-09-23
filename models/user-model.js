const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    email: { type: String, unique: true },
    passwordHash: String,
    // entries: [{ type: Schema.Types.ObjectId, ref: "Entries" }],
    // categories: [{ type: Schema.Types.ObjectId, ref: "Categories" }]
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
