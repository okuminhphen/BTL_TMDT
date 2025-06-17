import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategory } from "../../service/productService";
import "./ProductsPage.scss";
import { FaSearch } from "react-icons/fa";

const ProductList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, status } = useSelector((state) => state.product);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Lấy search parameter từ URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      let response = await fetchCategory();
      setCategories(response.data.DT);
    } catch (error) {
      console.error("Lỗi khi lấy categories:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  // Lọc sản phẩm theo category và search term
  const filteredProducts = products
    .filter(
      (product) =>
        !selectedCategory ||
        Number(product.Category?.id) === Number(selectedCategory)
    )
    .filter(
      (product) =>
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    <div className="products-page">
      <Container className="custom-container py-5">
        <h1 className="page-title">TẤT CẢ SẢN PHẨM</h1>

        <div className="search-filter-section">
          <Row className="g-3">
            <Col md={6}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  <Button
                    variant="dark"
                    type="submit"
                    className="search-button"
                  >
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={6}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>

        <p className="results-count">
          Có {filteredProducts.length} sản phẩm được tìm thấy
        </p>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>Không tìm thấy sản phẩm phù hợp</h3>
            <p>Vui lòng thử lại với từ khóa khác hoặc chọn danh mục khác</p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredProducts.map((product) => {
              const images = getProductImages(product.images);
              return (
                <Col key={product.id} xl={3} lg={4} md={6} sm={6} xs={12}>
                  <Card
                    className="product-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="card-img-wrapper">
                      <img
                        src={`http://localhost:8080${images[0]}`}
                        alt={product.name}
                        className="card-img"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="card-title">
                        {product.name}
                      </Card.Title>
                      <Card.Text className="card-price">
                        {product.price.toLocaleString()} VND
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ProductList;
