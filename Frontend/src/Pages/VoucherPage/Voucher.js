import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Card,
} from "react-bootstrap";
import axios from "axios";
import "./Voucher.scss";
import {
  createVoucher,
  deleteVoucher,
  getAllVouchers,
  updateVoucher,
} from "../../service/voucherService";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: "",
    min_order_value: "",
    quantity: "",
    expires_at: "",
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await getAllVouchers();
      if (+response.data.EC === 0) {
        setVouchers(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleShowAdd = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percent",
      discount_value: "",
      min_order_value: "",
      quantity: "",
      expires_at: "",
    });
    setShowAddModal(true);
  };

  const handleShowEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setFormData({
      ...voucher,
      expires_at: new Date(voucher.expires_at).toISOString().slice(0, 16),
    });
    setShowEditModal(true);
  };

  const handleShowDelete = (voucher) => {
    setSelectedVoucher(voucher);
    setShowDeleteModal(true);
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setFormData({
      code: "",
      description: "",
      discount_type: "percent",
      discount_value: "",
      min_order_value: "",
      quantity: "",
      expires_at: "",
    });
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedVoucher(null);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedVoucher(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedVoucher) {
        await updateVoucher(selectedVoucher.id, selectedVoucher);
        handleCloseEdit();
      } else {
        await createVoucher(formData);
        handleCloseAdd();
      }
      fetchVouchers();
    } catch (error) {
      console.error("Error saving voucher:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVoucher(selectedVoucher.id);
      handleCloseDelete();
      fetchVouchers();
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  return (
    <>
      <Container fluid className="voucher-page">
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Quản lý Voucher</h4>
            <Button variant="primary" onClick={handleShowAdd}>
              Thêm Voucher Mới
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Mô tả</th>
                    <th>Loại giảm giá</th>
                    <th>Giá trị giảm</th>
                    <th>Giá trị đơn hàng tối thiểu</th>
                    <th>Số lượng</th>
                    <th>Ngày hết hạn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => (
                    <tr key={voucher.id}>
                      <td>{voucher.code}</td>
                      <td>{voucher.description}</td>
                      <td>
                        {voucher.discount_type === "percent"
                          ? "Phần trăm"
                          : "Số tiền cố định"}
                      </td>
                      <td>{voucher.discount_value}</td>
                      <td>{voucher.min_order_value}</td>
                      <td>{voucher.quantity}</td>
                      <td>
                        {new Date(voucher.expires_at).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowEdit(voucher)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleShowDelete(voucher)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Modal Thêm mới */}
        <Modal show={showAddModal} onHide={handleCloseAdd} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Thêm Voucher Mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mã voucher</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Loại giảm giá</Form.Label>
                    <Form.Select
                      value={formData.discount_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_type: e.target.value,
                        })
                      }
                    >
                      <option value="percent">Phần trăm</option>
                      <option value="fixed">Số tiền cố định</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá trị giảm giá</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_value: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá trị đơn hàng tối thiểu</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.min_order_value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_order_value: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày hết hạn</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) =>
                        setFormData({ ...formData, expires_at: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAdd}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Tạo mới
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Chỉnh sửa */}
        <Modal show={showEditModal} onHide={handleCloseEdit} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa Voucher</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mã voucher</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Loại giảm giá</Form.Label>
                    <Form.Select
                      value={formData.discount_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_type: e.target.value,
                        })
                      }
                    >
                      <option value="percent">Phần trăm</option>
                      <option value="fixed">Số tiền cố định</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá trị giảm giá</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_value: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá trị đơn hàng tối thiểu</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.min_order_value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_order_value: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày hết hạn</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) =>
                        setFormData({ ...formData, expires_at: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Xóa */}
        <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Bạn có chắc chắn muốn xóa voucher{" "}
              <strong>{selectedVoucher?.code}</strong> này không?
            </p>
            <p className="text-danger mb-0">
              Lưu ý: Hành động này không thể hoàn tác.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Voucher;
