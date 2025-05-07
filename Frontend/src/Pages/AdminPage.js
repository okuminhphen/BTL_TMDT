import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import {
  FaHome,
  FaBoxes,
  FaUsers,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaDollarSign,
  FaBox,
  FaUserFriends,
  FaClipboardList,
} from "react-icons/fa";
import "./AdminPage.scss";

// Import các component quản lý
import Products from "../components/ManageProducts/Products";
import ManageUsers from "../components/ManageUsers/ManageUsers";

import ManageOrders from "../components/ManageOrders/ManageOrders";

const AdminPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

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
      <>
        {/* Stats */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <Card className="stat-card">
              <Card.Body className="d-flex">
                <div className="stat-icon me-3 bg-primary bg-opacity-10 text-primary">
                  <FaDollarSign />
                </div>
                <div>
                  <div className="stat-label">Doanh thu</div>
                  <h3 className="stat-value">₫15.5M</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card">
              <Card.Body className="d-flex">
                <div className="stat-icon me-3 bg-success bg-opacity-10 text-success">
                  <FaBox />
                </div>
                <div>
                  <div className="stat-label">Sản phẩm</div>
                  <h3 className="stat-value">124</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card">
              <Card.Body className="d-flex">
                <div className="stat-icon me-3 bg-warning bg-opacity-10 text-warning">
                  <FaClipboardList />
                </div>
                <div>
                  <div className="stat-label">Đơn hàng</div>
                  <h3 className="stat-value">87</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card">
              <Card.Body className="d-flex">
                <div className="stat-icon me-3 bg-info bg-opacity-10 text-info">
                  <FaUserFriends />
                </div>
                <div>
                  <div className="stat-label">Khách hàng</div>
                  <h3 className="stat-value">256</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Orders */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card>
              <Card.Header className="bg-white">
                <h5 className="mb-0">Đơn hàng gần đây</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-hover">
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
            <Card>
              <Card.Header className="bg-white">
                <h5 className="mb-0">Sản phẩm bán chạy</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Đã bán</th>
                        <th>Còn lại</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Bộ Pyjama Lụa Cao Cấp</td>
                        <td>Pyjama</td>
                        <td>₫650,000</td>
                        <td>42</td>
                        <td>18</td>
                      </tr>
                      <tr>
                        <td>Áo Ngủ Hai Dây Satin</td>
                        <td>Áo ngủ</td>
                        <td>₫320,000</td>
                        <td>38</td>
                        <td>25</td>
                      </tr>
                      <tr>
                        <td>Bộ Đồ Ngủ Cotton Mùa Hè</td>
                        <td>Pyjama</td>
                        <td>₫420,000</td>
                        <td>35</td>
                        <td>30</td>
                      </tr>
                      <tr>
                        <td>Váy Ngủ Lụa Phối Ren</td>
                        <td>Váy ngủ</td>
                        <td>₫550,000</td>
                        <td>29</td>
                        <td>12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isSidebarCollapsed && <h3>Admin Panel</h3>}
          <Button
            variant="link"
            className="sidebar-toggle"
            onClick={toggleSidebar}
          >
            <FaBars />
          </Button>
        </div>

        <Nav className="sidebar-nav flex-column">
          <Nav.Link
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome className="sidebar-icon" />
            {!isSidebarCollapsed && "Dashboard"}
          </Nav.Link>
          <Nav.Link
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            <FaBoxes className="sidebar-icon" />
            {!isSidebarCollapsed && "Sản phẩm"}
          </Nav.Link>
          <Nav.Link
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="sidebar-icon" />
            {!isSidebarCollapsed && "Người dùng"}
          </Nav.Link>
          <Nav.Link
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingCart className="sidebar-icon" />
            {!isSidebarCollapsed && "Đơn hàng"}
          </Nav.Link>
          <Nav.Link
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            <FaChartLine className="sidebar-icon" />
            {!isSidebarCollapsed && "Báo cáo"}
          </Nav.Link>
          <Nav.Link
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog className="sidebar-icon" />
            {!isSidebarCollapsed && "Cài đặt"}
          </Nav.Link>
        </Nav>

        <div className="sidebar-footer">
          <Button variant="outline-light">
            <FaSignOutAlt className="me-2" />
            {!isSidebarCollapsed && "Đăng xuất"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={`admin-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <div className="admin-header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
        </div>

        <div className="admin-body">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;
