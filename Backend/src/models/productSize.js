"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class ProductSize extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProductSize.belongsTo(models.Product, {
                foreignKey: "productId",
                targetKey: "id",
                as: "products",
            });
            ProductSize.belongsTo(models.Size, {
                foreignKey: "sizeId",
                targetKey: "id",
                as: "sizes",
            });

            ProductSize.belongsToMany(models.Cart, {
                through: "CartProductSize",
                foreignKey: "productSizeId",
                otherKey: "cartId", // 👈 Chỉ định khóa ngoại đúng
            });
        }
    }
    ProductSize.init(
        {
            productId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Product",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            sizeId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Size",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            stock: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "ProductSize",
            freezeTableName: true,
        }
    );
    return ProductSize;
};
