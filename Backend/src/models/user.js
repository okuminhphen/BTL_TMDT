"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasOne(models.Cart, { foreignKey: "userId" }); // 1 - 1 với Cart
            User.hasMany(models.Orders, { foreignKey: "userId" }); // 1 - N với Order
            User.hasMany(models.Review, { foreignKey: "userId" }); // 1 - N với Review
            User.belongsToMany(models.Role, {
                through: models.UserRole, // Dùng model thay vì string
                foreignKey: "userId", // Khóa ngoại từ User -> UserRole
                otherKey: "roleId", // Khóa ngoại từ Role -> UserRole
            });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            username: DataTypes.STRING,
            address: DataTypes.STRING,
            phone: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
            tableName: "User",
        }
    );
    return User;
};
