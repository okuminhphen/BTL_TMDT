import "./Register.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { registerNewUser } from "../../service/userService";
import {
  FaUserAlt,
  FaLock,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const defaultValidInput = {
    isValidEmail: true,
    isValidPhone: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  };

  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

  const isValidInputs = () => {
    setObjCheckInput(defaultValidInput);
    if (!email) {
      toast.error("Email is required");
      setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
      return false;
    }
    if (!phone) {
      toast.error("Phone is required");
      setObjCheckInput({ ...defaultValidInput, isValidPhone: false });
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Your password is not the same");
      setObjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    let check = isValidInputs();
    if (check) {
      let response = await registerNewUser(email, phone, username, password);
      let serverData = response.data;
      if (+serverData.EC === 0) {
        toast.success(serverData.EM);
        navigate("/login");
      } else {
        toast.error(serverData.EM);
      }
    }
  };

  return (
    <div className="register-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card border-0 shadow-lg">
              <div className="row g-0">
                <div className="col-md-6 d-none d-md-block">
                  <div
                    className="h-100 text-white d-flex flex-column justify-content-center p-5 rounded-start"
                    style={{
                      background:
                        "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div className="position-relative">
                      <h1 className="display-4 fw-bold mb-2">HappyShop</h1>
                      <p className="lead">Tạo tài khoản để mua sắm ngay!</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card-body p-4 p-md-5">
                    <div className="d-flex align-items-center mb-4 pb-1">
                      <FaUserPlus className="text-primary fs-4 me-3" />
                      <span className="h2 fw-bold">Đăng ký</span>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className={`form-control ${
                          !objCheckInput.isValidEmail ? "is-invalid" : ""
                        }`}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label>
                        <FaEnvelope className="me-2" />
                        Email
                      </label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className={`form-control ${
                          !objCheckInput.isValidPhone ? "is-invalid" : ""
                        }`}
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <label>
                        <FaPhone className="me-2" />
                        Số điện thoại
                      </label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <label>
                        <FaUserAlt className="me-2" />
                        Tên người dùng
                      </label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className={`form-control ${
                          !objCheckInput.isValidPassword ? "is-invalid" : ""
                        }`}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label>
                        <FaLock className="me-2" />
                        Mật khẩu
                      </label>
                    </div>
                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        className={`form-control ${
                          !objCheckInput.isValidConfirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <label>
                        <FaLock className="me-2" />
                        Nhập lại mật khẩu
                      </label>
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-primary btn-lg py-3"
                        onClick={handleRegister}
                      >
                        Đăng ký
                      </button>
                    </div>
                    <div className="text-center mt-3">
                      <span>Đã có tài khoản? </span>
                      <a
                        href="#"
                        onClick={() => navigate("/login")}
                        className="text-decoration-none"
                      >
                        Đăng nhập
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
