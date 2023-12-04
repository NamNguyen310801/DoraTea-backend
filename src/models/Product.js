const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    image: { type: String, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true },
    rating: { type: Number, require: true, default: 0 },
    description: { type: String },
    discount: { type: Number },
    selled: { type: Number },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
