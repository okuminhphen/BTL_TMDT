import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Card,
  Row,
  Col,
  InputGroup,
  Form,
  Badge,
} from "react-bootstrap";

import "./ManageUsers.scss";
import { fetchUsers } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const ManageUsers = () => {
  // State cho danh sách người dùng
  const { users, loading, error } = useSelector((state) => state);
  const dispatch = useDispatch();
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách người dùng khi component mount
  useEffect(() => {
    dispatch(fetchUsers());
    console.log("Fetched users", users);
  }, [dispatch]);
  // Lọc users theo từ khóa tìm kiếm
  const filteredUsers = (users || []).filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  return (
    <>
      {console.log("users", users)}
      <Container className="manage-users-container py-5">
        <Card>
          <Card.Header className="bg-primary text-white">
            <h3 className="mb-0">Quản lý người dùng</h3>
          </Card.Header>
          <Card.Body>
            {/* Thanh tìm kiếm */}
            <Row className="mb-3">
              <Col md={6}>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </InputGroup>
              </Col>
              <Col md={6} className="text-end">
                <Button
                  variant="outline-primary"
                  onClick={() => dispatch(fetchUsers())}
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Làm mới
                </Button>
              </Col>
            </Row>

            {error && <div className="text-danger mb-3">Lỗi: {error}</div>}

            {/* Bảng danh sách người dùng */}
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên người dùng</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.phone || "N/A"}</td>
                          <td>
                            <Badge
                              bg={
                                user.Group?.name === "Admin" ? "danger" : "info"
                              }
                            >
                              {user.Group?.name || "Người dùng"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          Không tìm thấy người dùng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ManageUsers;
