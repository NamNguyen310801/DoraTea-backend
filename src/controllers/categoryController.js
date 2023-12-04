const categoryService = require("../services/categoryService");
const createCategory = async (req, res) => {
  try {
    const { headCategory, category } = req.body;

    if (!headCategory || !category) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await categoryService.createCategory(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const data = req.body;
    if (!categoryId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await categoryService.updateCategory(categoryId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await categoryService.deleteCategory(categoryId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const getAllCategory = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await categoryService.getAllCategory(
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
// const getDetailCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     if (!categoryId) {
//       return res.status(200).json({
//         status: "ERROR",
//         message: "Vui lòng nhập đầy đủ thông tin",
//       });
//     }
//     const response = await categoryService.getDetailCategory(categoryId);
//     return res.status(200).json(response);
//   } catch (error) {
//     return res.status(404).json({
//       message: error,
//     });
//   }
// };

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
};
