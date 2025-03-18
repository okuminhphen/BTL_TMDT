import axios from "axios";
// Next we make an 'instance' of it
const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Đổi thành URL backend của bạn
  withCredentials: true, // Tự động gửi cookies trong mọi request
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common["Authorization"] = "AUTH TOKEN FROM INSTANCE";

// Also add/ configure interceptors && all the other cool stuff

export default instance;
