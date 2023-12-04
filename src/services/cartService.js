const CartProduct = require("../models/CartModel");

const addToCart = async (newItem) => {
  try {
    const { productID, userID, quantity } = newItem;
    const cartProduct = await CartProduct.findOne({
      product: productID,
      user: userID,
    });

    if (cartProduct) {
      cartProduct.quantity += quantity;
      await cartProduct.save();
      return {
        status: "OK",
        message: "Cập nhật số lượng thành công",
        data: cartProduct,
      };
    } else {
      const newCartProduct = await CartProduct.create({
        quantity: quantity,
        product: productID,
        user: userID,
      });
      return {
        status: "OK",
        message: "Thêm vào giỏ hàng thành công",
        data: newCartProduct,
      };
    }
  } catch (error) {
    // Xử lý lỗi ở đây và trả về một thông báo lỗi tùy chỉnh nếu cần
    return {
      status: "Error",
      message: "Lỗi xảy ra khi thêm sản phẩm vào giỏ hàng",
      error: error.message, // Thêm thông tin lỗi chi tiết nếu cần
    };
  }
};
const getCartList = (userID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cartList = await CartProduct.find({ user: userID }).populate(
        "product"
      );

      if (cartList === null) {
        resolve({
          status: "ERROR",
          message: "Giỏ hàng trống",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: cartList,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getCartItem = (cartId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const item = await CartProduct.findOne({ _id: cartId }).populate(
        "product"
      );

      if (item === null) {
        resolve({
          status: "ERROR",
          message: "Không có sản phẩm trong giỏ hàng!",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: item,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const updateCartItem = async (_id, quantity) => {
  try {
    const updatedCartItem = await CartProduct.findByIdAndUpdate(
      _id,
      { quantity },
      { new: true }
    );

    if (!updatedCartItem) {
      throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
    }

    return {
      status: "OK",
      message: "Cập nhật số lượng thành công",
      data: updatedCartItem,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi cập nhật số lượng",
      error: error.message, // Thêm thông tin lỗi chi tiết nếu cần
    };
  }
};
const deleteCartItem = async (id) => {
  try {
    const checkCart = await CartProduct.findOne({ _id: id });

    if (!checkCart) {
      return {
        status: "OK",
        message: "Sản phẩm không tồn tại !",
      };
    }

    await CartProduct.findByIdAndDelete(id);
    return {
      status: "OK",
      message: "Xóa thành công",
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi Xóa",
      error: error.message,
    };
  }
};
const deleteManyCartItem = async (ids) => {
  try {
    const result = await CartProduct.deleteMany({ _id: ids });
    return {
      status: "OK",
      message: "Xóa thành công",
      data: result,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi Xóa",
      error: error.message,
    };
  }
};
const deleteCart = async () => {
  try {
    const result = await CartProduct.deleteMany({});
    return {
      status: "OK",
      message: "Xóa thành công",
      data: result,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi Xóa",
      error: error.message,
    };
  }
};
module.exports = {
  addToCart,
  getCartList,
  updateCartItem,
  deleteCartItem,
  deleteCart,
  getCartItem,
  deleteManyCartItem,
};
