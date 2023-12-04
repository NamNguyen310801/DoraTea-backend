const express = require("express");
const imageController = require("../controllers/imageController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post("/create", upload.single("file"), imageController.createImage);
// router.put("/update/:id", imageController.updateImage);
router.delete("/delete/:id", imageController.deleteImage);

module.exports = router;
