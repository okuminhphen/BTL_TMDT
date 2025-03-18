import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Products from "../components/ManageProducts/Products";
import Home from "../components/Home/Home";
import ProductsPage from "../components/ProductsPage/ProductsPage";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import PrivateRoutes from "./PrivateRoutes";
import Cart from "../components/Cart/Cart";
import MainLayout from "../Layout/MainLayout";
import AuthLayout from "../Layout/AuthLayout";
import AdminLayout from "../Layout/AdminLayout";
import AdminPage from "../Pages/AdminPage";

const AppRoutes = (props) => {
  return (
    <>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          }
        />

        {/* User Routes */}
        <Route
          path="/products"
          element={
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <div>about</div>
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <div>contact</div>
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          }
        />
        <Route element={<PrivateRoutes />}>
          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />
          <Route
            path="/order"
            element={
              <MainLayout>
                <div>order</div>
              </MainLayout>
            }
          />
        </Route>

        <Route path="*" element={<div>404 not found</div>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
