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

const createVoucherFunc = async (req, res) => {
    try {
        const voucherData = req.body;
        console.log(voucherData);
        let data = await voucherService.createVoucher(voucherData);

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
const updateVoucherFunc = async (req, res) => {
    try {
        const voucherId = req.params.voucherId;
        const voucherData = req.body;

        let data = await voucherService.updateVoucher(voucherId, voucherData);

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
const deleteVoucherFunc = async (req, res) => {
    try {
        const voucherId = req.params.voucherId;

        let data = await voucherService.deleteVoucher(voucherId);
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
    createVoucherFunc,
    updateVoucherFunc,
    deleteVoucherFunc,
    checkVoucherFunc,
};
