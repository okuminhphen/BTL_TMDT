import db from "../models/index.js";

const getAllVoucher = async () => {
    try {
        let vouchers = await db.Vouchers.findAll();
        if (!vouchers) {
            return {
                EM: "failed to get all vouchers",
                EC: "1",
            };
        }
        return {
            EM: "get all vouchers success",
            EC: "0",
            DT: vouchers,
        };
    } catch {
        return {
            EM: "error from voucher service",
            EC: "-1",
        };
    }
};
export default {
    getAllVoucher,
};
