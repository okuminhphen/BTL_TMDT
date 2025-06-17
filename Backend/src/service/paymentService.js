import db from "../models/index.js";

const getPaymentMethods = async () => {
    try {
        let paymentMethods = await db.PaymentMethods.findAll();

        return {
            EM: "Get payment methods successfully",
            EC: "0",
            DT: paymentMethods,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Error from service",
            EC: "-1",
            DT: "",
        };
    }
};

const updatePaymentStatus = async (orderId, status, transactionNo) => {
    try {
        let payment = await db.Payment.findOne({ where: { orderId } });
        if (!payment) {
            return {
                EM: "Payment record not found",
                EC: "1",
                DT: "",
            };
        }

        let updatedStatus = status;
        let updateData = { status: updatedStatus };

        if (status === "PAID" && transactionNo) {
            updateData.transactionId = transactionNo;
        }

        let result = await db.Payment.update(updateData, {
            where: { orderId },
        });
    } catch (error) {
        console.log(error);
        return {
            EM: "Error from service",
            EC: "-1",
            DT: "",
        };
    }
};
export default { getPaymentMethods, updatePaymentStatus };
