import axiosAuthClient from './axiosAuthClient';

const orderAPI = {
    calculateShippingFee: (data) => {
        let url = '/orders/calculate-shipping-fee';
        return axiosAuthClient.post(url, data);
    },

    addNewOrder: (data) => {
        let url = '/orders/add-new-order';
        return axiosAuthClient.post(url, data);
    },

    getAllOrderOfUser: () => {
        let url = '/orders/get-order-by-user';
        return axiosAuthClient.get(url);
    },
    
    getOrderDetailByCode: (code) => {
        let url = `/orders/get-order-detail-by-code/${code}`;
        return axiosAuthClient.get(url);
    }, 

    destroyOrderById: (id) => {
        let url = `/orders/destroy-order/${id}`;
        return axiosAuthClient.get(url);
    }
}

export default orderAPI;
