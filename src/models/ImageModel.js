const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image: { type: String, require: true },
    originalname: { type: String },
    size: { type: Number },
    mimetype: { type: String },
  },
  {
    timestamps: true,
  }
);
const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
