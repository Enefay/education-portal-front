import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isErrorToastShown = false;

api.interceptors.response.use(
  (response) => {
    // Reset the flag when a successful response is received
    toast.success(response.data);

    isErrorToastShown = false;
    return response;
  },
  (error) => {
    if (!isErrorToastShown) {
      isErrorToastShown = true; // Set the flag when an error occurs

      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        window.location.href = '/no-access';
      } else if (error.response.status === 404) {
        toast.error('İstek karşılık bulamadı 404.');
      } else if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
    setTimeout(() => {
      isErrorToastShown = false;
    }, 3000); 

    return Promise.reject(error);
  }
);

export default api;
