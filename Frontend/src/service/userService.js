import axios from "../middleware/axiosConfig"; // Import axios đã cấu hình
const registerNewUser = (email, phone, username, password) => {
  return axios.post("/register", { email, phone, username, password });
};

const loginUser = (emailOrPhone, password) => {
  return axios.post("/login", { emailOrPhone, password });
};

const logoutUser = () => {
  return axios.post("/logout");
};

const fetchAllUsers = () => {
  return axios.get(`/user/read`);
};

const deleteUser = (user) => {
  return axios.delete("/user/delete", { data: { id: user.id } });
};

const getUserById = (userId) => {
  return axios.get(`/user/${userId}`);
};
const updateUserById = (userId, userData) => {
  return axios.put(`/user/update/${userId}`, userData);
};
const updatePasswordById = (userId, passwordData) => {
  return axios.put(`/user/update-password/${userId}`, passwordData);
};
export {
  registerNewUser,
  loginUser,
  fetchAllUsers,
  deleteUser,
  logoutUser,
  getUserById,
  updateUserById,
  updatePasswordById,
};
