import paymentService from "../service/paymentService.js";
import config from "config";
import dateFormat from "dateformat";
import crypto from "crypto";
import dotenv from "dotenv";
import { getIO } from "../socket.js";
dotenv.config();
const readPaymentMethodsFunc = async (req, res) => {
    try {
        let data = await paymentService.getPaymentMethods();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from controller",
            EC: "-1",
            DT: "",
        });
    }
};

const createPaymentUrlFunc = async (req, res) => {
    try {
        const ipAddr = req.headers["x-forwarded-for"]
            ? req.headers["x-forwarded-for"].split(",")[0].trim()
            : req.socket?.remoteAddress;

        const tmnCode = config.get("vnp_TmnCode");

        const secretKey = config.get("vnp_HashSecret");

        let vnpUrl = config.get("vnp_Url");

        const returnUrl = config.get("vnp_ReturnUrl");

        // Tạo thông tin đơn hàng
        const date = new Date();
        const createDate = dateFormat(date, "yyyymmddHHMMss"); // Định dạng chính xác

        const {
            orderId,
            amount,
            bankCode,
            orderDescription,
            orderType,
            language,
        } = req.body;

        const locale = language || "vn";
        const currCode = "VND";

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderDescription,
            vnp_OrderType: orderType,
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        if (bankCode) {
            vnp_Params.vnp_BankCode = bankCode;
        }

        // Sắp xếp object theo key để đảm bảo thứ tự
        vnp_Params = Object.keys(vnp_Params)
            .sort()
            .reduce((acc, key) => {
                acc[key] = vnp_Params[key];
                return acc;
            }, {});

        // Tạo chữ ký bảo mật
        const signData = new URLSearchParams(vnp_Params).toString();

        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");
        vnp_Params.vnp_SecureHash = signed;

        // Tạo URL thanh toán
        vnpUrl += "?" + new URLSearchParams(vnp_Params).toString();

        res.json({ vnpUrl });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from controller",
            EC: "-1",
            DT: "",
        });
    }
};
const getPaymentReturnFunc = async (req, res) => {
    try {
        let vnp_Params = req.query; // ✅ Lấy dữ liệu từ query params

        let secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = Object.keys(vnp_Params)
            .sort() // Sắp xếp theo thứ tự ASCII
            .reduce((acc, key) => {
                acc[key] = vnp_Params[key];
                return acc;
            }, {});

        let secretKey = config.get("vnp_HashSecret");

        let signData = new URLSearchParams(vnp_Params).toString();

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            let orderId = vnp_Params["vnp_TxnRef"];
            let status =
                vnp_Params["vnp_ResponseCode"] === "00" ? "PAID" : "FAILED";
            let amount = vnp_Params["vnp_Amount"] / 100;
            let transactionNo = vnp_Params["vnp_TransactionNo"];
            let bankCode = vnp_Params["vnp_BankCode"];
            let responseCode = vnp_Params["vnp_ResponseCode"];
            let react_url = process.env.REACT_URL;
            await paymentService.updatePaymentStatus(
                orderId,
                status,
                transactionNo
            );
            return res.redirect(
                `${react_url}/payment-status?orderId=${orderId}&status=${status}&amount=${amount}&transactionNo=${transactionNo}&bankCode=${bankCode}&responseCode=${responseCode}`
            );
        } else {
            return res.status(400).json({
                EC: "1",
                EM: "Chữ ký không hợp lệ!",
                DT: "",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from controller",
            EC: "-1",
            DT: "",
        });
    }
};
const webhookFunc = async (req, res) => {
    try {
        const data = req.body;

        console.log("📩 Webhook received:", data);

        // 🔥 Gửi socket đến frontend
        const io = getIO();
        io.emit("payment-success", "success");

        res.status(200).send("OK");
    } catch (error) {
        console.error("❌ Webhook error:", error);
        return res.status(500).json({
            EM: "Error from controller",
            EC: "-1",
            DT: "",
        });
    }
};

export default {
    readPaymentMethodsFunc,
    createPaymentUrlFunc,
    getPaymentReturnFunc,
    webhookFunc,
};
