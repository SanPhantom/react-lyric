import axios from 'axios';

let musicAxios = axios.create({
  baseURL: "https://sanmusicapi.vercel.app/",
  timeout: 10000,
})

musicAxios.interceptors.response.use((response) => {
  if (response.status === 200) {
    return response.data;
  }
  return Promise.reject(Error(response.status))
}, (error) => {
  return Promise.reject(error);
})

musicAxios.interceptors.request.use((config) => {
  const { method } = config;
  switch (method.toUpperCase()) {
    case 'GET':
      config.params = {
        ...config.params,
        cookie: localStorage.getItem('musicCookie') || '',
      };
      break;
    case 'POST':
      break;
    default:
      console.log("axios request error")
  }
  return config;
})

export default musicAxios;