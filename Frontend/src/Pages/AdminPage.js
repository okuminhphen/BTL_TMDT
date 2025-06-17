import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxes,
  FaUsers,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaDollarSign,
  FaBox,
  FaUserFriends,
  FaClipboardList,
  FaImages,
  FaTicketAlt,
} from "react-icons/fa";
import "./AdminPage.scss";

// Import các component quản lý
import Products from "../components/ManageProducts/Products";
import ManageUsers from "../components/ManageUsers/ManageUsers";
import ManageOrders from "../components/ManageOrders/ManageOrders";
import ManageBanners from "../components/ManageBanners/ManageBanners";
import Voucher from "./VoucherPage/Voucher";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Hàm render nội dung theo tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return <Products />;
      case "users":
        return <ManageUsers />;
      case "orders":
        return <ManageOrders />;
      case "banners":
        return <ManageBanners />;
      case "vouchers":
        return <Voucher />;
      default:
        return (
          <div className="text-center py-5">
            <h4>Chức năng {activeTab} đang được phát triển</h4>
            <p className="text-muted">
              Chức năng này sẽ được cập nhật trong thời gian tới.
            </p>
          </div>
        );
    }
  };

  // Hàm render Dashboard
  const renderDashboard = () => {
    return (
      <div className="dashboard-content">
        <h2 className="page-title mb-4">Tổng quan</h2>

        {/* Stats */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <Card className="stat-card h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-primary">
                    <FaDollarSign />
                  </div>
                  <div className="ms-3">
                    <h6 className="stat-label">Doanh thu</h6>
                    <h3 className="stat-value mb-0">₫15.5M</h3>
                    <small className="text-success">
                      <i className="fas fa-arrow-up"></i> 12% so với tháng trước
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-success">
                    <FaBox />
                  </div>
                  <div className="ms-3">
                    <h6 className="stat-label">Sản phẩm</h6>
                    <h3 className="stat-value mb-0">124</h3>
                    <small className="text-success">
                      <i className="fas fa-arrow-up"></i> 8% so với tháng trước
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-warning">
                    <FaClipboardList />
                  </div>
                  <div className="ms-3">
                    <h6 className="stat-label">Đơn hàng</h6>
                    <h3 className="stat-value mb-0">87</h3>
                    <small className="text-danger">
                      <i className="fas fa-arrow-down"></i> 3% so với tháng
                      trước
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-info">
                    <FaUserFriends />
                  </div>
                  <div className="ms-3">
                    <h6 className="stat-label">Khách hàng</h6>
                    <h3 className="stat-value mb-0">256</h3>
                    <small className="text-success">
                      <i className="fas fa-arrow-up"></i> 15% so với tháng trước
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Orders */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Đơn hàng gần đây</h5>
                <Button variant="outline-primary" size="sm">
                  Xem tất cả
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Ngày</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#ORD-001</td>
                        <td>Nguyễn Văn A</td>
                        <td>Bộ Pyjama 01</td>
                        <td>12/05/2023</td>
                        <td>₫450,000</td>
                        <td>
                          <span className="badge bg-success">Hoàn thành</span>
                        </td>
                      </tr>
                      <tr>
                        <td>#ORD-002</td>
                        <td>Trần Thị B</td>
                        <td>Áo ngủ 03</td>
                        <td>11/05/2023</td>
                        <td>₫350,000</td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            Đang giao
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>#ORD-003</td>
                        <td>Lê Văn C</td>
                        <td>Bộ Pyjama 02, Áo ngủ 01</td>
                        <td>10/05/2023</td>
                        <td>₫650,000</td>
                        <td>
                          <span className="badge bg-primary">Đã xác nhận</span>
                        </td>
                      </tr>
                      <tr>
                        <td>#ORD-004</td>
                        <td>Phạm Thị D</td>
                        <td>Bộ đồ ngủ cao cấp 01</td>
                        <td>10/05/2023</td>
                        <td>₫850,000</td>
                        <td>
                          <span className="badge bg-danger">Đã hủy</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Top Products */}
        <Row>
          <Col lg={12}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Sản phẩm bán chạy</h5>
                <Button variant="outline-primary" size="sm">
                  Xem tất cả
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Đã bán</th>
                        <th>Còn lại</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src="https://via.placeholder.com/40"
                              alt="Product"
                              className="rounded me-2"
                              width="40"
                            />
                            <div>Bộ Pyjama Lụa Cao Cấp</div>
                          </div>
                        </td>
                        <td>Pyjama</td>
                        <td>₫650,000</td>
                        <td>42</td>
                        <td>18</td>
                        <td>
                          <span className="badge bg-success">Còn hàng</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src="https://via.placeholder.com/40"
                              alt="Product"
                              className="rounded me-2"
                              width="40"
                            />
                            <div>Áo Ngủ Hai Dây Satin</div>
                          </div>
                        </td>
                        <td>Áo ngủ</td>
                        <td>₫320,000</td>
                        <td>38</td>
                        <td>25</td>
                        <td>
                          <span className="badge bg-success">Còn hàng</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src="https://via.placeholder.com/40"
                              alt="Product"
                              className="rounded me-2"
                              width="40"
                            />
                            <div>Bộ Đồ Ngủ Cotton Mùa Hè</div>
                          </div>
                        </td>
                        <td>Pyjama</td>
                        <td>₫420,000</td>
                        <td>35</td>
                        <td>30</td>
                        <td>
                          <span className="badge bg-success">Còn hàng</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src="https://via.placeholder.com/40"
                              alt="Product"
                              className="rounded me-2"
                              width="40"
                            />
                            <div>Váy Ngủ Lụa Phối Ren</div>
                          </div>
                        </td>
                        <td>Váy ngủ</td>
                        <td>₫550,000</td>
                        <td>29</td>
                        <td>12</td>
                        <td>
                          <span className="badge bg-warning">Sắp hết</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container fluid className="admin-page">
      <Row>
        {/* Sidebar */}
        <Col
          md={3}
          lg={2}
          className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="sidebar-header">
            <h3>Admin Panel</h3>
            <div className="d-flex">
              <Button
                variant="link"
                className="toggle-btn me-2"
                onClick={handleHome}
              >
                <FaHome />
              </Button>
              <Button
                variant="link"
                className="toggle-btn"
                onClick={toggleSidebar}
              >
                <FaBars />
              </Button>
            </div>
          </div>
          <Nav className="flex-column">
            <Nav.Link
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaHome /> {!isSidebarCollapsed && "Dashboard"}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "products" ? "active" : ""}
              onClick={() => setActiveTab("products")}
            >
              <FaBoxes /> {!isSidebarCollapsed && "Sản phẩm"}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              <FaUsers /> {!isSidebarCollapsed && "Người dùng"}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              <FaShoppingCart /> {!isSidebarCollapsed && "Đơn hàng"}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "banners" ? "active" : ""}
              onClick={() => setActiveTab("banners")}
            >
              <FaImages /> {!isSidebarCollapsed && "Banner"}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "vouchers" ? "active" : ""}
              onClick={() => setActiveTab("vouchers")}
            >
              <FaTicketAlt /> {!isSidebarCollapsed && "Voucher"}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "settings" ? "active" : ""}
              onClick={() => setActiveTab("settings")}
            >
              <FaCog /> {!isSidebarCollapsed && "Cài đặt"}
            </Nav.Link>
            <Nav.Link className="logout" onClick={handleLogout}>
              <FaSignOutAlt /> {!isSidebarCollapsed && "Đăng xuất"}
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="main-content">
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
