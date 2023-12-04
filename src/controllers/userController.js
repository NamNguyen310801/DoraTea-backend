const userService = require("../services/userService");
const emailService = require("../services/EmailService");
const jwtService = require("../services/JWTService");

//Sign Up
const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERROR",
        message: "Email không hợp lệ",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERROR",
        message: "Mật khẩu không trùng khớp",
      });
    }
    const response = await userService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: "ERROR",
    });
  }
};

//Login
const loginUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng kiểm tra lại email",
      });
    }
    const response = await userService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ ...newResponse, refresh_token });
  } catch (e) {
    return res.status(404).json({
      message: "ERROR",
    });
  }
};

//Logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Đăng xuất thành công",
    });
  } catch (e) {
    return res.status(404).json({
      message: "ERROR",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await userService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await userService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const deleteManyUser = async (req, res) => {
  try {
    const ids = req.body;
    if (!ids) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await userService.deleteManyUser(ids);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await userService.getAllUser(
      Number(limit),
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await userService.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const refreshToken = async (req, res) => {
  try {
    let token = req.headers.token.split(" ")[1];
    if (!token) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await jwtService.refreshTokenService(token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng kiểm tra lại email",
      });
    }
    const response = await emailService.forgetPassword(email);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERROR",
      message: "Lỗi khi quên mật khẩu",
    });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !otp) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng kiểm tra lại email",
      });
    }
    const response = await emailService.verifyOTP(email, otp);
    return res.status(200).json(response);
  } catch (e) {
    return {
      status: "ERROR",
      message: "Lỗi khi xác nhận OTP",
    };
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng kiểm tra lại email",
      });
    }
    const response = await emailService.resetPassword(
      email,
      newPassword,
      confirmPassword
    );
    return res.status(200).json(response);
  } catch (e) {
    return {
      status: "ERROR",
      message: "Lỗi khi quên mật khẩu",
    };
  }
};
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
  deleteManyUser,
  forgetPassword,
  verifyOTP,
  resetPassword,
};
