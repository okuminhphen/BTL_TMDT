"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Banner extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }
    Banner.init(
        {
            name: DataTypes.STRING,
            image: DataTypes.TEXT,
            url: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Banner",
        }
    );
    return Banner;
};
