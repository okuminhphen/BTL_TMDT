import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import "./Nav.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSelector } from "react-redux";

const Navigation = () => {
  const { cartItems } = useSelector((state) => state.cart);
  return (
    <>
      <Navbar bg="light" expand="lg" className="border-bottom px-4 py-3">
        <Container>
          <Navbar.Brand className="fw-bold fs-3">
            HappyShop<span className="text-danger">.</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <NavLink to="/" className="nav-link">
                HOME
              </NavLink>
              <NavLink to="/products" className="nav-link">
                COLLECTION
              </NavLink>
              <NavLink to="/about" className="nav-link">
                ABOUT
              </NavLink>
              <NavLink to="/contact" className="nav-link">
                CONTACT
              </NavLink>
              <Button variant="outline-dark" className="rounded-pill ms-3">
                Admin Panel
              </Button>
            </Nav>
            <div className="ms-3 d-flex align-items-center">
              <NavLink to="#" className="nav-link text-dark mx-3">
                <i className="fa-solid fa-magnifying-glass"></i>{" "}
                {/* Thay vì fas fa-search */}
              </NavLink>
              <NavLink to="#" className="nav-link text-dark mx-3">
                <i className="fa-solid fa-user"></i>
              </NavLink>
              <NavLink
                to="/cart"
                className="nav-link text-dark position-relative mx-3"
              >
                <i className="fa-solid fa-bag-shopping"></i>{" "}
                {/* Thay vì fas fa-shopping-bag */}
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartItems.length}
                </Badge>
              </NavLink>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
