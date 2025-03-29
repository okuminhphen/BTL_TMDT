import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import "./Nav.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { logoutUser } from "../../service/userService";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../redux/slices/cartSlice";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userId = JSON.parse(sessionStorage.getItem("user"))?.userId;

  useEffect(() => {
    // Lấy giỏ hàng khi component Navigation mount lần đầu
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);
  const handleLogout = async () => {
    try {
      let response = await logoutUser();
      console.log("check res", response);
      if (response.status === 200) {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleAdminClick = () => {
    navigate("/admin"); // Đường dẫn đến trang admin
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="border-bottom px-4 py-3">
        <Container>
          <Navbar.Brand className="fw-bold fs-3">
            HappyShop<span className="text-danger">.</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <NavLink to="/" className="nav-link">
                HOME
              </NavLink>
              <NavLink to="/products" className="nav-link">
                COLLECTION
              </NavLink>
              <NavLink to="/about" className="nav-link">
                ABOUT
              </NavLink>
              <NavLink to="/contact" className="nav-link">
                CONTACT
              </NavLink>

              <Button
                variant="outline-dark"
                className="rounded-pill ms-3"
                onClick={handleAdminClick} // Thêm sự kiện onClick
              >
                Admin Panel
              </Button>
            </Nav>
            <div className="ms-3 d-flex align-items-center">
              <NavLink to="#" className="nav-link text-dark mx-3">
                <i className="fa-solid fa-magnifying-glass"></i>{" "}
                {/* Thay vì fas fa-search */}
              </NavLink>
              <div className="user-dropdown">
                <NavLink
                  to="#"
                  className="nav-link text-dark mx-3"
                  onClick={toggleDropdown}
                >
                  <i className="fa-solid fa-user"></i>
                </NavLink>
                <div
                  className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                >
                  <NavLink to="/account" className="dropdown-item">
                    <i className="fa-solid fa-user-circle me-2"></i>
                    Tài khoản
                  </NavLink>
                  <NavLink
                    to={`/orders/user/${userId}`}
                    className="dropdown-item"
                  >
                    <i className="fa-solid fa-clipboard-list me-2"></i>
                    Đơn hàng
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <NavLink
                    to="/login"
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-sign-out-alt me-2"></i>
                    Đăng xuất
                  </NavLink>
                </div>
              </div>
              <NavLink
                to="/cart"
                className="nav-link text-dark position-relative mx-3"
              >
                <i className="fa-solid fa-bag-shopping"></i>{" "}
                {/* Thay vì fas fa-shopping-bag */}
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartItems.length}
                </Badge>
              </NavLink>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
