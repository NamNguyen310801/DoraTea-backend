const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authMiddleWare } = require("../middleware/auth");

const router = express.Router();
router.post("/create", authMiddleWare, categoryController.createCategory);
router.get("/getAll", categoryController.getAllCategory);
router.put("/update/:id", authMiddleWare, categoryController.updateCategory);
router.delete("/delete/:id", authMiddleWare, categoryController.deleteCategory);
module.exports = router;
