import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  ButtonGroup,
  ToggleButton,
  InputGroup,
  Card,
  ListGroup,
  Badge,
  Accordion,
} from "react-bootstrap";
import { getProductById, fetchSizes } from "../../service/productService";
import { addReview, getReviewsByProductId } from "../../service/reviewService";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaPlus, FaMinus } from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
const ProductDetail = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.currentUser?.userId);
  const user = useSelector((state) => state.user.currentUser);
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState({
    description: [], // Initialize with empty array
  });
  const [quantity, setQuantity] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [selectedSizeId, setSelectedSizeId] = useState(null); // Size được chọn
  const [selectedStock, setSelectedStock] = useState(null);
  const [productSize, setProductSize] = useState(null);
  const [mainImage, setMainImage] = useState(null); // Ảnh chính
  const navigate = useNavigate();

  // Các state cho đánh giá và bình luận
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProductDetails(id);
    getSizes();
    getReviews();
  }, [id]);

  const getProductDetails = async (idProduct) => {
    try {
      let response = await getProductById(id);
      if (response && response.data.EC === 0) {
        let productData = response.data.DT;
        // Parse description từ JSON string
        try {
          if (productData.description) {
            const parsedDescription = JSON.parse(productData.description);
            productData.description = Array.isArray(parsedDescription)
              ? parsedDescription
              : [];
          } else {
            productData.description = [];
          }
        } catch (error) {
          console.error("Error parsing description:", error);
          productData.description = [];
        }
        setProduct(productData);
        setProductSize(productData.sizes);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getSizes = async () => {
    try {
      let response = await fetchSizes();
      if (response && response.data.EC === 0) {
        setSizes(response.data.DT);
      }
    } catch (e) {}
  };
  const getReviews = async () => {
    try {
      let response = await getReviewsByProductId(id);

      if (response && response.data.EC === 0) {
        setReviews(response.data.DT);
      }
    } catch (e) {
      console.log(e);
    }
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

  const handleQuantityChange = (change) => {
    if (change < 0 && quantity === 1) {
      return; // Không cho phép giảm dưới 1
    }

    const newQuantity = quantity + change;
    if (selectedStock !== null && newQuantity > selectedStock) {
      toast.warning(`Bạn chỉ có thể mua tối đa ${selectedStock} sản phẩm`);
      return;
    }

    setQuantity(newQuantity);
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value < 1) {
      setQuantity(1);
    } else if (selectedStock !== null && value > selectedStock) {
      setQuantity(selectedStock);
      toast.warning(`Bạn chỉ có thể mua tối đa ${selectedStock} sản phẩm`);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login"); // Chuyển hướng về trang đăng nhập
      return;
    }
    if (!selectedSizeId) {
      toast.warning("Vui lòng chọn size!");
      return;
    }

    const cartItem = {
      id: product.id,
      userId: userId,
      sizeId: selectedSizeId,
      quantity: quantity,
    };

    toast.success("Thêm sản phẩm thành công");
    dispatch(addToCartAsync(cartItem));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.warning("Bạn cần đăng nhập để đánh giá sản phẩm!");
      navigate("/login");
      return;
    }

    if (rating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }

    const newReview = {
      userId: userId, // Có thể lấy tên người dùng từ state nếu có
      productId: product.id,
      rating: rating,
      comment: comment,
      date: new Date().toISOString().split("T")[0],
    };

    let response = await addReview(newReview);

    if (response && response.data && +response.data.EC === 0) {
      await getReviews();
    }

    setRating(0);
    setComment("");
    toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
  };

  const renderStarRating = (value) => {
    return [...Array(5)].map((star, index) => {
      const ratingValue = index + 1;
      return (
        <span
          key={index}
          style={{
            color: ratingValue <= value ? "#ffc107" : "#e4e5e9",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          {ratingValue <= value ? <FaStar /> : <FaRegStar />}
        </span>
      );
    });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          {/* Cột 1: Ảnh nhỏ (danh sách ảnh) */}
          <Col md={1} className="d-flex flex-column align-items-center">
            {getProductImages(product.images).map((img, index) => (
              <Image
                key={index}
                src={`http://localhost:8080${img}`}
                alt={`Ảnh ${index + 1}`}
                fluid
                className={`mb-2 rounded border ${
                  mainImage === img ? "border-dark" : "border-light"
                }`}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  cursor: "pointer",
                  padding: "4px",
                  transition: "all 0.3s ease",
                  transform: mainImage === img ? "scale(1.1)" : "scale(1)",
                  boxShadow:
                    mainImage === img ? "0 0 10px rgba(0,0,0,0.2)" : "none",
                }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </Col>
          {/* Cột 1: Ảnh sản phẩm */}
          <Col md={4} className="text-center mx-1">
            <Image
              src={`http://localhost:8080${
                mainImage || getProductImages(product.images)[0]
              }`}
              alt={product.title}
              fluid
              className="shadow-lg rounded"
              style={{
                maxHeight: "500px",
                transition: "all 0.3s ease",
                objectFit: "contain",
              }}
            />
          </Col>

          {/* Cột 2: Thông tin sản phẩm */}
          <Col md={6} className="mx-5">
            <div className="mb-4">
              <h2 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>
                {product.name}
              </h2>
              <div className="d-flex align-items-center mb-4">
                <h4
                  className="text-danger mb-0 me-3"
                  style={{ fontSize: "2rem" }}
                >
                  {product.price ? product.price.toLocaleString("vi-VN") : "0"}{" "}
                  VND
                </h4>
                <span className="badge bg-success p-2">Còn hàng</span>
              </div>
            </div>

            {/* Chọn Size bằng Button */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold mb-3">Chọn Size:</Form.Label>
              <ButtonGroup className="mx-3">
                {sizes.map((size, idx) => {
                  const productSizeItem = productSize?.find(
                    (ps) => ps.id === size.id
                  );
                  const stock = productSizeItem?.ProductSize?.stock || 0;
                  const isAvailable = stock > 0;

                  return (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={
                        selectedSizeId === size.id
                          ? "dark"
                          : isAvailable
                          ? "outline-dark"
                          : "outline-secondary"
                      }
                      name="radio"
                      value={size.id}
                      checked={selectedSizeId === size.id}
                      onChange={(e) => {
                        setSelectedSizeId(size.id);
                        setSelectedStock(stock);
                        setQuantity(1);
                      }}
                      disabled={!isAvailable}
                      className={`${
                        !isAvailable ? "opacity-50" : ""
                      } px-4 py-2 mx-1`}
                      style={{
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        borderWidth: "2px",
                      }}
                    >
                      {size.name}
                    </ToggleButton>
                  );
                })}
              </ButtonGroup>
            </Form.Group>

            {/* Hiển thị số lượng tồn kho */}
            {selectedSizeId && selectedStock !== null && (
              <p className="text-muted mb-3">
                <i className="fas fa-box me-2"></i>
                Số lượng tồn kho: {selectedStock}
              </p>
            )}

            {/* Số lượng với nút tăng giảm */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Số lượng:</Form.Label>
              <InputGroup style={{ width: "150px" }}>
                <Button
                  variant="outline-dark"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3"
                  style={{ borderRadius: "20px 0 0 20px" }}
                >
                  <FaMinus />
                </Button>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInput}
                  min="1"
                  max={selectedStock || 1}
                  className="text-center"
                  style={{ borderLeft: "none", borderRight: "none" }}
                />
                <Button
                  variant="outline-dark"
                  onClick={() => handleQuantityChange(1)}
                  disabled={selectedStock !== null && quantity >= selectedStock}
                  className="px-3"
                  style={{ borderRadius: "0 20px 20px 0" }}
                >
                  <FaPlus />
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Nút Thêm vào giỏ hàng */}
            <Button
              variant="dark"
              size="lg"
              className="w-100 mb-4 py-3"
              onClick={handleAddToCart}
              style={{
                borderRadius: "30px",
                fontSize: "1.2rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 8px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              Thêm vào giỏ hàng
            </Button>
          </Col>
        </Row>

        {/* Phần mô tả sản phẩm */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-dark text-white py-3">
                <h4 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Mô tả sản phẩm
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Accordion>
                  {Array.isArray(product.description) &&
                    product.description.map((desc, index) => (
                      <Accordion.Item
                        key={index}
                        eventKey={index.toString()}
                        className="border-0 mb-3"
                      >
                        <Accordion.Header className="fw-bold bg-light rounded">
                          {desc.title}
                        </Accordion.Header>
                        <Accordion.Body className="bg-white rounded-bottom">
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              backgroundColor: "#f8f9fa",
                              padding: "20px",
                              borderRadius: "8px",
                              border: "1px solid #dee2e6",
                              minHeight: "50px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              fontSize: "1.1rem",
                              lineHeight: "1.6",
                            }}
                          >
                            {desc.content}
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Phần đánh giá và bình luận */}
        <Row>
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-dark text-white py-3">
                <h4 className="mb-0">
                  <i className="fas fa-star me-2"></i>
                  Đánh giá sản phẩm
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Form đánh giá */}
                <div className="mb-4">
                  <h5 className="mb-3">Viết đánh giá của bạn</h5>
                  <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3">
                      <Form.Label>Đánh giá sao:</Form.Label>
                      <div className="mb-2">
                        {[...Array(5)].map((star, index) => {
                          const ratingValue = index + 1;
                          return (
                            <span
                              key={index}
                              className="me-2"
                              onClick={() => setRating(ratingValue)}
                              onMouseEnter={() => setHover(ratingValue)}
                              onMouseLeave={() => setHover(0)}
                            >
                              <span
                                style={{
                                  color:
                                    ratingValue <= (hover || rating)
                                      ? "#ffc107"
                                      : "#e4e5e9",
                                  cursor: "pointer",
                                  fontSize: "2rem",
                                  transition: "all 0.2s ease",
                                  transform:
                                    ratingValue <= (hover || rating)
                                      ? "scale(1.1)"
                                      : "scale(1)",
                                }}
                              >
                                {ratingValue <= (hover || rating) ? (
                                  <FaStar />
                                ) : (
                                  <FaRegStar />
                                )}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Bình luận:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
                        className="shadow-sm"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #dee2e6",
                          padding: "15px",
                          fontSize: "1.1rem",
                        }}
                      />
                    </Form.Group>

                    <Button
                      variant="dark"
                      type="submit"
                      className="px-4 py-2"
                      style={{
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px rgba(0,0,0,0.1)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <i className="fas fa-paper-plane me-2"></i>
                      Gửi đánh giá
                    </Button>
                  </Form>
                </div>

                {/* Danh sách đánh giá */}
                <div className="mt-5">
                  <h5 className="mb-4">Đánh giá từ khách hàng</h5>
                  {reviews.length === 0 ? (
                    <p className="text-muted">
                      Chưa có đánh giá nào cho sản phẩm này
                    </p>
                  ) : (
                    <ListGroup variant="flush">
                      {reviews.map((review) => (
                        <ListGroup.Item
                          key={review.id}
                          className="border-bottom py-3"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 fw-bold">
                              {review.user.username}
                            </h6>
                            <small className="text-muted">
                              {dayjs(review.createdAt)
                                .tz("Asia/Ho_Chi_Minh")
                                .format("DD/MM/YYYY HH:mm")}
                            </small>
                          </div>
                          <div className="mb-2">
                            {renderStarRating(review.rating)}
                            <Badge bg="dark" className="ms-2">
                              {review.rating}/5
                            </Badge>
                          </div>
                          <p className="mb-0 text-muted">{review.reviewText}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetail;
