import axiosAuthClient from "./axiosAuthClient";
import axiosClient from "./axiosClient";

const commentAPI = {
    addNewComment: (data) => {
        let url = '/comments';
        return axiosAuthClient.post(url, data);
    },

    rateAverageOfBook: (bookId) => {
        let url = `/comments/average/${bookId}`;
        return axiosClient.get(url);
    }
}

export default commentAPI;
