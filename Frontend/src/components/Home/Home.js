import "./Home.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import React, { useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Form,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import bannerSaleImg from "../../assets/banner-sale70.png";
import bannerNewArrivals from "../../assets/banner-new-arrival.jpg";
import banner from "../../assets/banner.jpg";
import { Carousel } from "react-bootstrap";
import { FaArrowRight, FaShippingFast, FaEnvelope } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

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

  const features = [
    {
      title: "Easy Exchange Policy",
      description: "We offer hassle-free exchange policy",
      image:
        "https://storage.googleapis.com/a1aa/image/2CGMyx7fyTDulaPJHARdvWZ_zQiBE-rLw1tg2UnQLaQ.jpg",
      alt: "Icon representing easy exchange policy",
    },
    {
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy",
      image:
        "https://storage.googleapis.com/a1aa/image/k8AwidVjew1i_xx08ROkpZ-jKPkxRG0ofvtngy36364.jpg",
      alt: "Icon representing 7 days return policy",
    },
    {
      title: "Best Customer Support",
      description: "We provide 24/7 customer support",
      image:
        "https://storage.googleapis.com/a1aa/image/6egWY7aDLqb4L75DRuOxno1hkTs-3iU_Lt5RurBujk0.jpg",
      alt: "Icon representing best customer support",
    },
  ];

  const bannerData = [
    {
      id: 1,
      image: bannerSaleImg,
      alt: "Sale 70%",
      link: "/products",
      caption: "",
    },
    {
      id: 2,
      image: bannerNewArrivals,
      alt: "Thank you",
      caption: "Thank you for visiting – Happy shopping!",
    },
  ];

  return (
    <div className="home-container">
      <Container fluid className="p-0">
        {/* Enhanced Banner Carousel */}
        <div className="banner-carousel-container">
          <Carousel fade interval={5000} className="main-carousel">
            {bannerData.map((banner) => (
              <Carousel.Item
                key={banner.id}
                onClick={() => navigate(banner.link)}
                style={{ cursor: "pointer" }}
              >
                <div className="carousel-image-container">
                  <img
                    className="d-block w-100"
                    src={banner.image}
                    alt={banner.alt}
                    style={{ objectFit: "cover", height: "600px" }}
                  />
                  <div className="carousel-overlay"></div>
                </div>
                <Carousel.Caption className="carousel-caption-enhanced">
                  <h2 className="banner-title">{banner.caption}</h2>
                  {banner.link && (
                    <Button
                      variant="outline-light"
                      size="lg"
                      className="mt-3 shop-now-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(banner.link);
                      }}
                    >
                      SHOP NOW
                    </Button>
                  )}
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Container>

      <Container className="py-5">
        {/* New Arrivals Section with Enhanced Design */}
        <div className="new-arrivals-section p-4 my-5 bg-light rounded">
          <Row className="align-items-center">
            <Col md={7}>
              <div className="px-4">
                <h1 className="display-4 fw-bold mb-3">New Arrivals</h1>
                <p className="lead text-muted mb-4">
                  Discover the latest trends and styles added to our collection.
                  Be the first to explore our new arrivals and find your next
                  favorite item!
                </p>
                <Button
                  variant="dark"
                  size="lg"
                  className="px-4 py-2 d-flex align-items-center shop-btn"
                  onClick={() => navigate("/products")}
                >
                  <span>SHOP NOW</span>
                  <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </Col>
            <Col md={5}>
              <div className="image-container">
                <img
                  className="d-block w-100 rounded shadow"
                  src={banner}
                  alt="banner"
                  style={{
                    objectFit: "cover",
                    maxHeight: "400px",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Product Sections with Enhanced Cards */}
      <div className="bg-light py-5">
        <Container>
          <div className="section-heading text-center mb-5">
            <h2 className="display-5 fw-bold">LATEST COLLECTIONS</h2>
            <div className="heading-underline mx-auto"></div>
          </div>

          <div className="product-grid">
            {products.slice(0, 10).map((product) => {
              const images = getProductImages(product.images);
              return (
                <Card
                  key={product.id}
                  className="product-card shadow-sm border-0 h-100"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-img-wrapper">
                    <div style={{ height: "250px", overflow: "hidden" }}>
                      <Card.Img
                        variant="top"
                        src={`http://localhost:8080${images[0]}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        className="product-image"
                      />
                    </div>
                    <div className="card-hover-overlay">
                      <Button variant="light" className="quick-view-btn">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="product-title">
                      {product.name}
                    </Card.Title>
                    <Card.Text className="product-price fw-bold">
                      {product.price.toLocaleString()} VND
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <Button
              variant="outline-dark"
              size="lg"
              onClick={() => navigate("/products")}
              className="view-all-btn"
            >
              VIEW ALL
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <div className="section-heading text-center mb-5">
          <h2 className="display-5 fw-bold">BEST SELLERS</h2>
          <div className="heading-underline mx-auto"></div>
          <p className="lead text-muted mt-3">
            Our most popular products based on sales
          </p>
        </div>

        <div className="product-grid">
          {products.slice(0, 10).map((product, index) => {
            const images = getProductImages(product.images);
            return (
              <Card
                key={product.id}
                className="product-card shadow-sm border-0 h-100"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                {index < 3 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-0 m-2 z-index-1 px-2 py-1"
                  >
                    Top {index + 1}
                  </Badge>
                )}
                <div className="card-img-wrapper">
                  <div style={{ height: "250px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080${images[0]}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      className="product-image"
                    />
                  </div>
                  <div className="card-hover-overlay">
                    <Button variant="light" className="quick-view-btn">
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="product-title">
                    {product.name}
                  </Card.Title>
                  <Card.Text className="product-price fw-bold">
                    {product.price.toLocaleString()} VND
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Container>

      {/* Enhanced Features Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center mb-5 g-4">
            {features.map((feature, index) => (
              <Col
                key={index}
                md={4}
                className="d-flex flex-column align-items-center feature-card"
              >
                <div className="feature-icon-container mb-3">
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    width="64"
                    height="64"
                  />
                </div>
                <h3 className="fs-4 fw-bold mb-2">{feature.title}</h3>
                <p className="text-muted px-4">{feature.description}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Enhanced Subscription Section */}
      <div className="subscription-section py-5 mt-4">
        <Container>
          <Row className="py-4 px-3 mx-auto rounded shadow subscription-container">
            <Col md={6} className="d-flex flex-column justify-content-center">
              <h2 className="display-6 fw-bold mb-3">Subscribe Now</h2>
              <p className="lead mb-3">
                Get 20% off your first order and stay updated with our latest
                collections
              </p>
              <Form className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="me-2 subscription-input"
                />
                <Button variant="dark" className="px-4 subscribe-btn">
                  <FaEnvelope className="me-2" />
                  SUBSCRIBE
                </Button>
              </Form>
            </Col>
            <Col
              md={6}
              className="d-flex align-items-center justify-content-center mt-4 mt-md-0"
            >
              <div className="subscription-image">
                <FaShippingFast size={100} className="text-muted" />
                <h4 className="mt-3">
                  Free Shipping on Orders Over 1,000,000 VND
                </h4>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
