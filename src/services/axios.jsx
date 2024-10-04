import axios from "axios";
const baseURL = "http://localhost:8080/api/"; /* Your Base URL  */
// const baseURL = "https://66f6b940436827ced9783796.mockapi.io/";

const config = {
  baseURL: baseURL,
};

const api = axios.create(config);

api.defaults.baseURL = baseURL;

const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  // loại token được sử dụng để xác thực.
  // Người gửi yêu cầu (client) "mang" (bear) token này để chứng minh rằng họ đã đăng nhập hoặc có quyền truy cập.
  return config;
};

api.interceptors.request.use(handleBefore, null);
// một interceptor để mỗi khi gửi request,
// hàm handleBefore sẽ được chạy trước,
// thêm token vào tất cả các request.

export default api;
