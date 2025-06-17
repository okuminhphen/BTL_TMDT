import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLayout = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  // Nếu người dùng không đăng nhập hoặc không phải admin, chuyển hướng về trang login
  //   if (!currentUser || currentUser.role !== "ADMIN") {
  //     return <Navigate to="/login" />;
  //   }

  return <>{children}</>;
};

export default AdminLayout;
