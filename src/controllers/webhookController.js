const transactionService = require('../services/transactionService');

exports.midtransNotification = async (req, res) => {
  try {
    const notification = req.body;
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    // Default PENDING
    let status = "PENDING";

    if (transactionStatus === "settlement") {
      status = "PAID";
    } else if (transactionStatus === "capture" && fraudStatus === "accept") {
      status = "PAID"; // kartu kredit berhasil
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      status = "CANCELLED";
    }

    await transactionService.updateTransactionStatus(orderId, status, notification);

    res.status(200).json({ message: "Notification handled" });
  } catch (err) {
    console.error("Midtrans Notification Error:", err);
    res.status(500).json({ error: err.message });
  }
};
