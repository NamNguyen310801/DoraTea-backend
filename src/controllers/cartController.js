const cartService = require("../services/cartService");

const addToCart = async (req, res) => {
  try {
    const { productID } = req.body;
    if (!productID) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng chọn sản phẩm",
      });
    }
    const response = await cartService.addToCart(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
// Lấy danh sách sản phẩm trong giỏ hàng của người dùng
const getCartList = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng đăng nhập",
      });
    }
    const response = await cartService.getCartList(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
// Lấy chi tiết sản phẩm trong giỏ hàng của người dùng
const getCartItem = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    if (!cartId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập thông tin!",
      });
    }
    const response = await cartService.getCartItem(cartId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
  try {
    const { _id, quantity } = req.body;
    const response = await cartService.updateCartItem(_id, quantity);
    res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
// Xoá 1 sản phẩm khỏi giỏ hàng
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const response = await cartService.deleteCartItem(cartItemId);
    res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
// Xoá nhiều items hàng
const deleteManyCartItem = async (req, res) => {
  try {
    const ids = req.body;
    if (!ids) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await cartService.deleteManyCartItem(ids);
    res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
// Xoá giỏ hàng
const deleteCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const response = await cartService.deleteCart(cartItemId);
    res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
module.exports = {
  addToCart,
  getCartList,
  getCartItem,
  updateCartItem,
  deleteCartItem,
  deleteManyCartItem,
  deleteCart,
};
