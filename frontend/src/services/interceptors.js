import api from './api';
import { signOut } from '../contexts/AuthContext';

export const setupInterceptors = (showNotification) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Erro de autenticação
        if (error.response.status === 401) {
          signOut();
          showNotification('Sessão expirada. Por favor, faça login novamente.', 'warning');
        }
        // Erro de validação
        else if (error.response.status === 422) {
          const validationErrors = Object.values(error.response.data.errors).flat();
          showNotification(validationErrors[0], 'error');
        }
        // Erro do servidor
        else if (error.response.status === 500) {
          showNotification('Erro interno do servidor. Tente novamente mais tarde.', 'error');
        }
        // Outros erros
        else {
          showNotification(error.response.data.message || 'Ocorreu um erro.', 'error');
        }
      } else if (error.request) {
        showNotification('Erro de conexão com o servidor.', 'error');
      } else {
        showNotification('Ocorreu um erro inesperado.', 'error');
      }
      return Promise.reject(error);
    }
  );
};