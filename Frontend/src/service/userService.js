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

const fetchAllUsers = (page, limit) => {
  return axios.get(`/users/read?page=${page}&limit=${limit}`);
};

const deleteUser = (user) => {
  return axios.delete("/user/delete", { data: { id: user.id } });
};
export { registerNewUser, loginUser, fetchAllUsers, deleteUser, logoutUser };
