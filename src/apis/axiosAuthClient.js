import axios from "axios";
import getCookie from "../utils/getCookie";

const axiosAuthClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5500/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: getCookie("authUserToken"),
  },
});

export default axiosAuthClient;
