import axios from "../middleware/axiosConfig";

const loginWithGoogle = (credential) => {
  return axios.post("/auth/google", { credential });
};

const loginWithFacebook = (accessToken) => {
  return axios.post("/auth/facebook", { accessToken });
};

const verifyCaptcha = (recaptchaToken) => {
  return axios.post("/auth/verify-captcha", { recaptchaToken });
};

const sendOTP = (email) => {
  return axios.post("/auth/send-otp", { email });
};

const verifyOTP = (otp, email) => {
  return axios.post("/auth/verify-otp", { otp, email });
};
export {
  loginWithGoogle,
  loginWithFacebook,
  verifyCaptcha,
  verifyOTP,
  sendOTP,
};
