import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Link,
  Grid
} from '@mui/material';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        navigate('/');
      } else {
        // Lógica de registro
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.status === 'success') {
          await signIn(formData.email, formData.password);
          navigate('/');
        } else {
          setError(data.message || 'Erro no registro');
        }
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    }
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
            {isLogin ? 'Login' : 'Registro'}
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin ? 'Entrar' : 'Registrar'}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin
                    ? "Não tem uma conta? Registre-se"
                    : "Já tem uma conta? Faça login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}