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
} from "react-bootstrap";
import { getProductById, fetchSizes } from "../../service/productService";
import { getReviewsByProductId } from "../../service/reviewService";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaPlus, FaMinus } from "react-icons/fa";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.currentUser?.userId);
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState({});
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
        setProduct(response.data.DT);
        setProductSize(response.data.DT.sizes);
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
    console.log("🔥 Dữ liệu gửi lên API:", cartItem);
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
      id: reviews.length + 1,
      userId: userId,
      username: "You", // Có thể lấy tên người dùng từ state nếu có
      rating: rating,
      comment: comment,
      date: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
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
        <Row className="align-items-center">
          {/* Cột 1: Ảnh nhỏ (danh sách ảnh) */}
          <Col md={1} className="d-flex flex-column align-items-center">
            {getProductImages(product.images).map((img, index) => (
              <Image
                key={index}
                src={`http://localhost:8080${img}`}
                alt={`Ảnh ${index + 1}`}
                fluid
                className={`mb-2 rounded border ${
                  mainImage === img ? "border-primary" : "border-light"
                }`}
                style={{
                  width: "50%",
                  cursor: "pointer",
                  padding: "4px",
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
              style={{ maxHeight: "400px" }}
            />
          </Col>

          {/* Cột 2: Thông tin sản phẩm */}
          <Col md={6} className="mx-5">
            <h2 className="fw-bold">{product.name}</h2>
            <h4 className="text-danger">{product.price}VND</h4>
            <p className="text-muted">{product.description}</p>
            {/* Chọn Size bằng Button */}
            <Form.Group className="mb-3">
              <Form.Label>Chọn Size:</Form.Label>
              <ButtonGroup className="mx-3">
                {sizes.map((size, idx) => {
                  // Tìm stock của size hiện tại trong productSize
                  const productSizeItem = productSize?.find(
                    (ps) => ps.id === size.id
                  );

                  const stock = productSizeItem?.ProductSize?.stock || 0;

                  const isAvailable = stock > 0; // Kiểm tra có hàng không

                  return (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={
                        selectedSizeId === size.id
                          ? "primary" // Màu xanh dương khi được chọn
                          : isAvailable
                          ? "outline-success" // Màu xanh nếu có hàng
                          : "outline-secondary" // Màu xám nếu hết hàng
                      }
                      name="radio"
                      value={size.id}
                      checked={selectedSizeId === size.id}
                      onChange={(e) => {
                        setSelectedSizeId(size.id);
                        setSelectedStock(stock); // Cập nhật số lượng tồn kho khi chọn
                        setQuantity(1); // Reset quantity khi đổi size
                      }}
                      disabled={!isAvailable} // Vô hiệu hóa nếu hết hàng
                      className={!isAvailable ? "opacity-50" : ""}
                    >
                      {size.name}
                    </ToggleButton>
                  );
                })}
              </ButtonGroup>
            </Form.Group>

            {/* Hiển thị số lượng tồn kho */}
            {selectedSizeId && selectedStock !== null && (
              <p className="text-muted">Số lượng tồn kho: {selectedStock}</p>
            )}

            {/* Số lượng với nút tăng giảm */}
            <Form.Group className="mb-3">
              <Form.Label>Số lượng:</Form.Label>
              <InputGroup style={{ width: "150px" }}>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
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
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantityChange(1)}
                  disabled={selectedStock !== null && quantity >= selectedStock}
                >
                  <FaPlus />
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Nút Thêm vào giỏ hàng */}
            <Button
              variant="primary"
              className="me-2"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
          </Col>
        </Row>

        {/* Phần đánh giá và bình luận */}
        <Row className="mt-5">
          <Col md={12}>
            <h3 className="mb-4">Đánh giá sản phẩm</h3>

            {/* Form đánh giá */}
            <Card className="mb-4">
              <Card.Body>
                <h5>Viết đánh giá của bạn</h5>
                <Form onSubmit={handleSubmitReview}>
                  <Form.Group className="mb-3">
                    <Form.Label>Đánh giá sao:</Form.Label>
                    <div className="mb-2">
                      {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                          <span
                            key={index}
                            className="me-1"
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
                                fontSize: "1.5rem",
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
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Gửi đánh giá
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Danh sách đánh giá */}
            <h4 className="mb-3">Đánh giá từ khách hàng</h4>
            {reviews.length === 0 ? (
              <p>Chưa có đánh giá nào cho sản phẩm này</p>
            ) : (
              <ListGroup variant="flush">
                {reviews.map((review) => (
                  <ListGroup.Item
                    key={review.id}
                    className="border-bottom py-3"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">{review.username}</h5>
                      <small className="text-muted">{review.date}</small>
                    </div>
                    <div className="mb-2">
                      {renderStarRating(review.rating)}
                      <Badge bg="primary" className="ms-2">
                        {review.rating}/5
                      </Badge>
                    </div>
                    <p className="mb-0">{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetail;
