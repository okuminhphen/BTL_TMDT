import express from "express";
import loginRegisterController from "../controller/loginRegisterController.js";
import productController from "../controller/productController.js";
import uploadController from "../controller/uploadController.js";
import cartController from "../controller/cartController.js";
import orderController from "../controller/orderController.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import paymentController from "../controller/paymentController.js";
import voucherController from "../controller/voucherController.js";
import userController from "../controller/userController.js";
import reviewController from "../controller/reviewController.js";
import chatBotController from "../controller/chatBotController.js";
import authController from "../controller/authController.js";
import bannerController from "../controller/bannerController.js";
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
    //auth route
    router.post("/auth/google", loginRegisterController.handleGoogleLogin);
    //router.post("/auth/facebook", loginRegisterController.handleFacebookLogin);
    router.post(
        "/auth/verify-captcha",
        loginRegisterController.handleVerifyCaptcha
    );

    router.post("/auth/send-otp", authController.handleSendOTP);
    router.post("/auth/verify-otp", authController.handleVerifyOTPFunc);
    //review route
    router.post("/review/add", reviewController.addReviewFunc);
    router.get(
        "/review/product/:productId",
        reviewController.getReviewsByProductIdFunc
    );
    //chatbot route
    router.post("/bot/chat", chatBotController.sendMessageFunc);
    // user route
    router.get("/user/read", userController.readFunc);
    router.get("/user/:id", userController.getUserFunc);
    router.post("/user/create", userController.createFunc);
    router.put("/user/update/:userId", userController.updateFunc);
    router.delete("/user/delete/:userId", userController.deleteFunc);
    router.put("/user/update-password/:id", userController.updatePasswordFunc);
    router.put(
        "/admin/user/update/:userId",
        userController.updateUserByAdminFunc
    );
    router.get("/user/read-all", userController.getAllUsersFunc);
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
    router.get("/order/read", orderController.readFunc);
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
    router.delete("/order/delete", verifyToken, orderController.deleteFunc);
    //payment route
    router.get(
        "/payment-methods",
        verifyToken,
        paymentController.readPaymentMethodsFunc
    );
    router.post(
        "/create-payment-url",
        verifyToken,
        paymentController.createPaymentUrlFunc
    );

    router.get(
        "/payment-return",
        verifyToken,
        paymentController.getPaymentReturnFunc
    );
    router.post("/webhook", paymentController.webhookFunc);
    router.get("/voucher/read", voucherController.readVoucherFunc);
    router.post("/voucher/create", voucherController.createVoucherFunc);
    router.put(
        "/voucher/update/:voucherId",
        voucherController.updateVoucherFunc
    );
    router.delete(
        "/voucher/delete/:voucherId",
        voucherController.deleteVoucherFunc
    );
    router.post("/voucher/check", voucherController.checkVoucherFunc);

    //banner
    router.get("/banner/read", bannerController.getActiveBanner);
    router.post("/banner/create", bannerController.handleCreateBanner);
    router.put("/banner/update/:bannerId", bannerController.handleUpdateBanner);
    router.delete(
        "/banner/delete/:bannerId",
        bannerController.handleDeleteBanner
    );
    router.get("/banner/read/active", bannerController.getRealActiveBanner);
    return app.use("/api/v1/", router);
};

export default initApiRouter;
