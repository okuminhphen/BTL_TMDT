"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Orders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Orders.belongsTo(models.User, { foreignKey: "userId" });
            Orders.belongsToMany(models.ProductSize, {
                through: "OrdersProductSize",
                foreignKey: "orderId",
                as: "productSizes",
            });
            Orders.hasOne(models.Payment, {
                foreignKey: "orderId",
                as: "payment",
            });
            Orders.hasMany(models.OrdersDetails, {
                foreignKey: "orderId",
                as: "ordersDetails",
            });
        }
    }
    Orders.init(
        {
            userId: DataTypes.INTEGER,
            orderDate: DataTypes.DATE,
            status: DataTypes.STRING,
            totalPrice: DataTypes.FLOAT,
            customerName: DataTypes.STRING,
            customerEmail: DataTypes.STRING,
            customerPhone: DataTypes.STRING,
            shippingAddress: DataTypes.STRING,
            message: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Orders",
        }
    );
    return Orders;
};
