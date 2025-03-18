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
} from "react-bootstrap";
import { getProductById, fetchSizes } from "../../service/productService";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
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
  useEffect(() => {
    getProductDetails(id);
    getSizes();
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

  if (!product) return <p>Loading...</p>;

  const handleAddToCart = async () => {
    if (!userId) {
      toast.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login"); // Chuyển hướng về trang đăng nhập
      return;
    }
    if (!selectedSizeId) {
      alert("Vui lòng chọn size!");
      return;
    }

    const cartItem = {
      id: product.id,
      userId: userId,
      sizeId: selectedSizeId,
      quantity: quantity,
    };
    console.log("🔥 Dữ liệu gửi lên API:", cartItem);
    toast.success("thêm sản phẩm thành công");
    dispatch(addToCartAsync(cartItem));
  };
  return (
    <>
      {console.log("user Id", userId)};
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
                      }}
                      disabled={!isAvailable} // Vô hiệu hóa nếu hết hàng
                      className={!isAvailable ? "opacity-50" : ""}
                    >
                      {size.name} {isAvailable ? `(${stock} sp)` : "(Hết hàng)"}
                    </ToggleButton>
                  );
                })}
              </ButtonGroup>
            </Form.Group>

            {/* Hiển thị số lượng tồn kho */}
            {selectedSizeId && selectedStock !== null && (
              <p className="text-muted">Số lượng tồn kho: {selectedStock}</p>
            )}
            {/* Số lượng */}
            <Form.Group className="mb-3">
              <Form.Label>Số lượng:</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                min="1"
                style={{ width: "80px" }}
              />
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
      </Container>
    </>
  );
};

export default ProductDetail;
