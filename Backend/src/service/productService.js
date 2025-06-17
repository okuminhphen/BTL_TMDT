import db from "../models/index.js";

const getProducts = async () => {
    try {
        let data = await db.Product.findAll({
            attributes: ["id", "name", "description", "price", "images"], // Chọn các cột cần lấy
            include: [
                {
                    model: db.Size,
                    as: "sizes",
                    attributes: ["id", "name"], // Lấy tên size
                    through: { attributes: ["stock"] }, // Lấy stock từ bảng trung gian ProductSize
                },
                {
                    model: db.Category,

                    attributes: ["id", "name", "description"],
                },
            ],
        });

        return {
            EM: "Get products success",
            EC: 0,
            DT: data,
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Failed to get products",
            EC: 1,
            DT: [],
        };
    }
};

const getAllSizes = async () => {
    try {
        let data = await db.Size.findAll({ attributes: ["id", "name"] });

        return {
            EM: "Get sizes success",
            EC: 0,
            DT: data,
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Failed to get sizes",
            EC: 1,
            DT: [],
        };
    }
};

const getCategory = async () => {
    try {
        let data = await db.Category.findAll();

        return {
            EM: "Get category success",
            EC: 0,
            DT: data,
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Failed to get category",
            EC: 1,
            DT: [],
        };
    }
};
// const getUsersWithPagination = async (page, limit) => {
//   try {
//     let offset = (page - 1) * limit;
//     const { count, rows } = await db.User.findAndCountAll({
//       attributes: ["id", "username", "email", "phone", "sex"],
//       include: { model: db.Group, attributes: ["name", "description"] },
//       offset: offset,
//       limit: limit,
//     });
//     let totalPages = Math.ceil(count / limit);
//     let data = { totalRows: count, totalPage: totalPages, users: rows };

//     if (data) {
//       return {
//         EM: "get data success",
//         EC: 0,
//         DT: data,
//       };
//     } else {
//       return {
//         EM: "get data success",
//         EC: 0,
//         DT: [],
//       };
//     }
//   } catch (e) {
//     console.log(e);
//     return {
//       EM: "something wrongs with service",
//       EC: "1",
//       DT: [],
//     };
//   }
// };

const addNewProduct = async (data) => {
    try {
        if (!data.name || !data.price || !data.images) {
            return { EM: "Missing product data", EC: "1", DT: "" };
        }

        let newProduct = await db.Product.create({
            name: data.name,
            description: data.description,
            price: data.price,
            images: Array.isArray(data.images)
                ? JSON.stringify(data.images)
                : data.images,
            categoryId: data.categoryId ? data.categoryId : null,
        });

        let productSizes = [];

        for (let size of data.sizes) {
            if (size.name) {
                let sizeRecord = await db.Size.findOne({
                    where: { name: size.name },
                });
                if (sizeRecord) {
                    productSizes.push({
                        productId: newProduct.id,
                        sizeId: sizeRecord.id,
                        stock: size.stock || 0,
                    });
                }
            }
        }

        if (productSizes.length > 0) {
            await db.ProductSize.bulkCreate(productSizes, {
                fields: ["productId", "sizeId", "stock"],
            });
        }
        return {
            EM: "Create new product success",
            EC: 0,
            DT: newProduct,
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Failed to create product",
            EC: 1,
            DT: [],
        };
    }
};

const updateProduct = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        if (!data || !data.id) {
            return { EM: "Invalid input", EC: 1, DT: [] };
        }

        let product = await db.Product.findByPk(data.id, { transaction });

        if (!product) {
            return { EM: "Product not found", EC: 2, DT: [] };
        }
        await product.update(
            {
                name: data.name,
                description: data.description,
                price: data.price,
                images: data.images,
                categoryId: data.categoryId,
            },
            { transaction }
        );

        // 3️⃣ Cập nhật danh sách sizes
        for (let size of data.sizes) {
            let productSize = await db.ProductSize.findOne({
                where: { productId: data.id, sizeId: size.id }, // Truy vấn theo ID
                transaction,
            });

            if (productSize) {
                // 🔹 Nếu size đã tồn tại, cập nhật `stock`
                await productSize.update(
                    { stock: size.ProductSize.stock },
                    { transaction }
                );
            } else if (size.stock > 0) {
                // 🔹 Nếu size chưa có và `stock > 0`, thêm mới
                await db.ProductSize.create(
                    { productId: id, sizeId: size.id, stock: size.stock },
                    { transaction }
                );
            }
        }

        await transaction.commit();
        return { EM: "Update product success", EC: 0, DT: [] };
    } catch (e) {
        await transaction.rollback();
        console.log(e);
        return {
            EM: "Something wrong with update product",
            EC: 1,
            DT: [],
        };
    }
};
const deleteProduct = async (id) => {
    const transaction = await db.sequelize.transaction();
    try {
        let product = await db.Product.findByPk(id, { transaction });

        if (!product) {
            return {
                EM: "Product is not exist",
                EC: 2,
                DT: [],
            };
        } else {
            // Xoá tất cả các kích cỡ của sản phẩm trong ProductSize
            await db.ProductSize.destroy({
                where: { productId: id },
                transaction,
            });

            // Xoá sản phẩm
            await product.destroy({ transaction });

            await transaction.commit(); // Xác nhận xoá
            return {
                EM: "Delete product success",
                EC: 0,
                DT: [],
            };
        }
    } catch (e) {
        await transaction.rollback();
        console.log(e);
        return {
            EM: "something wrongs with service",
            EC: 1,
            DT: [],
        };
    }
};
const getProductById = async (idProduct) => {
    try {
        let data = await db.Product.findOne({
            where: { id: idProduct },
            attributes: ["id", "name", "description", "price", "images"], // Chọn các cột cần lấy
            include: [
                {
                    model: db.Size,
                    as: "sizes",
                    attributes: ["id", "name"], // Lấy tên size
                    through: { attributes: ["stock"] }, // Lấy stock từ bảng trung gian ProductSize
                },
                {
                    model: db.Category,
                    attributes: ["id", "name", "description"],
                },
            ],
        });
        if (data) {
            return {
                EM: "get product success",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "Get products fail",
                EC: 2,
                DT: [],
            };
        }
    } catch (e) {
        console.log(e);
        return {
            EM: "something wrong :(",
            EC: 1,
            DT: [],
        };
    }
};
const getProductByCategoryId = async (categoryId) => {
    try {
        let data = await db.Product.findAll({
            where: { categoryId: categoryId },
        });
        return {
            EM: "get product by category id success",
            EC: 0,
            DT: data,
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "something wrong :(",
            EC: 1,
            DT: [],
        };
    }
};
export default {
    getProducts,
    getAllSizes,
    getCategory,
    //getUsersWithPagination,
    addNewProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductByCategoryId,
};
