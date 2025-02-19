import axios from "axios";
import getCookie from "../utils/getCookie";

const axiosAuthClient = axios.create({
  baseURL: "http://localhost:5500/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: getCookie("authUserToken"),
  },
});

export default axiosAuthClient;
