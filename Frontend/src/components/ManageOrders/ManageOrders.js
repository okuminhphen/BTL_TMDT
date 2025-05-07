import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Tabs,
  Tab,
  Modal,
  Form,
  Spinner,
  Row,
  Col,
  ListGroup,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersThunk,
  updateAdminOrderStatusThunk,
  deleteAdminOrderThunk,
} from "../../redux/slices/orderSlice";
import { toast } from "react-toastify";
import "./ManageOrders.scss";

const ManageOrders = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const dispatch = useDispatch();

  // State cho modal chi tiết đơn hàng
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // State cho modal sửa trạng thái
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // State cho modal xóa đơn hàng
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const { orders = [], status, error } = useSelector((state) => state.orders);
  const loading = status === "loading";

  // Hàm refresh dữ liệu
  const refreshData = () => {
    dispatch(fetchAllOrdersThunk());
  };

  useEffect(() => {
    refreshData(); // Lấy tất cả đơn hàng khi component được mount
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "warning", text: "Chờ xác nhận" },
      CONFIRMED: { variant: "info", text: "Đã xác nhận" },
      SHIPPING: { variant: "primary", text: "Đang giao" },
      COMPLETED: { variant: "success", text: "Đã giao" },
      CANCELLED: { variant: "danger", text: "Đã hủy" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      text: "Không xác định",
    };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "warning", text: "Chờ thanh toán" },
      PAID: { variant: "success", text: "Đã thanh toán" },
      FAILED: { variant: "danger", text: "Thất bại" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      text: "Không xác định",
    };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filterOrders = (status) => {
    if (status === "ALL") return orders;
    return orders.filter((order) => order.status === status);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Mở modal chi tiết
  const handleOpenDetailModal = (order) => {
    setSelectedOrderDetail(order);
    setShowDetailModal(true);
  };

  // Mở modal sửa trạng thái
  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowEditModal(true);
  };

  // Mở modal xóa đơn hàng
  const handleOpenDeleteModal = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await dispatch(
        updateAdminOrderStatusThunk({
          orderId: selectedOrder.id,
          updatedData: { status: newStatus },
        })
      ).unwrap();

      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      setShowEditModal(false);

      // Refresh dữ liệu sau khi cập nhật thành công
      refreshData();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại: " + error);
    }
  };

  // Xóa đơn hàng
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await dispatch(deleteAdminOrderThunk(orderToDelete.id)).unwrap();
      toast.success("Xóa đơn hàng thành công!");
      setShowDeleteModal(false);

      // Refresh dữ liệu sau khi xóa thành công
      refreshData();
    } catch (error) {
      toast.error("Xóa đơn hàng thất bại: " + error);
    }
  };

  return (
    <Container className="orders-page py-5">
      <h2 className="mb-4">Quản lý đơn hàng</h2>

      {error && <div className="text-danger">Lỗi: {error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button
            variant="outline-primary"
            onClick={refreshData}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Làm mới dữ liệu
          </Button>
        </div>
        <div className="text-muted">
          Tổng số đơn hàng: <strong>{orders.length}</strong>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {[
          "ALL",
          "PENDING",
          "CONFIRMED",
          "SHIPPING",
          "COMPLETED",
          "CANCELLED",
        ].map((status) => (
          <Tab key={status} eventKey={status} title={getStatusBadge(status)}>
            <OrdersTable
              orders={filterOrders(status)}
              loading={loading}
              getStatusBadge={getStatusBadge}
              formatPrice={formatPrice}
              formatDate={formatDate}
              onViewDetail={handleOpenDetailModal}
              onEditStatus={handleOpenEditModal}
              onDeleteOrder={handleOpenDeleteModal}
            />
          </Tab>
        ))}
      </Tabs>

      {/* Modal xem chi tiết đơn hàng */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Chi tiết đơn hàng #{selectedOrderDetail?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrderDetail && (
            <>
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">Thông tin khách hàng</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Tên khách hàng:</strong>{" "}
                        {selectedOrderDetail.customerName}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong>{" "}
                        {selectedOrderDetail.customerPhone}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedOrderDetail.customerEmail}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrderDetail.shippingAddress}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">Thông tin đơn hàng</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Mã đơn hàng:</strong> #{selectedOrderDetail.id}
                      </p>
                      <p>
                        <strong>Ngày đặt:</strong>{" "}
                        {formatDate(selectedOrderDetail.orderDate)}
                      </p>
                      <p>
                        <strong>Trạng thái đơn hàng:</strong>{" "}
                        {getStatusBadge(selectedOrderDetail.status)}
                      </p>
                      <p>
                        <strong>Trạng thái thanh toán:</strong>{" "}
                        {getPaymentStatusBadge(
                          selectedOrderDetail.payment?.status
                        )}
                      </p>
                      <p>
                        <strong>Phương thức thanh toán:</strong>{" "}
                        {selectedOrderDetail.payment?.paymentMethod
                          ?.description || "Không có thông tin"}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Sản phẩm</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {selectedOrderDetail.ordersDetails?.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6>{item.productName}</h6>
                          <p className="mb-0 text-muted">
                            Size: {item.size?.name || "N/A"} | Số lượng:{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="mb-0">
                            {formatPrice(item.priceAtOrder)}
                          </p>
                          <p className="mb-0 fw-bold">
                            {formatPrice(item.priceAtOrder * item.quantity)}
                          </p>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                    <h5>Tổng tiền:</h5>
                    <h5 className="text-primary">
                      {formatPrice(
                        selectedOrderDetail.payment?.amount ||
                          selectedOrderDetail.totalPrice
                      )}
                    </h5>
                  </div>
                </Card.Body>
              </Card>

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenEditModal(selectedOrderDetail);
                  }}
                >
                  Cập nhật trạng thái
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenDeleteModal(selectedOrderDetail);
                  }}
                >
                  Xóa đơn hàng
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal cập nhật trạng thái đơn hàng */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Mã đơn hàng</Form.Label>
                <Form.Control type="text" value={selectedOrder.id} disabled />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Khách hàng</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedOrder.customerName}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái hiện tại</Form.Label>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái mới</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="SHIPPING">Đang giao</option>
                  <option value="COMPLETED">Đã giao</option>
                  <option value="CANCELLED">Đã hủy</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateOrderStatus}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              "Cập nhật"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xóa đơn hàng */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderToDelete && (
            <div>
              <p>
                Bạn có chắc chắn muốn xóa đơn hàng <b>#{orderToDelete.id}</b>{" "}
                của khách hàng <b>{orderToDelete.customerName}</b> không?
              </p>
              <p>Hành động này không thể hoàn tác.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteOrder}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              "Xóa đơn hàng"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const OrdersTable = ({
  orders,
  loading,
  getStatusBadge,
  formatPrice,
  formatDate,
  onViewDetail,
  onEditStatus,
  onDeleteOrder,
}) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <div className="text-center py-4">Không có đơn hàng nào</div>;
  }

  return (
    <div className="table-responsive">
      <Table hover className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Địa chỉ</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="order-id">{order.id}</td>
              <td>
                {order.customerName}
                <br />
                {order.customerPhone}
              </td>
              <td>{order.shippingAddress}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td className="order-total">
                {formatPrice(order.payment?.amount || order.totalPrice)}
              </td>
              <td>{getStatusBadge(order.status)}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onViewDetail(order)}
                    title="Xem chi tiết"
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onEditStatus(order)}
                    title="Cập nhật trạng thái"
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeleteOrder(order)}
                    title="Xóa đơn hàng"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageOrders;
