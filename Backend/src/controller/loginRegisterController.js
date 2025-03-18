import loginRegisterService from "../service/loginRegisterService";
import { generateToken } from "../middleware/authMiddleware";
const testApi = (req, res) => {
    return res.status(200).json({
        message: "oke",
        data: "test api",
    });
};

const handleRegister = async (req, res) => {
    try {
        if (!req.body.email || !req.body.phone || !req.body.password) {
            return res.status(200).json({
                EM: "Missing required parameters", // error message
                EC: "1", //error code
                DT: "", // Date
            });
        }

        if (req.body.password && req.body.password.length < 4) {
            return res.status(200).json({
                EM: "Your password must have more than 3 letters", // error message
                EC: "1", //error code
                DT: "", // Date
            });
        }

        // service: create user
        let data = await loginRegisterService.registerNewUser(req.body);

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, //error code
            DT: data.DT, // Date
        });
    } catch (e) {
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

const handleLogin = async (req, res) => {
    console.log("check login from react", req.body);
    try {
        let data = await loginRegisterService.handleUserLogin(req.body);

        if (data) {
            let payload = {
                id: data.DT.userId,
                email: data.DT.email,
                role: data.DT.userRole.name,
            };
            const token = generateToken(payload);
            if (!token) {
                return res.status(401).json({ EM: "invalid token" });
            }
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, //error code
                DT: { token, ...data.DT },
            });
        }
    } catch (e) {
        return res.status(500).json({
            EM: "error", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

module.exports = {
    testApi,
    handleRegister,
    handleLogin,
};
