import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Products from "../components/ManageProducts/Products";
import Home from "../components/Home/Home";
import ProductsPage from "../components/ProductsPage/ProductsPage";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import PrivateRoutes from "./PrivateRoutes";
import Cart from "../components/Cart/Cart";
const AppRoutes = (props) => {
  return (
    <>
      <Routes>
        {/* <Route element={<PrivateRoutes />}> */}
        <Route path="/admin/products" element={<Products />} />

        {/* </Route> */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<div>about</div>} />
        <Route path="/contact" element={<div>contact</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<>order</>} />
        </Route>

        <Route path="*" element={<div>404 not found</div>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
