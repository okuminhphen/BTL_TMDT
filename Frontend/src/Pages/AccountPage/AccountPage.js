import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserById } from "../../service/userService";
import {
  updateUserThunk,
  updatePasswordThunk,
} from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
const AccountPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const defaultValidPassword = {
    isValidCurrentPassword: true,
    isValidNewPassword: true,
    isValidConfirmPassword: true,
  };
  const [validPassword, setValidPassword] = useState(defaultValidPassword);
  const [userInfo, setUserInfo] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  const fetchUserInfo = async () => {
    const response = await getUserById(userId);
    const data = response.data.DT;

    setUserInfo({
      username: data.username || "",
      fullname: data.fullname || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    const updatedData = {
      fullname: userInfo.fullname,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
    };
    dispatch(updateUserThunk({ userId: Number(userId), updatedData }));
    toast.success("Thông tin cá nhân đã được cập nhật thành công!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (userInfo.currentPassword === "") {
      setValidPassword((prev) => ({
        ...prev,
        isValidCurrentPassword: false,
      }));
      toast.error("Mật khẩu hiện tại không được để trống!");
      return;
    }
    if (userInfo.newPassword === "") {
      setValidPassword((prev) => ({
        ...prev,
        isValidNewPassword: false,
      }));
      toast.error("Mật khẩu mới không được để trống!");
      return;
    }
    if (userInfo.confirmPassword === "") {
      setValidPassword((prev) => ({
        ...prev,
        isValidConfirmPassword: false,
      }));
      toast.error("Mật khẩu xác nhận không được để trống!");
      return;
    }

    // TODO: Implement API call to update password
    const updatedPassword = {
      currentPassword: userInfo.currentPassword,
      newPassword: userInfo.newPassword,
      confirmPassword: userInfo.confirmPassword,
    };
    if (updatedPassword.currentPassword === updatedPassword.newPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại!");
      return;
    } else if (
      updatedPassword.newPassword !== updatedPassword.confirmPassword
    ) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    dispatch(updatePasswordThunk({ userId: Number(userId), updatedPassword }));
    setValidPassword(defaultValidPassword);
  };

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-4">Thông tin tài khoản</h2>

        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Thông tin cá nhân</h5>
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={userInfo.username}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      name="fullname"
                      value={userInfo.fullname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      SĐT
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Địa chỉ
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="2"
                      value={userInfo.address}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Cập nhật thông tin
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Đổi mật khẩu</h5>
                <form onSubmit={handleUpdatePassword}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        !validPassword.isValidCurrentPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      id="currentPassword"
                      name="currentPassword"
                      value={userInfo.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        !validPassword.isValidNewPassword ? "is-invalid" : ""
                      }`}
                      id="newPassword"
                      name="newPassword"
                      value={userInfo.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        !validPassword.isValidConfirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={userInfo.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Đổi mật khẩu
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
