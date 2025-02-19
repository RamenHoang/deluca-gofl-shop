import axios from 'axios';
// import getCookie from './../utils/getCookie';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5500/api',
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosClient;