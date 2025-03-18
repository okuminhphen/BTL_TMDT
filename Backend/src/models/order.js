"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "userId" });
      Order.belongsToMany(models.ProductSize, { through: "OrderProductSize" });
      Order.hasMany(models.Payment, { foreignKey: "orderId" });
    }
  }
  Order.init(
    {
      orderDate: DataTypes.DATE,
      status: DataTypes.STRING,
      totalPrice: DataTypes.FLOAT,
      shippingAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
