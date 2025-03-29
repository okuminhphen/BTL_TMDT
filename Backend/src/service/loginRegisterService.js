import db from "../models/index.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
};

//check email/phone are exist?
const checkEmailExist = async (userEmail) => {
    let user = await db.User.findOne({ where: { email: userEmail } });
    if (user) {
        return true;
    }

    return false;
};

const checkPhoneExist = async (userPhone) => {
    let user = await db.User.findOne({ where: { phone: userPhone } });
    if (user) {
        return true;
    }

    return false;
};

const registerNewUser = async (rawUserData) => {
    try {
        let isEmailExist = await checkEmailExist(rawUserData.email);
        console.log(">>> check email: ", isEmailExist);
        if (isEmailExist === true) {
            return {
                EM: "The email is already exist",
                EC: 1,
            };
        }
        let isPhoneExist = await checkPhoneExist(rawUserData.phone);
        if (isPhoneExist === true) {
            return {
                EM: "The phone is already exist",
                EC: 1,
            };
        }
        // hash password
        let hashPassword = hashUserPassword(rawUserData.password);

        let customerRole = await db.Role.findOne({
            where: { name: "customer" },
        });
        if (!customerRole) {
            return { EM: "Role 'customer' not found", EC: 1, DT: [] };
        }

        // create  new user
        let newUser = await db.User.create({
            email: rawUserData.email,
            phone: rawUserData.phone,
            username: rawUserData.username,
            password: hashPassword,
        });
        if (!newUser) {
            return {
                EM: "failed to create user",
                EC: -1,
            };
        }
        console.log("UserRole Model:", db.UserRole);

        await db.UserRole.create({
            userId: newUser.id,
            roleId: customerRole.id,
        });
        return {
            EM: "A user is created  successfully",
            EC: 0,
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Something wrongs in service...",
            EC: -2,
        };
    }
};

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true or false
};

const handleUserLogin = async (rawUserData) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawUserData.emailOrPhone },
                    { phone: rawUserData.emailOrPhone },
                ],
            },
            include: [
                {
                    model: db.Role, // Lấy thông tin từ bảng Role
                    through: { attributes: [] }, // Không lấy dữ liệu từ bảng trung gian
                    attributes: ["id", "name"], // Chỉ lấy id và tên của role
                },
            ],
        });

        if (!user) {
            return {
                EM: "Your email/phone number or password is incorrect",
                EC: 1,
                DT: "",
            };
        }

        // Kiểm tra mật khẩu
        if (!checkPassword(rawUserData.password, user.password)) {
            return {
                EM: "Your email/phone number or password is incorrect",
                EC: 1,
                DT: "",
            };
        }
        let role = user.Roles.length > 0 ? user.Roles[0] : null;
        return {
            EM: "Login success",
            EC: 0,
            DT: {
                userId: user.id,
                email: user.email,
                password: user.password,
                userRole: role, // Thêm danh sách role
            },
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Something wrongs in service...",
            EC: -2,
        };
    }
};

export default {
    registerNewUser,
    handleUserLogin,
};
