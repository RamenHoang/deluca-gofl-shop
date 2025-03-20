import axiosClient from './axiosClient';

const contactAPI = {
  sendContactMessage: (contactData) => {
    return axiosClient.post('/contact', contactData);
  },
};

export default contactAPI;