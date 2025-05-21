const isAdmin = (req, res, next) => {
    // verifyToken đã chạy trước và lưu thông tin vào req.user
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            EM: "Cần quyền admin để truy cập",
            EC: "3",
            DT: "",
        });
    }
};

module.exports = { isAdmin };
