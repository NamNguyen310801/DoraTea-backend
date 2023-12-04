const express = require("express");
const router = express.Router();
const { authMiddleWare } = require("../middleware/auth");
const orderController = require("../controllers/orderController");
// authMiddleWare,
// // Định nghĩa các route cho đơn hàng
router.post("/createOrder", orderController.createOrder);
router.get("/getAllOrderDetails/:userId", orderController.getAllOrderDetails);
router.get("/getAllOrder", orderController.getAllOrder);
router.get(
  "/getOrdersByMonth/:year/:month",
  authMiddleWare,
  orderController.getOrdersByMonth
);
router.get(
  "/getRecentOrder",
  authMiddleWare,
  orderController.getAllRecentOrder
);
router.put("/update/:orderId", orderController.updateOrder);
router.get("/getOrderDetails/:orderId", orderController.getOrderDetails);
router.get("/monthly-order-count", orderController.getOrdersMonthCount);
router.delete("/cancelOrder/:orderId", orderController.cancelOrder);
router.delete("/successOrder/:orderId", orderController.successOrder);
router.delete("/confirmOrder/:orderId", orderController.confirmOrder);

module.exports = router;
