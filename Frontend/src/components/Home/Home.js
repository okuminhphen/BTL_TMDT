import "./Home.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import React, { useEffect } from "react";
import { Container, Button, Card, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import bannerSaleImg from "../../assets/banner-sale70.png";
import bannerNewArrivals from "../../assets/banner-new-arrival.jpg";
import banner from "../../assets/banner.jpg";
import { Carousel } from "react-bootstrap";
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
    <div>
      <Container className="text-center text-md-start py-5 custom-container">
        <div className="row align-items-center">
          <div className="banner-carousel col-md-12">
            <Carousel fade className="mb-4">
              {bannerData.map((banner) => (
                <Carousel.Item
                  key={banner.id}
                  onClick={() => navigate(banner.link)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="d-block w-100"
                    src={banner.image}
                    alt={banner.alt}
                    style={{ maxHeight: "600px", objectFit: "cover" }}
                  />
                  <Carousel.Caption>
                    <h3>{banner.caption}</h3>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
        <hr className="my-4 border-top border-3 border-gradient" />

        <div className="row align-items-center new-arrivals-section">
          <div className="col-md-1"></div>
          <div className="col-md-6">
            <h1 className="new-arrivals-title">New Arrivals</h1>
            <p className="new-arrivals-description text-muted">
              Discover the latest trends and styles added to our collection. Be
              the first to explore our new arrivals and find your next favorite
              item!
            </p>
            <Button
              variant="primary"
              className="new-arrivals-button"
              onClick={() => (window.location.href = "/products")}
            >
              SHOP NOW
            </Button>
          </div>
          <div className="col-md-4">
            <img
              className="d-block w-100 new-arrivals-image"
              src={banner}
              alt="banner"
            />
          </div>
        </div>
      </Container>
      <hr className="my-4 border-top border-3 border-gradient" />
      {/* Product List */}
      <Container className="py-5 custom-container">
        <h2 className="text-center mb-4">LATEST COLLECTIONS</h2>
        <div className="product-grid">
          {products.slice(0, 10).map((product) => {
            const images = getProductImages(product.images);
            return (
              <Card
                key={product.id}
                className="h-100 shadow-sm"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:8080${images[0]}`}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.price} VND</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Container>
      <hr className="my-4 border-top border-3 border-gradient" />
      <Container className="py-5 custom-container">
        <h2 className="text-center mb-4">BEST SELLERS</h2>
        <p className="">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the
        </p>
        <div className="product-grid">
          {products.slice(0, 10).map((product) => {
            const images = getProductImages(product.images);
            return (
              <Card
                key={product.id}
                className="h-100 shadow-sm"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:8080${images[0]}`}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.price} VND</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Container>
      <hr className="my-4 border-top border-3 border-gradient" />
      <Container className="py-5">
        <Row className="text-center mb-5">
          {features.map((feature, index) => (
            <Col
              key={index}
              md={4}
              className="d-flex flex-column align-items-center"
            >
              <img
                src={feature.image}
                alt={feature.alt}
                className="mb-3"
                width="64"
                height="64"
              />
              <h3 className="fs-5 fw-semibold">{feature.title}</h3>
              <p className="text-muted">{feature.description}</p>
            </Col>
          ))}
        </Row>

        {/* Subscription Section */}
        <Row className="text-center">
          <Col md={8} className="mx-auto">
            <h2 className="fs-4 fw-bold">Subscribe now & get 20% off</h2>

            <Form className="d-flex justify-content-center">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="me-2 w-50"
              />
              <Button variant="dark">SUBSCRIBE</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
