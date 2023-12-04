const cron = require("node-cron");
const Order = require("../models/OrderProduct");

// Hàm xóa các đơn hàng đã bị hủy sau một tháng
async function deleteCancelledOrders() {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Tìm và xóa các đơn hàng đã bị hủy sau một tháng
    const result = await Order.deleteMany({
      isCancelled: true,
      updatedAt: { $lte: oneMonthAgo },
    });

    console.log(
      `Đã xóa ${result.deletedCount} đơn hàng đã bị hủy sau một tháng.`
    );
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng đã bị hủy:", error);
  }
}
// Lập lịch để chạy hàm này mỗi ngày lúc 2 giờ sáng
cron.schedule("0 2 * * *", () => {
  deleteCancelledOrders();
});
