const mongoose = require("mongoose");

const cartProductSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      default: 1,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const CartProduct = mongoose.model("CartProduct", cartProductSchema);
module.exports = CartProduct;
