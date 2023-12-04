const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
// // Định nghĩa các route cho đơn hàng
router.post("/send-confirmOrder", orderController.sendConfirmOrder);
router.post("/send-successOrder", orderController.sendSuccessOrder);

module.exports = router;
