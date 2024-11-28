import api from './api';

export default class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll() {
    try {
      const response = await api.get(this.endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { data, status } = error.response;
      return {
        message: data.message || 'Ocorreu um erro',
        status,
        errors: data.errors
      };
    }
    return {
      message: 'Erro de conexão com o servidor',
      status: 0
    };
  }
}