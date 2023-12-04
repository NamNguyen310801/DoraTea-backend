const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleWare, authUserMiddleWare } = require("../middleware/auth");

router.post("/sign-up", userController.createUser);
router.post("/log-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", authUserMiddleWare, userController.updateUser);
router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/getAll", userController.getAllUser);
router.get("/get-detail/:id", authUserMiddleWare, userController.getDetailUser);
router.get("/refresh-token", userController.refreshToken);
router.post("/delete-many", authMiddleWare, userController.deleteManyUser);
router.post("/forgot-password", userController.forgetPassword);
router.post("/verify-otp", userController.verifyOTP);
router.post("/reset-password", userController.resetPassword);
module.exports = router;
