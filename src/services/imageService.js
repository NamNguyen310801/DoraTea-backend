const Image = require("../models/ImageModel");
const createImage = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdImage = await Image.create({
        image: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      });
      if (createdImage) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdImage,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const deleteImage = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedImage = await Image.findOne({ _id: id });
      if (deletedImage === null) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy hình ảnh để xóa !",
        });
      }
      await Image.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Xóa hình ảnh thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createImage,
  deleteImage,
};
