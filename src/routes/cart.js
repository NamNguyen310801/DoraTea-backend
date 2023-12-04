const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authUserMiddleWare } = require("../middleware/auth");
// Định nghĩa các route cho giỏ hàng
router.post("/addToCart", cartController.addToCart);
router.get("/getCartList/:userId", cartController.getCartList);
router.get("/getCartItem/:cartId", cartController.getCartItem);
router.put("/updateCart", cartController.updateCartItem);
router.delete("/deleteCart/:id", cartController.deleteCartItem);
router.post("/deleteMany", cartController.deleteManyCartItem);
router.post("/deleteAll", cartController.deleteCart);

module.exports = router;
