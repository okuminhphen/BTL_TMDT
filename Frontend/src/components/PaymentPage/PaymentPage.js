import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Badge,
  Modal,
  Image,
} from "react-bootstrap";
import "./PaymentPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { createOrderThunk, addOrderTemp } from "../../redux/slices/orderSlice";
import { creatPayment, getPaymentMethods } from "../../service/paymentService";
import { toast } from "react-toastify";
import { getAllVouchers } from "../../service/voucherService";
import { io } from "socket.io-client";
const PaymentPage = () => {
  const defaultCustomerInfo = {
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
    paymentMethod: "cod",
  };
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { cartItems } = useSelector((state) => state.cart);
  const [customerInfo, setCustomerInfo] = useState(defaultCustomerInfo);
  const dispatch = useDispatch();
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const [vouchers, setVouchers] = useState([]);
  const [currentVoucher, setCurrentVoucher] = useState({});
  const [discount, setDiscount] = useState(0);
  const shippingFee = 30000;
  const subtotal = calculateSubtotal();
  const total = subtotal + shippingFee - discount;

  // Thêm state cho modal
  const [showQRModal, setShowQRModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  useEffect(() => {
    // ✅ Nếu chạy local
    // const socket = io("http://localhost:8080");

    // ✅ Nếu chạy qua ngrok (đã dùng ngrok http 8080)
    const socket = io("https://6a19-14-232-39-85.ngrok-free.app", {
      transports: ["websocket"], // Bắt buộc với socket.io nếu bạn dùng ngrok
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket server (socket.io)", socket.id);
    });

    socket.on("payment-success", (data) => {
      // Lưu ý: sự kiện này phải giống sự kiện emit bên backend (vd: io.emit("paymentStatus", { ... }))
      console.log("🟢 Payment success:", data);
      if (data === "success") {
        setPaymentStatus("success");
        setShowQRModal(false);
        toast.success("Thanh toán thành công!");

        setTimeout(() => {
          window.location.href = `/orders/user/${
            JSON.parse(sessionStorage.getItem("user")).userId
          }`;
        }, 2000);
      } else if (data.status === "failed") {
        setPaymentStatus("failed");
        setShowQRModal(false);
        toast.error("Thanh toán thất bại, vui lòng thử lại!");
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.IO connection error:", err);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);
  useEffect(() => {
    fetchPaymentMethods();
    fetchAllVouchers();
  }, []);

  const fetchPaymentMethods = async () => {
    let response = await getPaymentMethods();
    if (response.data.EC === "0") {
      setPaymentMethods(response.data.DT);
    }
  };

  const fetchAllVouchers = async () => {
    let response = await getAllVouchers();
    if (response.data.EC === "0") {
      setVouchers(response.data.DT);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setCustomerInfo({
      ...customerInfo,
      paymentMethod: e.target.value,
    });
  };

  const handleVoucherChange = (e) => {
    const selectedCode = e.target.value;
    const selectedVoucher = vouchers.find((v) => v.code === selectedCode);
    const discountType = selectedVoucher.discount_type;
    const discountValue = selectedVoucher.discount_value;
    if (discountType === "percent") {
      setDiscount((subtotal * discountValue) / 100);
    } else if (discountType === "fixed") {
      setDiscount(parseInt(discountValue));
    }

    setCurrentVoucher(selectedVoucher || {});
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    let paymentMethodId = paymentMethods.find(
      (method) => method.name === paymentMethod
    ).id;

    let orderData = {
      userId: JSON.parse(sessionStorage.getItem("user")).userId,
      cartItems: cartItems,
      customerInfo: customerInfo,
      totalPrice: subtotal,
      paymentMethodId: paymentMethodId,
    };

    const result = await dispatch(createOrderThunk(orderData)).unwrap();

    if (!result) {
      alert("Lỗi khi tạo đơn hàng!");
      return;
    }

    let createdOrderId = result.DT;
    setOrderId(createdOrderId);

    // ✅ Lưu tạm vào Redux
    dispatch(addOrderTemp(result));

    if (paymentMethod === "VNPAY") {
      let paymentData = {
        orderId: createdOrderId, // ✅ Gửi orderId để theo dõi đơn hàng
        amount: total, // ✅ Gửi tổng tiền thanh toán
        bankCode: "", // Nếu có
        orderDescription: `Thanh toán đơn hàng #${createdOrderId}`,
        orderType: "billpayment",
        language: "vn",
      };
      try {
        const response = await creatPayment(paymentData);

        const vnpayData = response.data.vnpUrl;

        if (vnpayData) {
          window.location.href = vnpayData; // Chuyển hướng sang trang thanh toán VNPAY
        }
      } catch (error) {
        console.error("Lỗi khi tạo URL thanh toán:", error);
      }
    } else if (paymentMethod === "VIETTIN") {
      // Hiển thị modal QR code thay vì redirect
      setShowQRModal(true);
    } else {
      toast.success("Đơn hàng đã được đặt thành công!");

      // ✅ Xóa giỏ hàng Redux

      // ✅ Chuyển hướng người dùng sau vài giây
      setTimeout(() => {
        window.location.href = `/orders/user/${
          JSON.parse(sessionStorage.getItem("user")).userId
        }`; // Chuyển hướng về trang Đơn hàng
      }, 2000);
    }
  };

  const getProductImages = (images) => {
    if (!images) return [];

    if (Array.isArray(images)) {
      return images;
    }

    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
      return [];
    }
  };

  // Tạo URL QR code với thông tin thanh toán
  const generateQRUrl = () => {
    const accountNumber = "106882709225";
    const bank = "vietinbank";
    const amount = total;
    const addInfo = `Thanh toan don hang #${orderId}`;
    const accountName = "HappyShop";

    return `https://img.vietqr.io/image/${bank}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(
      addInfo
    )}&accountName=${encodeURIComponent(accountName)}`;
  };

  return (
    <>
      <Container className="payment-page py-5">
        <h2 className="text-center mb-4">Thanh Toán</h2>

        <Row>
          {/* Cột bên trái - Thông tin sản phẩm */}
          <Col lg={5} md={12}>
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Đơn hàng của bạn</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {cartItems.map((item) => {
                  const image = getProductImages(item.images)[0];

                  return (
                    <ListGroup.Item
                      key={item.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={`http://localhost:8080${image}`}
                          alt={item.name}
                          className="product-thumbnail me-3"
                        />
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">
                            {item.quantity} x{" "}
                            {item.price.toLocaleString("vi-VN")}₫
                          </small>
                        </div>
                      </div>
                      <span className="fw-bold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </span>
                    </ListGroup.Item>
                  );
                })}
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
                </ListGroup.Item>
                {currentVoucher.id && (
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Giảm giá:</span>
                    <span>{discount.toLocaleString("vi-VN")}₫</span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="d-flex justify-content-between fw-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    {total.toLocaleString("vi-VN")}₫
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          {/* Cột bên phải - Form thông tin và phương thức thanh toán */}
          <Col lg={7} md={12}>
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Thông tin giao hàng</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handlePayment}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Họ và tên <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          placeholder="Nhập họ và tên"
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              name: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Số điện thoại <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          required
                          placeholder="Nhập số điện thoại"
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              phone: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      required
                      placeholder="Nhập địa chỉ email"
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Địa chỉ <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Nhập địa chỉ nhận hàng"
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Nhập ghi chú nếu cần"
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          message: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Card className="mt-4 mb-4">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">Mã giảm giá</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group controlId="paymentMethodSelect">
                        <Form.Label>Chọn mã giảm giá</Form.Label>
                        <Form.Select
                          value={currentVoucher?.code || ""}
                          onChange={(e) => handleVoucherChange(e)}
                        >
                          <option value="">-- Chọn mã giảm giá --</option>
                          {vouchers.map((voucher) => (
                            <option key={voucher.id} value={voucher.code}>
                              {voucher.code}
                            </option>
                          ))}
                        </Form.Select>
                        <p>{currentVoucher?.description}</p>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                  <Card className="mt-4 mb-4">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">Phương thức thanh toán</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group>
                        <div className="payment-methods">
                          {paymentMethods.map((method) => (
                            <div
                              className="form-check payment-method-item"
                              key={method.id}
                            >
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id={method.id}
                                value={method.name}
                                checked={paymentMethod === method.name}
                                onChange={handlePaymentMethodChange}
                              />
                              <label
                                className="form-check-label d-flex align-items-center"
                                htmlFor={method.id}
                              >
                                <span className="payment-icon me-2">
                                  <i className="fas fa-money-bill-wave"></i>{" "}
                                  {/* Thay icon phù hợp */}
                                </span>
                                <span>{method.description}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </Form.Group>
                    </Card.Body>
                  </Card>

                  <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" type="submit">
                      Đặt hàng
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal QR code thanh toán VietinBank */}
      <Modal
        show={showQRModal}
        onHide={() => setShowQRModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thanh toán qua VietinBank</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5>Quét mã QR để thanh toán</h5>
          <p>
            Số tiền: <strong>{total.toLocaleString("vi-VN")}₫</strong>
          </p>
          <div className="qr-container my-4">
            <Image
              src={generateQRUrl()}
              alt="QR Code thanh toán"
              fluid
              className="qr-image"
              style={{ maxWidth: "350px" }}
            />
          </div>
          <p className="text-muted">
            Vui lòng sử dụng ứng dụng VietinBank iPay Mobile để quét mã QR và
            hoàn tất thanh toán.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentPage;
