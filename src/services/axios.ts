import axios from "axios";

console.log(process.env.REACT_APP_API_URL, process.env.NODE_ENV);

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default axiosInstance;
