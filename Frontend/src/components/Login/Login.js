import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserAlt,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaTshirt,
  FaBed,
  FaMoon,
  FaShoppingBag,
} from "react-icons/fa";
import { loginByUser, logout } from "../../redux/slices/userSlice";
import { fetchCart } from "../../redux/slices/cartSlice";

const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);
  const goToRegister = () => {
    navigate("/register");
  };

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const defaultValidInput = {
    isValidEmailOrPhone: true,
    isValidPassword: true,
  };

  const [objValidInput, setObjValidInput] = useState(defaultValidInput);

  const handleLogin = async () => {
    await dispatch(logout());
    setObjValidInput(defaultValidInput);
    if (!emailOrPhone) {
      toast.error("Please enter email or phone");
      setObjValidInput({ ...defaultValidInput, isValidEmailOrPhone: false });
      return;
    }
    if (!password) {
      toast.error("Please enter password");
      setObjValidInput({ ...defaultValidInput, isValidPassword: false });
      return;
    }

    let resultAction = await dispatch(loginByUser({ emailOrPhone, password }));

    // Kiểm tra nếu login thành công
    if (loginByUser.fulfilled.match(resultAction)) {
      toast.success("Login successful!");
      dispatch(fetchCart());
      navigate("/"); // Chuyển hướng sau khi login
    } else {
      toast.error("Login failed!");
    }
  };
  const handlePressEnter = (e) => e.key === "Enter" && handleLogin();

  return (
    <div className="login-container py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="card border-0 shadow">
              <div className="row g-0">
                {/* Banner section - smaller width */}
                <div className="col-md-5 d-none d-md-block">
                  <div
                    className="h-100 text-white d-flex flex-column justify-content-center p-4 rounded-start"
                    style={{
                      background:
                        "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.15,
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1595461135849-c08a9a4967b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1868&q=80')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <div className="position-relative">
                      <div className="mb-4">
                        <FaShoppingBag className="fs-1 mb-2" />
                        <h2 className="fw-bold mb-1">HappyShop</h2>
                        <p className="small mb-3">
                          Giấc ngủ ngon - Hạnh phúc trọn vẹn
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="fs-6 fw-light mb-2">
                          Sản phẩm chúng tôi cam kết:
                        </p>
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-white bg-opacity-25 p-1 rounded-circle me-2">
                            <FaTshirt className="fs-6" />
                          </div>
                          <span className="small">Chất liệu cao cấp</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-white bg-opacity-25 p-1 rounded-circle me-2">
                            <FaBed className="fs-6" />
                          </div>
                          <span className="small">Thiết kế thoải mái</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bg-white bg-opacity-25 p-1 rounded-circle me-2">
                            <FaMoon className="fs-6" />
                          </div>
                          <span className="small">Giấc ngủ trọn vẹn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login form section - increased width */}
                <div className="col-md-7">
                  <div className="card-body p-3 p-md-4">
                    <div className="text-center d-md-none mb-3">
                      <FaShoppingBag className="text-primary fs-1 mb-2" />
                      <h3 className="fw-bold">HappyShop</h3>
                      <p className="text-muted small">
                        Giấc ngủ ngon - Hạnh phúc trọn vẹn
                      </p>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <FaUserAlt className="text-primary me-2" />
                      <span className="h4 fw-bold mb-0">Đăng nhập</span>
                    </div>

                    <p className="text-muted small mb-3">
                      Đăng nhập để mua sắm đồ ngủ chất lượng cao
                    </p>

                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className={`form-control form-control-sm ${
                          !objValidInput.isValidEmailOrPhone ? "is-invalid" : ""
                        }`}
                        id="floatingEmail"
                        placeholder="Email or Phone"
                        value={emailOrPhone}
                        onChange={(event) =>
                          setEmailOrPhone(event.target.value)
                        }
                      />
                      <label htmlFor="floatingEmail">
                        <FaUserAlt className="me-2" />
                        Email hoặc Số điện thoại
                      </label>
                      {!objValidInput.isValidEmailOrPhone && (
                        <div className="invalid-feedback">
                          Vui lòng nhập email hoặc số điện thoại
                        </div>
                      )}
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className={`form-control form-control-sm ${
                          !objValidInput.isValidPassword ? "is-invalid" : ""
                        }`}
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyDown={(event) => handlePressEnter(event)}
                      />
                      <label htmlFor="floatingPassword">
                        <FaLock className="me-2" />
                        Mật khẩu
                      </label>
                      {!objValidInput.isValidPassword && (
                        <div className="invalid-feedback">
                          Vui lòng nhập mật khẩu
                        </div>
                      )}
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="rememberMe"
                      >
                        Ghi nhớ đăng nhập
                      </label>
                    </div>

                    <div className="d-grid mb-3">
                      <button
                        className="btn btn-primary py-2"
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                          background:
                            "linear-gradient(to right, #8A2387, #E94057, #F27121)",
                          border: "none",
                        }}
                      >
                        <FaSignInAlt className="me-2" />
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </button>
                    </div>

                    <div className="text-center mb-3">
                      <a href="#" className="text-decoration-none small">
                        Quên mật khẩu?
                      </a>
                    </div>

                    <div className="divider d-flex align-items-center my-3">
                      <p className="text-center fw-bold mx-3 mb-0 text-muted small">
                        HOẶC
                      </p>
                    </div>

                    <div className="d-grid">
                      <button
                        className="btn btn-outline-primary py-2"
                        onClick={() => goToRegister()}
                      >
                        <FaUserPlus className="me-2" />
                        Tạo tài khoản mới
                      </button>
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

export default Login;
