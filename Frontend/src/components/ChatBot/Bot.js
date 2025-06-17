import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import "./Bot.scss";
import { sendMessage } from "../../service/chatBotService";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [products, setProducts] = useState([]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // Add user message
      setMessages((prev) => [...prev, { text: inputMessage, sender: "user" }]);
      let message = inputMessage;
      setInputMessage("");
      const response = await sendMessage(message);
      console.log(response.data.reply.reply);
      console.log("dữ liệu bot:", response.data.reply.data);
      // Simulate bot typing delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: response.data.reply.reply, sender: "bot" },
        ]);
        // Update products if available
        if (
          response.data.reply.data &&
          Array.isArray(response.data.reply.data)
        ) {
          setProducts(response.data.reply.data);
        } else {
          setProducts([]);
        }
      }, 1000);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat with us</h3>
            <button className="close-button" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.text}
              </div>
            ))}
            {products.length > 0 && (
              <div className="products-container">
                <h4>Đề xuất:</h4>
                <div className="products-grid">
                  {products.map((product, index) => (
                    <div key={index} className="product-card">
                      {product.image && (
                        <a
                          href={`http://localhost:3000/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`http://localhost:8080${product.image}`}
                            alt={product.name}
                            className="product-image"
                          />
                        </a>
                      )}
                      <h5>{product.name}</h5>
                      <p className="product-price">
                        {product.price?.toLocaleString("vi-VN")} VNĐ
                      </p>
                      <p className="product-description">
                        {product.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      )}
      <button className="chat-icon" onClick={toggleChat}>
        <FaRobot />
      </button>
    </div>
  );
};

export default Bot;
