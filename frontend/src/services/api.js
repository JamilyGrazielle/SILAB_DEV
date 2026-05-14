import axios from 'axios';

// Cria uma instância do axios com a URL base do seu Spring Boot
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptador: Antes de qualquer requisição sair do React, ele pega o token e anexa no cabeçalho
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('silab_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;