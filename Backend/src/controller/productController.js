import productService from "../service/productService.js";

const readFunc = async (req, res) => {
    try {
        let data = await productService.getProducts();
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, //error code
            DT: data.DT, // Date
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error get products", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};
const createFunc = async (req, res) => {
    try {
        let data = await productService.addNewProduct(req.body);

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, //error code
            DT: data.DT, // Data
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Data
        });
    }
};
const updateFunc = async (req, res) => {
    try {
        let data = await productService.updateProduct(req.body);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, //error code
            DT: data, // Data
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Data
        });
    }
};
const deleteFunc = async (req, res) => {
    try {
        let data = await productService.deleteProduct(req.body.id);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, //error code
            DT: data.DT, // Data
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

const readSizeFunc = async (req, res) => {
    try {
        let data = await productService.getAllSizes();
        if (data) {
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, //error code
                DT: data.DT, // Date
            });
        } else {
            console.log(e);
            return res.status(500).json({
                EM: "error get products", // error message
                EC: "2", //error code
                DT: "", // Date
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

const readCategoryFunc = async (req, res) => {
    try {
        let data = await productService.getCategory();
        if (data) {
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, //error code
                DT: data.DT, // Date
            });
        } else {
            console.log(e);
            return res.status(500).json({
                EM: "error get products", // error message
                EC: "2", //error code
                DT: "", // Date
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

const getProductFunc = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await productService.getProductById(id);
        if (data) {
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, //error code
                DT: data.DT, // Date
            });
        } else {
            console.log(e);
            return res.status(500).json({
                EM: "error get products", // error message
                EC: "2", //error code
                DT: "", // Date
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

const getProductByCategoryFunc = async (req, res) => {
    try {
        let categoryId = req.body.categoryId;

        let data = await productService.getProductByCategoryId(categoryId);
        if (data) {
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, //error code
                DT: data.DT, // Date
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};
export default {
    readFunc,
    readSizeFunc,
    readCategoryFunc,
    updateFunc,
    deleteFunc,
    getProductFunc,
    createFunc,
    getProductByCategoryFunc,
};

