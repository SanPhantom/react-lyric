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

export default musicAxios;