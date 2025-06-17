import axios from "../middleware/axiosConfig"; // Import axios đã cấu hình

const getProducts = () => {
  return axios.get("/product/read");
};

const getProductById = (idProduct) => {
  return axios.get(`/product/${idProduct}`);
};

const deleteProduct = (productId) => {
  return axios.delete("/product/delete", { data: { id: productId } });
};

const updateProduct = (product) => {
  return axios.put("/product/update", product);
};

const fetchSizes = () => {
  return axios.get("/size/read");
};

const fetchCategory = () => {
  return axios.get("/category/read");
};

const createNewProduct = (productData) => {
  return axios.post("/product/create", productData);
};

const uploadImages = (formData) => {
  return axios.post("/upload/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export {
  createNewProduct,
  getProducts,
  fetchSizes,
  fetchCategory,
  uploadImages,
  deleteProduct,
  updateProduct,
  getProductById,
};
