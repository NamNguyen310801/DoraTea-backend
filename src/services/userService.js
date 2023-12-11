const User = require("../models/UserModel");
const bcrypt = require("bcrypt"); // ma hoa password
const { generalAccessToken, generalRefreshToken } = require("./JWTService");
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      email,
      password,
      confirmPassword,
      role = 3,
      phone = "",
      address = "",
      avatar = "",
    } = newUser;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERROR",
          message: "The email is already",
        });
      }

      const hash = bcrypt.hashSync(password, 10);
      const createUser = await User.create({
        name,
        email,
        password: hash,
        phone,
        role,
        address,
        avatar,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "Thêm người dùng thành công",
          data: createUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERROR",
          message: "Mật khẩu hoặc email không chính xác",
        });
      }
      const access_token = await generalAccessToken({
        id: checkUser.id,
        role: checkUser.role,
      });
      const refresh_token = await generalRefreshToken({
        id: checkUser.id,
        role: checkUser.role,
      });
      resolve({
        status: "OK",
        message: "Đăng nhập thành công",
        access_token,
        refresh_token,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      if (checkUser === null) {
        resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "Cập nhật người dùng thành công",
        data: updatedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      if (checkUser === null) {
        resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại",
        });
      }
      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Xóa thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteManyUser = (ids) => {
  console.log(ids);
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Xóa thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getAllUser = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalUser = await User.count();

      if (limit) {
        const allUserLimit = await User.find()
          .limit(limit)
          .skip(page * limit);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allUserLimit,
          total: totalUser,
          currentPage: Number(page + 1),
          totalPage: Math.ceil(totalUser / limit),
        });
      }
      if (sort) {
        const objSort = {};
        objSort[sort[1]] = sort[0];
        const allUserSort = await User.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objSort);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allUserSort,
          total: totalUser,
          currentPage: Number(page + 1),
          totalPage: Math.ceil(totalUser / limit),
        });
      }
      if (filter) {
        const label = filter[0];
        const allUserFilter = await User.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allUserFilter,
          total: totalUser,
          currentPage: Number(page + 1),
          totalPage: Math.ceil(totalUser / limit),
        });
      }
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });
      if (user === null) {
        resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  deleteManyUser,
};
