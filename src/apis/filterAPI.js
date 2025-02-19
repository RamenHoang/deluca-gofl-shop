import axiosClient from './axiosClient';

const filterAPI = {
    filterPrice: (cateId, data) => {
        let url = `/filters/filter-price/${cateId}`;
        return axiosClient.post(url, data);
    },

    filterRating: (cateId, star) => {
        let url = `/filters/filter-rating/${cateId}`;
        return axiosClient.post(url, star);
    }
}

export default filterAPI;
