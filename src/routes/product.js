const express = require("express");
const productController = require("../controllers/productController");
const { authMiddleWare } = require("../middleware/auth");

const router = express.Router();

router.post("/create", authMiddleWare, productController.createProduct);
router.put("/update/:id", authMiddleWare, productController.updateProduct);
router.get("/get-details/:id", productController.getDetailProduct);
router.delete("/delete/:id", authMiddleWare, productController.deleteProduct);
router.get("/getAll", productController.getAllProduct);
router.get("/getPopular", productController.getAllPopular);
router.get("/getDiscount", productController.getAllDiscount);

router.get("/getWithCategory/:category", productController.getWithCategory);
router.post(
  "/delete-many",
  authMiddleWare,
  productController.deleteManyProduct
);
router.post("/create-review", productController.createRating);
router.put("/updateProduct-rating", productController.updateProductRating);

module.exports = router;
