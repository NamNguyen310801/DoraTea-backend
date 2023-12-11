const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
    role: { type: Number, default: 3 },
    phone: { type: String },
    address: { type: String },
    avatar: { type: String },
    tempSecret: { type: String },
    tempSecretExpiration: { type: Number },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
