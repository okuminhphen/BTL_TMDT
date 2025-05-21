import orderService from "../service/orderService.js";
const readFunc = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
    }
};
const createFunc = async (req, res) => {
    try {
        let orderData = req.body;
        let data = await orderService.createOrder(orderData);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from controller",
            EC: "-1",
            DT: "",
        });
    }
};
const updateFunc = async (req, res) => {
    try {
    } catch (error) {}
};
const deleteFunc = async (req, res) => {
    try {
    } catch (error) {}
};
const readByUserIdFunc = async (req, res) => {
    try {
        let userId = req.params.userId;
        console.log(userId);
        let data = await orderService.getOrdersByUserId(userId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from controller",
            EC: "-1",
            DT: "",
        });
    }
};
const updateStatusFunc = async (req, res) => {
    try {
        let orderId = req.params.orderId;
        let updatedData = req.body.status;

        let data = await orderService.updateOrderStatus(orderId, updatedData);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from controller",
            EC: "-1",
            DT: "",
        });
    }
};
export default {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    readByUserIdFunc,
    updateStatusFunc,
};
