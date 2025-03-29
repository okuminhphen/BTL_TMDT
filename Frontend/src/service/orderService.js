import axios from "../middleware/axiosConfig";

const createOrder = (orderData) => {
  return axios.post("/order/create", orderData);
};

const updateOrderStatus = (orderId, updatedData) => {
  return axios.put(`/order/details/update/${orderId}`, updatedData);
};

const getOrder = (orderId) => {
  return axios.get(`/order/${orderId}`);
};

const getOrdersByUserId = (userId) => {
  return axios.get(`/order/read/${userId}`);
};
export { createOrder, getOrder, updateOrderStatus, getOrdersByUserId };
