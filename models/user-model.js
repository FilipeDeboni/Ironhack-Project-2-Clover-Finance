const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    email: { type: String, unique: true },
    passwordHash: String,
    entries: [{ type: Schema.Types.ObjectId, ref: "Entries" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
