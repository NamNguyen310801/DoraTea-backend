const orderService = require("../services/orderService");
const emailService = require("../services/EmailService");

const createOrder = async (req, res) => {
  try {
    const response = await orderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "Người dùng không hợp lệ!",
      });
    }
    const response = await orderService.getAllOrderDetails(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const response = await orderService.getAllOrder();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const getAllRecentOrder = async (req, res) => {
  try {
    const response = await orderService.getAllRecentOrder();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Đơn hàng không hợp lệ!",
      });
    }
    const response = await orderService.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getOrdersByMonth = async (req, res) => {
  try {
    const year = req.params.year;
    const month = req.params.month;
    const response = await orderService.getOrdersByMonth(
      Number(year),
      Number(month)
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const getOrdersMonthCount = async (req, res) => {
  try {
    const response = await orderService.getOrdersMonthCount();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const data = req.body;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Đơn hàng không hợp lệ!",
      });
    }
    const response = await orderService.updateOrder(orderId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Đơn hàng không hợp lệ!",
      });
    }
    const response = await orderService.cancelOrder(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const successOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Đơn hàng không hợp lệ!",
      });
    }
    const response = await orderService.successOrder(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const confirmOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Đơn hàng không hợp lệ!",
      });
    }
    const response = await orderService.confirmOrder(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const sendConfirmOrder = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(data?.email);
    if (!data?.email) {
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
    const response = await emailService.sendConfirmOrderEmail(data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      status: "ERROR",
      message: "Lỗi khi gửi email",
    });
  }
};
const sendSuccessOrder = async (req, res) => {
  try {
    const data = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(data?.email);
    if (!data?.email) {
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
    const response = await emailService.sendSuccessOrderEmail(data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      status: "ERROR",
      message: "Lỗi khi gửi email",
    });
  }
};
module.exports = {
  createOrder,
  getAllOrderDetails,
  getAllOrder,
  cancelOrder,
  getOrderDetails,
  updateOrder,
  successOrder,
  confirmOrder,
  getAllRecentOrder,
  getOrdersByMonth,
  sendConfirmOrder,
  sendSuccessOrder,
  getOrdersMonthCount,
};
