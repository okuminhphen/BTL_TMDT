import express from "express";
import loginRegisterController from "../controller/loginRegisterController";
import productController from "../controller/productController";
import uploadController from "../controller/uploadController";
import cartController from "../controller/cartController";
import upload from "../middleware/upload";
import { verifyToken } from "../middleware/authMiddleware";

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

    return app.use("/api/v1/", router);
};

export default initApiRouter;
