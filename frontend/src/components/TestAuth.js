import React, { useState } from 'react';
import api from '../services/api';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';

export default function TestAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [detailedError, setDetailedError] = useState('');

  const handleRegister = async () => {
    try {
      console.log('Dados sendo enviados:', { name, email, password });

      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: password
      });

      console.log('Resposta do servidor:', response.data);
      setMessage('Registro realizado com sucesso!');
      setError('');
      setDetailedError('');
    } catch (err) {
      console.error('Erro completo:', err);
      setError(`Erro no registro: ${err.message}`);
      if (err.response) {
        setDetailedError(`Status: ${err.response.status}, Dados: ${JSON.stringify(err.response.data)}`);
      } else {
        setDetailedError('Erro de conexão com o servidor');
      }
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Tentando login com:', { email, password });

      const response = await api.post('/login', {
        email,
        password
      });

      console.log('Resposta do login:', response.data);
      localStorage.setItem('token', response.data.authorization?.token);
      setMessage('Login realizado com sucesso!');
      setError('');
      setDetailedError('');
    } catch (err) {
      console.error('Erro completo do login:', err);
      setError(`Erro no login: ${err.message}`);
      if (err.response) {
        setDetailedError(`Status: ${err.response.status}, Dados: ${JSON.stringify(err.response.data)}`);
      } else {
        setDetailedError('Erro de conexão com o servidor');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Teste de Autenticação
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {detailedError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Detalhes do erro: {detailedError}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleRegister}
          color="primary"
        >
          Registrar
        </Button>
        <Button
          variant="contained"
          onClick={handleLogin}
          color="secondary"
        >
          Login
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="textSecondary">
          Status da API: {api.defaults.baseURL}
        </Typography>
      </Box>
    </Box>
  );
}