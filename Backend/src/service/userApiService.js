import db from "../models/index.js";
import bcrypt from "bcryptjs";
const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true or false
};
const getUserById = async (id) => {
    try {
        const user = await db.User.findByPk(id);

        if (!user) {
            return {
                EM: "User not found",
                EC: 1,
                DT: null,
            };
        }
        return {
            EM: "Get user successfully",
            EC: 0,
            DT: user,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Error from server",
            EC: 1,
            DT: null,
        };
    }
};

const updateUserById = async (id, userData) => {
    try {
        console.log("id", id);
        const user = await db.User.findByPk(id);
        if (!user) {
            return {
                EM: "User not found",
                EC: 1,
                DT: null,
            };
        }
        await user.update(userData);
        return {
            EM: "Update user successfully",
            EC: 0,
            DT: user,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Error from server",
            EC: 1,
            DT: null,
        };
    }
};

const updatePasswordById = async (id, passwordData) => {
    try {
        const user = await db.User.findByPk(parseInt(id));
        if (!user) {
            return {
                EM: "User not found",
                EC: 1,
                DT: null,
            };
        }

        console.log("passwordData", passwordData);

        const isCorrectCurrentPassword = checkPassword(
            passwordData.currentPassword,
            user.password
        );
        if (!isCorrectCurrentPassword) {
            console.log("Current password is incorrect");
            return {
                EM: "Current password is incorrect",
                EC: 1,
                DT: null,
            };
        }
        console.log("passwordData.newPassword", passwordData.newPassword);
        const hashPassword = bcrypt.hashSync(passwordData.newPassword, 10);
        await user.update({ password: hashPassword });
        return {
            EM: "Update password successfully",
            EC: 0,
            DT: user,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Error from server",
            EC: 1,
            DT: null,
        };
    }
};
export default {
    getUserById,
    updateUserById,
    updatePasswordById,
};
