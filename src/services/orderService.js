const Order = require("../models/OrderProduct");
const Product = require("../models/Product");
const createOrder = async (newItem) => {
  try {
    const {
      orderItems,
      fullName,
      address,
      phone,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      user,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt,
      isCancelled,
      isSuccessOrder,
      isConfirm,
    } = newItem;

    const newOrder = await Order.create({
      orderItems,
      shippingAddress: {
        fullName,
        address,
        phone,
      },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      user,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt,
      isCancelled,
      isSuccessOrder,
      isConfirm,
    });
    return {
      status: "OK",
      message: "Thêm đơn hàng thành công",
      data: newOrder,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi Thêm đơn hàng",
      error: error.message,
    };
  }
};
const getAllOrderDetails = async (userId) => {
  try {
    const userOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
    // .populate({
    //   path: "orderItems",
    //   populate: {
    //     path: "product",
    //     model: "Product",
    //   },
    // });
    if (userOrders === null) {
      return {
        status: "ERR",
        message: "Đơn hàng không hợp lệ!",
      };
    }
    return {
      status: "OK",
      message: "SUCCESS",
      data: userOrders,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi lấy đơn hàng",
      error: error.message,
    };
  }
};
const getAllOrder = async () => {
  try {
    const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 });
    // .populate({
    //   path: "orderItems",
    //   populate: {
    //     path: "product",
    //     model: "Product",
    //   },
    // });
    return {
      status: "OK",
      message: "SUCCESS",
      data: allOrder,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi lấy đơn hàng",
      error: error.message,
    };
  }
};
const getAllRecentOrder = async () => {
  try {
    const recentOrder = await Order.find().sort({ createdAt: -1 }).limit(6);
    // .populate({
    //   path: "orderItems",
    //   populate: {
    //     path: "product",
    //     model: "Product",
    //   },
    // });
    return {
      status: "OK",
      message: "SUCCESS",
      data: recentOrder,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi lấy đơn hàng",
      error: error.message,
    };
  }
};
const getOrderDetails = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    // .populate({
    //   path: "orderItems",
    //   populate: {
    //     path: "product",
    //     model: "Product",
    //   },
    // });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    return {
      status: "OK",
      message: "SUCCESS",
      data: order,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi lấy đơn hàng",
      error: error.message,
    };
  }
};
const getOrdersByMonth = async (year, month) => {
  try {
    // Xác định khoảng thời gian bắt đầu và kết thúc của tháng

    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    // Truy vấn đơn hàng trong khoảng thời gian
    const ordersInMonth = await Order.find({
      createdAt: {
        $gte: startDate, // Lớn hơn hoặc bằng ngày bắt đầu tháng
        $lte: endDate, // Nhỏ hơn hoặc bằng ngày kết thúc tháng
      },
    }).populate({
      path: "orderItems",
      populate: {
        path: "product",
        model: "Product",
      },
    });
    return {
      status: "OK",
      message: "SUCCESS",
      data: ordersInMonth,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi lấy đơn hàng",
      error: error.message,
    };
  }
};
const getOrdersMonthCount = async () => {
  try {
    const pipeline = [
      {
        $match: {
          // Add any necessary conditions
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    const currentYear = new Date().getFullYear();
    const orderCountByYearMonth = {};
    // Initialize the object with counts set to 0 for all months
    orderCountByYearMonth.year = currentYear;
    orderCountByYearMonth.data = {};
    for (let month = 1; month <= 12; month++) {
      orderCountByYearMonth.data[month] = 0;
    }

    // Update counts based on the result
    result.forEach((item) => {
      const { month, count } = item;
      orderCountByYearMonth.data[month] = count;
    });
    return {
      status: "OK",
      message: "SUCCESS",
      data: orderCountByYearMonth,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi lấy đơn hàng",
      error: error.message,
    };
  }
};

const updateOrder = async (orderId, data) => {
  try {
    // Tìm đơn hàng cần cap nhat dựa trên orderId
    const checkOrder = await Order.findOne({ _id: orderId });
    if (checkOrder === null) {
      return {
        status: "OK",
        message: "Đơn hàng không tồn tại !",
      };
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      data,
      { new: true } // To return the updated order after the update
    );
    return {
      status: "OK",
      message: "Đã cập nhật đơn hàng thành công",
      data: updatedOrder,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Đã xảy ra lỗi khi cập nhật đơn hàng.",
      error: error.message,
    };
  }
};

const cancelOrder = async (orderId) => {
  try {
    // Tìm đơn hàng cần hủy dựa trên orderId
    const order = await Order.findById(orderId).exec();
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    order.isDelivered = false;
    order.isConfirm = false;
    order.isSuccessOrder = false;
    order.isCancelled = true;
    await order.save();
    return {
      status: "OK",
      message: "Đã hủy đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Đã xảy ra lỗi khi hủy đơn hàng.",
      error: error.message,
    };
  }
};
const successOrder = async (orderId) => {
  try {
    // Tìm đơn hàng dựa trên orderId
    const order = await Order.findById(orderId).exec();
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    order.isConfirm = true;
    order.isDelivered = true;
    order.isSuccessOrder = true;
    order.isCancelled = false;
    await order.save();
    // Lấy danh sách sản phẩm trong đơn hàng và số lượng mua
    const { orderItems } = order;
    for (const orderItem of orderItems) {
      const { product, quantity } = orderItem;
      // Lấy sản phẩm từ cơ sở dữ liệu
      const productToUpdate = await Product.findById(product).exec();
      if (productToUpdate) {
        // Cập nhật trường "selled" của sản phẩm
        productToUpdate.selled = (productToUpdate.selled || 0) + quantity;
        // Lưu lại sản phẩm
        await productToUpdate.save();
      }
    }
    return {
      status: "OK",
      message: "Đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Đã xảy ra lỗi khi hoàn thành đơn hàng.",
      error: error.message,
    };
  }
};
const confirmOrder = async (orderId) => {
  try {
    // Tìm đơn hàng cần hủy dựa trên orderId
    const order = await Order.findById(orderId).exec();
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    order.isConfirm = true;
    order.isDelivered = false;
    order.isSuccessOrder = false;
    order.isCancelled = false;
    await order.save();
    return {
      status: "OK",
      message: "Đã xác nhận đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Đã xảy ra lỗi khi xác nhận đơn hàng.",
      error: error.message,
    };
  }
};
module.exports = {
  createOrder,
  getAllOrderDetails,
  cancelOrder,
  getOrderDetails,
  getAllOrder,
  updateOrder,
  successOrder,
  confirmOrder,
  getAllRecentOrder,
  getOrdersByMonth,
  getOrdersMonthCount,
};
