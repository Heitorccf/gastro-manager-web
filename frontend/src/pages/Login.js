import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';  // Adicione esta importação
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Link
} from '@mui/material';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''  // Adicionado para confirmação
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        navigate('/');
      } else {
        // Validar senha de confirmação
        if (formData.password !== formData.password_confirmation) {
          setError('As senhas não conferem');
          return;
        }

        // Registro
        const response = await api.post('/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        });

        if (response.data.status === 'success') {
          // Login automático após registro
          await signIn(formData.email, formData.password);
          navigate('/');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isLogin ? 'Email ou senha inválidos' : 'Erro ao criar conta')
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {isLogin ? 'Login' : 'Criar Conta'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nome"
                name="name"
                autoComplete="name"
                autoFocus={!isLogin}
                value={formData.name}
                onChange={handleChange}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus={isLogin}
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={formData.password}
              onChange={handleChange}
            />

            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password_confirmation"
                label="Confirmar Senha"
                type="password"
                id="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin ? 'Entrar' : 'Registrar'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={toggleMode}
                sx={{ cursor: 'pointer' }}
              >
                {isLogin
                  ? "Não tem uma conta? Registre-se"
                  : "Já tem uma conta? Faça login"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}