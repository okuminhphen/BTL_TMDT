import axios from "../middleware/axiosConfig";
const getAllVouchers = () => {
  return axios.get(`/voucher/read`);
};
export { getAllVouchers };
