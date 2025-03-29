import express from "express";
import loginRegisterController from "../controller/loginRegisterController.js";
import productController from "../controller/productController.js";
import uploadController from "../controller/uploadController.js";
import cartController from "../controller/cartController.js";
import orderController from "../controller/orderController.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import paymentController from "../controller/paymentController.js";

import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/**
 *
 * @param {*} app express app
 */

const initApiRouter = (app) => {
    //test thử api

    router.get("/test-api", loginRegisterController.testApi);
    router.post("/register", loginRegisterController.handleRegister);
    router.post("/login", loginRegisterController.handleLogin);
    router.post("/logout", loginRegisterController.handleLogout);
    //product route
    router.get("/product/read", productController.readFunc);
    router.get("/size/read", productController.readSizeFunc);
    router.get("/category/read", productController.readCategoryFunc);
    router.get("/product/:id", productController.getProductFunc);
    router.post("/product/create", productController.createFunc);
    router.put("/product/update", productController.updateFunc);
    router.delete("/product/delete", productController.deleteFunc);
    router.get(
        "/product-by-category/read",
        productController.getProductByCategoryFunc
    );
    //cart route
    router.get("/cart/read/:userId", verifyToken, cartController.readFunc);
    router.post("/cart/add", verifyToken, cartController.addFunc);
    router.put("/cart/update", verifyToken, cartController.updateFunc);
    router.delete(
        "/cart/delete/:cartProductSizeId",
        verifyToken,
        cartController.deleteFunc
    );
    //upload route
    router.post(
        "/upload/images",
        verifyToken,
        upload.array("images", 5),
        uploadController.uploadFunc
    );

    //order route
    router.get("/order/read", verifyToken, orderController.readFunc);
    router.get(
        "/order/read/:userId",
        verifyToken,
        orderController.readByUserIdFunc
    );
    router.post("/order/create", verifyToken, orderController.createFunc);
    router.put("/order/update", verifyToken, orderController.updateFunc);
    router.put(
        "/order/details/update/:orderId",
        verifyToken,
        orderController.updateStatusFunc
    );
    router.delete("/order/delete", orderController.deleteFunc);
    //payment route
    router.get("/payment-methods", paymentController.readPaymentMethodsFunc);
    router.post("/create-payment-url", paymentController.createPaymentUrlFunc);

    router.get("/payment-return", paymentController.getPaymentReturnFunc);

    return app.use("/api/v1/", router);
};

export default initApiRouter;
