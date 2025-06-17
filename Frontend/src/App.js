import "./App.scss";
import Nav from "./components/Navigation/Nav";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import { useState, useEffect } from "react";
import Bot from "./components/ChatBot/Bot";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Bot />
    </Router>
  );
}

export default App;
