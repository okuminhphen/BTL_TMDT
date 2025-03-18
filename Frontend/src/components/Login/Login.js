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
      navigate("/"); // Chuyển hướng sau khi login
    } else {
      toast.error("Login failed!");
    }
  };
  const handlePressEnter = (e) => e.key === "Enter" && handleLogin();

  return (
    <div className="login-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card border-0 shadow-lg">
              <div className="row g-0">
                {/* Banner section */}
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
                      <div className="mb-5">
                        <FaShoppingBag className="display-1 mb-3" />
                        <h1 className="display-4 fw-bold mb-2">HappyShop</h1>
                        <p className="lead">
                          Giấc ngủ ngon - Hạnh phúc trọn vẹn
                        </p>
                      </div>

                      <div className="mb-5">
                        <p className="fs-5 fw-light mb-4">
                          Sản phẩm chúng tôi cam kết:
                        </p>
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-white bg-opacity-25 p-2 rounded-circle me-3">
                            <FaTshirt className="fs-4" />
                          </div>
                          <span>Chất liệu cao cấp</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-white bg-opacity-25 p-2 rounded-circle me-3">
                            <FaBed className="fs-4" />
                          </div>
                          <span>Thiết kế thoải mái</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bg-white bg-opacity-25 p-2 rounded-circle me-3">
                            <FaMoon className="fs-4" />
                          </div>
                          <span>Giấc ngủ trọn vẹn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login form section */}
                <div className="col-md-6">
                  <div className="card-body p-4 p-md-5">
                    <div className="text-center d-md-none mb-4">
                      <FaShoppingBag className="text-primary display-5 mb-2" />
                      <h2 className="fw-bold">HappyShop</h2>
                      <p className="text-muted">
                        Giấc ngủ ngon - Hạnh phúc trọn vẹn
                      </p>
                    </div>

                    <div className="d-flex align-items-center mb-4 pb-1">
                      <FaUserAlt className="text-primary fs-4 me-3" />
                      <span className="h2 fw-bold">Đăng nhập</span>
                    </div>

                    <p className="text-muted mb-4">
                      Đăng nhập để mua sắm đồ ngủ chất lượng cao
                    </p>

                    <div className="form-floating mb-4">
                      <input
                        type="text"
                        className={`form-control ${
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

                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        className={`form-control ${
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

                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Ghi nhớ đăng nhập
                      </label>
                    </div>

                    <div className="d-grid mb-4">
                      <button
                        className="btn btn-primary btn-lg py-3"
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

                    <div className="text-center mb-4">
                      <a href="#" className="text-decoration-none">
                        Quên mật khẩu?
                      </a>
                    </div>

                    <div className="divider d-flex align-items-center my-4">
                      <p className="text-center fw-bold mx-3 mb-0 text-muted">
                        HOẶC
                      </p>
                    </div>

                    <div className="d-grid">
                      <button
                        className="btn btn-outline-primary btn-lg py-3"
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
