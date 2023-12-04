const dotenv = require("dotenv");
const nodemailer = require("nodemailer"); // Thư viện gửi email
var inlineBase64 = require("nodemailer-plugin-inline-base64");
const bcrypt = require("bcrypt"); // Thư viện mã hóa, để mã hóa mật khẩu
const speakeasy = require("speakeasy"); // Thư viện tạo mã OTP
dotenv.config();
const User = require("../models/UserModel");
const Order = require("../models/OrderProduct"); // Import mô hình Order

// Cấu hình thông tin SMTP hoặc sử dụng dịch vụ email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const forgetPassword = async (email) => {
  try {
    const checkUser = await User.findOne({ email: email });
    if (checkUser === null) {
      return {
        status: "ERROR",
        message: "Người dùng không tồn tại",
      };
    }

    // Tạo và lưu mã OTP tạm thời
    const secret = speakeasy.generateSecret({ length: 20 });
    const expirationTime = Date.now() + 60 * 1000;
    checkUser.tempSecret = secret.base32;
    checkUser.tempSecretExpiration = expirationTime;
    await checkUser.save();
    // Gửi mã OTP đến email
    const mailOptions = {
      from: '"Cửa hàng trà sữa DoraTea"<thanhhuyen0510utt@gmail.com>',
      to: email,
      subject: "Mã OTP để reset mật khẩu",
      text: `Mã OTP để reset mật khẩu của bạn là: ${speakeasy.totp({
        secret: checkUser.tempSecret,
        encoding: "base32",
        step: 120,
      })}`,
    };
    await transporter.sendMail(mailOptions);
    return {
      status: "OK",
      message: "Gửi mã OTP thành công",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Lỗi khi quên mật khẩu",
      error: error.message,
    };
  }
};
const resetPassword = async (email, newPassword, confirmPassword) => {
  try {
    const checkUser = await User.findOne({ email: email });
    if (checkUser === null) {
      return {
        status: "ERROR",
        message: "Người dùng không tồn tại",
      };
    }
    if (newPassword !== confirmPassword) {
      return {
        status: "ERROR",
        message: "Mật khẩu mới không trùng khớp",
      };
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    checkUser.password = hash;
    checkUser.tempSecret = null;
    await checkUser.save();
    return {
      status: "OK",
      message: "Cập nhật mật khẩu thành công",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Lỗi khi quên mật khẩu",
      error: error.message,
    };
  }
};
const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email: email });
  if (!user || !user.tempSecret) {
    return {
      status: "ERROR",
      message: "Người dùng không hợp lệ hoặc mã OTP hết hạn",
    };
  }
  const verified = speakeasy.totp.verify({
    secret: user.tempSecret,
    encoding: "base32",
    token: otp,
    step: 120,
  });
  // Kiểm tra xem khóa bí mật có hết hạn hay không
  if (user.tempSecretExpiration && Date.now() > user.tempSecretExpiration) {
    user.tempSecret = null;
    await user.save();
    return {
      status: "ERROR",
      message: "Mã OTP đã hết hạn",
    };
  }
  if (verified) {
    return {
      status: "OK",
      message: "Mã OTP hợp lệ",
    };
  } else {
    return {
      status: "ERROR",
      message: "Mã OTP không hợp lệ",
    };
  }
};
// Hàm gửi email thông báo đơn hàng cho người dùng
const sendConfirmOrderEmail = async (data) => {
  try {
    const { orderId, email } = data;
    // Tìm thông tin về đơn hàng từ cơ sở dữ liệu
    const order = await Order.findById(orderId).exec();
    // Tạo nội dung email
    const emailContent = `
      Xin chào,
      Đơn hàng của bạn đã được xác nhận thành công.
      Đơn hàng số: ${order._id}
      Tổng cộng: ${order.totalPrice} VNĐ
      Cửa hàng sẽ giao hàng đến bạn một cách nhanh nhất.
    `;

    // Thiết lập thông tin email
    const mailOptions = {
      from: '"Cửa hàng trà sữa DoraTea"<thanhhuyen0510utt@gmail.com>',
      to: email,
      subject: "Xác nhận đơn hàng",
      text: emailContent,
    };
    // Gửi email
    await transporter.sendMail(mailOptions);
    return {
      status: "OK",
      message: "Gửi email thành công",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Lỗi khi gửi email",
      error: error.message,
    };
  }
};
const sendSuccessOrderEmail = async (data) => {
  try {
    const { email } = data;
    // Tìm thông tin về đơn hàng từ cơ sở dữ liệu
    // Tạo nội dung email
    const emailContent = `
      Đơn hàng của bạn đã được hoàn thành.
      Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.
    `;

    // Thiết lập thông tin email
    const mailOptions = {
      from: '"Cửa hàng trà sữa DoraTea"<thanhhuyen0510utt@gmail.com>',
      to: email,
      subject: "Hoàn thành đơn hàng",
      text: emailContent,
    };
    // Gửi email
    await transporter.sendMail(mailOptions);
    return {
      status: "OK",
      message: "Gửi email thành công",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Lỗi khi gửi email",
      error: error.message,
    };
  }
};
// const sendEmailCreateOrder = async (email,orderItems) => {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: process.env.MAIL_ACCOUNT, // generated ethereal user
//       pass: process.env.MAIL_PASSWORD, // generated ethereal password
//     },
//   });
//   transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

//   let listItem = '';
//   const attachImage = []
//   orderItems.forEach((order) => {
//     listItem += `<div>
//     <div>
//       Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
//       <div>Bên dưới là hình ảnh của sản phẩm</div>
//     </div>`
//     attachImage.push({path: order.image})
//   })

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: process.env.MAIL_ACCOUNT, // sender address
//     to: email, // list of receivers
//     subject: "Bạn đã đặt hàng tại shop LẬP trình thật dễ", // Subject line
//     text: "Hello world?", // plain text body
//     html: `<div><b>Bạn đã đặt hàng thành công tại shop Lập trình thật dễ</b></div> ${listItem}`,
//     attachments: attachImage,
//   });
// }
module.exports = {
  forgetPassword,
  verifyOTP,
  resetPassword,
  sendConfirmOrderEmail,
  sendSuccessOrderEmail,
  // sendEmailCreateOrder
};
