import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8010/", // your backend base URL
});

export default axiosInstance;
