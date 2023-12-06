const Product = require("../models/Product");
const Review = require("../models/ReviewModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      category,
      price,
      rating,
      description,
      discount = 0,
      selled = 0,
    } = newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERROR",
          message: "Sản phẩm đã tồn tại ",
        });
      }

      const createProduct = await Product.create({
        name,
        image,
        category,
        price,
        rating,
        description,
        discount,
        selled,
      });
      if (createProduct) {
        resolve({
          status: "OK",
          message: "Thêm sản phẩm thành công",
          data: createProduct,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "Sản phẩm không tồn tại !",
        });
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "Cập nhật sản phẩm thành công",
        data: updatedProduct,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "Sản phẩm không tồn tại !",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Xóa thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Xóa thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllProduct = async () => {
  try {
    const productList = await Product.find();
    return {
      status: "OK",
      message: "SUCCESS",
      data: productList,
    };
  } catch (error) {
    throw error;
  }
};
const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product === null) {
        resolve({
          status: "OK",
          message: "Sản phẩm không tồn tại",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getWithCategory = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.find({ category: category });
      if (product === null) {
        resolve({
          status: "OK",
          message: "Không có sản phẩm phù hợp",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getAllPopular = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const popularProduct = await Product.find().limit(8).sort({ selled: -1 });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: popularProduct,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getAllDiscount = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const discountProduct = await Product.find({ discount: { $gt: 0 } })
        .limit(10)
        .sort({ discount: -1 });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: discountProduct,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const updateRating = async (data) => {
  try {
    const { productId, rating, description = "" } = data;
    const newReview = await Review.create({
      productId: productId,
      rating: rating,
      description: description || "",
    });
    if (!newReview) {
      return {
        status: "Error",
        message: "Lỗi xảy ra khi tạo đánh giá",
      };
    }
    await updateProductRating(productId);
    return {
      status: "OK",
      message: "Đánh giá sản phẩm thành công",
      data: newReview,
    };
  } catch (error) {
    return {
      status: "Error",
      message: "Lỗi xảy ra khi tạo đánh giá",
      error: error.message,
    };
  }
};
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ productId }).select("rating");

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;

      const product = await Product.findById(productId);
      if (product) {
        product.rating = averageRating;
        await product.save();
      }
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật rating của sản phẩm:", error.message);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProduct,
  getDetailProduct,
  deleteProduct,
  deleteManyProduct,
  getWithCategory,
  getAllPopular,
  getAllDiscount,
  updateRating,
};
