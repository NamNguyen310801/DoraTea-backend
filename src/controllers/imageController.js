const imageService = require("../services/imageService");

const createImage = async (req, res) => {
  // Lưu thông tin liên quan vào MongoDB
  try {
    const response = await imageService.createImage(req.file);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi tải lên tập tin" });
  }
};

//
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    if (!imageId) {
      return res.status(200).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await imageService.deleteImage(imageId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  createImage,
  deleteImage,
};
