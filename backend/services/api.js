import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://backend-url.railway.app/api'  
    : 'http://localhost:3000/api'
});

export default API;