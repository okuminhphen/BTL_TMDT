import db from "../models/index.js";
import moment from "moment-timezone";
const createOrder = async (orderData) => {
    try {
        let userId = orderData.userId;
        let cartItems = orderData.cartItems;
        let customerInfo = orderData.customerInfo;
        let totalPrice = orderData.totalPrice;
        let paymentMethodId = orderData.paymentMethodId;
        if (
            !customerInfo ||
            !totalPrice ||
            !paymentMethodId ||
            !cartItems ||
            !userId
        ) {
            return {
                EM: "Missing required fields",
                EC: "-1",
                DT: "",
            };
        }

        let newOrder = await db.Orders.create({
            userId: userId,
            orderDate: moment().tz("Asia/Ho_Chi_Minh").toDate(), // Trả về đối tượng Date, không bị lỗi format
            totalPrice: orderData.totalPrice,
            status: "PENDING",
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerEmail: customerInfo.email,
            shippingAddress: customerInfo.address,
            message: customerInfo.message,
        });
        console.log("check order", newOrder);
        // console.log(
        //     "Chuyển về Việt Nam:",
        //     moment(order.orderDate)
        //         .tz("Asia/Ho_Chi_Minh")
        //         .format("YYYY-MM-DD HH:mm:ss")
        // );

        let orderId = newOrder.id;
        const ordersDetailsData = cartItems.map((item) => ({
            orderId: orderId,
            productId: item.id,
            productName: item.name,
            productImage: JSON.stringify(item.images),
            productSize: item.size,
            quantity: item.quantity,
            priceAtOrder: item.price,
            totalPrice: item.price * item.quantity,
        }));

        await db.OrdersDetails.bulkCreate(ordersDetailsData);

        await db.Payment.create({
            orderId: orderId,
            paymentMethodId: paymentMethodId,
            amount: totalPrice,
            transactionId: "",
            status: "PENDING",
        });
        await db.Cart.destroy({ where: { userId: userId } });
        return {
            EM: "Create order successfully",
            EC: "0",
            DT: orderId,
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
const getOrdersByUserId = async (userId) => {
    try {
        let orders = await db.Orders.findAll({
            where: {
                userId: userId,
            },
            attributes: [
                "id",
                "userId",
                "orderDate",
                "totalPrice",
                "status",
                "customerName",
                "customerPhone",
                "customerEmail",
                "shippingAddress",
                "message",
            ],
            include: [
                {
                    model: db.OrdersDetails, // Bảng chi tiết đơn hàng
                    attributes: [
                        "id",
                        "orderId",
                        "productId",
                        "productName",
                        "productImage",
                        "productSize",
                        "quantity",
                        "priceAtOrder",
                        "totalPrice",
                    ],
                    as: "ordersDetails",
                },
                {
                    model: db.Payment, // Bảng thanh toán
                    attributes: [
                        "id",
                        "orderId",
                        "paymentMethodId",
                        "amount",
                        "transactionId",
                        "status",
                    ],
                    as: "payment",
                    include: [
                        {
                            model: db.PaymentMethods, // Thêm bảng PaymentMethods
                            attributes: ["id", "name", "description"], // Lấy tên phương thức thanh toán
                            as: "paymentMethod",
                        },
                    ],
                },
            ],
        });

        return {
            EM: "Get orders by user id successfully",
            EC: "0",
            DT: orders,
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
const updateOrderStatus = async (orderId, newStatus) => {
    try {
        let result = await db.Orders.update(
            { status: newStatus }, // Dữ liệu cập nhật
            { where: { id: orderId } } // Điều kiện cập nhật
        );
        if (!result) {
            return {
                EM: "failed to update order status",
                EC: "-1",
                DT: "",
            };
        }

        return {
            EM: "Update order status successfully",
            EC: "0",
            DT: result,
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
export default { createOrder, getOrdersByUserId, updateOrderStatus };
