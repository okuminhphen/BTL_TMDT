import axios from "../middleware/axiosConfig";

const getActiveBannerService = () => {
  return axios.get("/banner/read");
};
const getActiveBanner = () => {
  return axios.get("/banner/read/active");
};

const createBannerService = (bannerData) => {
  return axios.post("/banner/create", bannerData);
};
const updateBannerService = (bannerId, bannerData) => {
  return axios.put(`/banner/update/${bannerId}`, bannerData);
};
const uploadImages = (formData) => {
  return axios.post("/upload/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const deleteBanner = (bannerId) => {
  return axios.delete(`/banner/delete/${bannerId}`);
};
export {
  getActiveBannerService,
  createBannerService,
  updateBannerService,
  uploadImages,
  deleteBanner,
  getActiveBanner,
};
