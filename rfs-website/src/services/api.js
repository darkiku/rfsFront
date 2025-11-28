import axios from 'axios';

const API_URL = 'https://your-api-url.com/api/news';

export const newsAPI = {
  getAll: async (page = 0, size = 50) => {
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  },
  
  create: async (newsData) => {
    const response = await axios.post(API_URL, newsData);
    return response.data;
  },
  
  update: async (id, newsData) => {
    const response = await axios.put(`${API_URL}/${id}`, newsData);
    return response.data;
  },
  
  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};