import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../uploads");
// Cấu hình lưu file vào thư mục uploads/
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Lưu file vào thư mục uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Đổi tên file để tránh trùng
  },
});

// Bộ lọc file (chỉ chấp nhận ảnh)
const fileFilter = (req, file, cb) => {
  console.log("📂 File nhận được:", file);
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error("Chỉ hỗ trợ ảnh JPG, JPEG, PNG!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
