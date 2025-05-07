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
    <>
      <Container className="py-5 custom-container">
        <h2 className="text-center mb-4">ALL COLLECTIONS</h2>

        {/* Search and Filter Area */}
        <div className="mb-4">
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Button variant="outline-dark" type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={6}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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

        {/* Display number of results */}
        <p className="mb-4">
          Có {filteredProducts.length} sản phẩm được tìm thấy
        </p>

        <Row>
          {filteredProducts.map((product) => {
            const images = getProductImages(product.images);
            return (
              <Col
                key={product.id}
                xl={2}
                lg={3}
                md={4}
                sm={6}
                xs={12}
                className="mb-4"
              >
                <Card
                  className="h-100 shadow-sm"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8080${images[0]}`}
                    height="200"
                    style={{ objectFit: "contain" }}
                  />
                  <Card.Body>
                    <Card.Title className="fs-6">{product.name}</Card.Title>
                    <Card.Text className="text-danger fw-bold">
                      {product.price}VND
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default ProductList;
