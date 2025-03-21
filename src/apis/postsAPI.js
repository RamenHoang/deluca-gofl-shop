import axiosClient from "./axiosClient";

// Mock API functions
const postsAPI = {
  getAllPosts: () => {
    return axiosClient.get('/posts');
  },
  
  getPostById: (id) => {
    return axiosClient.get(`/posts/${id}`);
  },

};

export default postsAPI;
