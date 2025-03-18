import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.product);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;
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
    <Container className="py-5 custom-container">
      <h2 className="text-center mb-4">ALL COLLECTIONS</h2>
      <Form.Select
        className="mb-4"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </Form.Select>
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
  );
};

export default ProductList;
