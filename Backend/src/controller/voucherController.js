import voucherService from "../service/voucherService.js";
const readVoucherFunc = async (req, res) => {
    try {
        let data = await voucherService.getAllVoucher();
        console.log(data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error from server",
            EC: 0,
        });
    }
};
const checkVoucherFunc = (req, res) => {};

export default {
    readVoucherFunc,
    checkVoucherFunc,
};
