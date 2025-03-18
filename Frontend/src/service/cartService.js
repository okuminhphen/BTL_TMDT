import axios from "../middleware/axiosConfig";

const getCart = (userId) => {
  return axios.get(`/cart/read/${userId}`);
};
const addItemToCart = (cartItem) => {
  return axios.post("/cart/add", cartItem);
};

export { getCart, addItemToCart };
