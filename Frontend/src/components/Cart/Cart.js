import { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { FaTrash, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import {
  fetchCart,
  updateCartItemQuantityAsync,
  removeCartItemAsync,
} from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, totalPrice, error } = useSelector((state) => state.cart);

  useEffect(() => {
    // Lấy giỏ hàng từ API khi component được render
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = (cartProductSizeId, quantity) => {
    dispatch(
      updateCartItemQuantityAsync({
        cartProductSizeId,
        quantity: parseInt(quantity),
      })
    );
  };

  const handleRemoveItem = (cartProductSizeId) => {
    dispatch(removeCartItemAsync(cartProductSizeId));
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">
          <FaShoppingCart className="me-2" /> Giỏ hàng của bạn
        </h2>
        <Badge bg="info" pill className="fs-6">
          {cartItems.length} sản phẩm
        </Badge>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {cartItems.length === 0 ? (
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <Card.Title className="mb-3">Giỏ hàng trống</Card.Title>
            <Card.Text>
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
            </Card.Text>
            <Button variant="primary" href="/products">
              Tiếp tục mua sắm
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="gy-4">
            {cartItems.map((item, index) => {
              const images = getProductImages(item.images);

              return (
                <Col xs={12} key={item.id || `cart-item-${index}`}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col
                          xs={12}
                          md={2}
                          className="text-center mb-3 mb-md-0"
                        >
                          <img
                            src={`http://localhost:8080${images[0]}`}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{
                              maxHeight: "120px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        </Col>

                        <Col xs={12} md={3} className="mb-3 mb-md-0">
                          <h5 className="fw-bold">{item.name}</h5>
                          <div className="text-muted">
                            <small>Mã sản phẩm: #{item.id}</small>
                            {item.size && <div>Size: {item.size}</div>}
                          </div>
                        </Col>

                        <Col xs={6} md={2} className="text-md-center">
                          <div className="text-muted small">Đơn giá</div>
                          <div className="fw-bold text-primary">
                            {formatPrice(item.price)}
                          </div>
                        </Col>

                        <Col xs={6} md={2} className="text-md-center">
                          <div className="text-muted small">Số lượng</div>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.cartProductSizeId,
                                e.target.value
                              )
                            }
                            style={{ maxWidth: "100px", margin: "0 auto" }}
                            className="border-primary"
                          />
                        </Col>

                        <Col
                          xs={6}
                          md={2}
                          className="mt-3 mt-md-0 text-md-center"
                        >
                          <div className="text-muted small">Thành tiền</div>
                          <div className="fw-bold fs-5 text-success">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </Col>

                        <Col xs={6} md={1} className="mt-3 mt-md-0 text-end">
                          <Button
                            variant="outline-danger"
                            onClick={() =>
                              handleRemoveItem(item.cartProductSizeId)
                            }
                            className="rounded-circle p-2"
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Card className="mt-4 shadow-sm border-0">
            <Card.Body>
              <Row className="align-items-center">
                <Col xs={12} md={6}>
                  <Button
                    variant="outline-secondary"
                    href="/products"
                    className="me-2"
                  >
                    Tiếp tục mua sắm
                  </Button>
                </Col>

                <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
                  <div className="d-flex flex-column align-items-end">
                    <div className="mb-2">
                      <span className="me-2">Tổng tiền:</span>
                      <span className="fs-4 fw-bold text-danger">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <Button
                      variant="success"
                      size="lg"
                      disabled={cartItems.length === 0}
                      className="px-4"
                    >
                      <FaCreditCard className="me-2" /> Thanh toán
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Cart;
