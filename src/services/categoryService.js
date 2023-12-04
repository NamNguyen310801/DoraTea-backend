const Category = require("../models/CategoryModel");

const createCategory = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { headCategory, category } = newProduct;
    try {
      const checkCategory = await Category.findOne({
        headCategory: headCategory,
        category: category,
      });

      if (checkCategory !== null) {
        resolve({
          status: "ERROR",
          message: "Thể loại đã tồn tại",
        });
      } else {
        const createdCategory = await Category.create({
          headCategory,
          category,
        });
        if (createdCategory) {
          resolve({
            status: "OK",
            message: "Thêm thể loại thành công",
            data: createdCategory,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({ _id: id });
      if (checkCategory === null) {
        resolve({
          status: "OK",
          message: "Thể loại không tồn tại !",
        });
      }
      const updatedCategory = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "Cập nhật thành công",
        data: updatedCategory,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({ _id: id });
      if (checkCategory === null) {
        resolve({
          status: "OK",
          message: "Thể loại không tồn tại !",
        });
      }
      await Category.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Xóa thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getAllCategory = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalCategory = await Category.count();

      if (limit) {
        const allCategoryLimit = await Category.find()
          .limit(limit)
          .skip(page * limit);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allCategoryLimit,
          total: totalCategory,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalCategory / limit),
        });
      }
      if (sort) {
        const objSort = {};
        objSort[sort[1]] = sort[0];
        const allCategorySort = await Category.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objSort);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allCategorySort,
          total: totalCategory,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalCategory / limit),
        });
      }
      if (filter) {
        const label = filter[0];
        const allCategoryFilter = await Category.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);

        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allCategoryFilter,
          total: totalCategory,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalCategory / limit),
        });
      }

      const allCategory = await Category.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allCategory,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
};
