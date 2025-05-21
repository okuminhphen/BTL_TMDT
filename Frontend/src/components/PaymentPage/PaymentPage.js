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
} from "react-bootstrap";
import "./PaymentPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { createOrderThunk, addOrderTemp } from "../../redux/slices/orderSlice";
import { creatPayment, getPaymentMethods } from "../../service/paymentService";
import { toast } from "react-toastify";
import { getAllVouchers } from "../../service/voucherService";
const PaymentPage = () => {
  const defaultCustomerInfo = {
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
    paymentMethod: "cod",
  };

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
    }
    let createdOrderId = result.DT;
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

    // Xử lý gửi đơn hàng tới server
  };

  const getProductImages = (images) => {
    if (!images) return [];
    let parsedImages = [];

    try {
      parsedImages = JSON.parse(images);
      if (typeof parsedImages === "string") {
        parsedImages = JSON.parse(parsedImages);
      }
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
      return [];
    }

    return Array.isArray(parsedImages) ? parsedImages : [];
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
      );
    </>
  );
};

export default PaymentPage;
