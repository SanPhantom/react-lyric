import axios from '../config/axios.config';

export const login = (params) => {
  return axios.post('/login/cellphone', params)
}

export const loginStatus = () => {
  return axios.get('/login/status');
}