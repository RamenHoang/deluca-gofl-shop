import axios from 'axios';
// import getCookie from './../utils/getCookie';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosClient;