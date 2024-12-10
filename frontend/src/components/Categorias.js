import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Box,
  Grid,
  InputAdornment
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import api from '../services/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    margemMin: '',
    margemMax: '',
  });

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    margem_lucro: '',
    data_criacao: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      setErro('Erro ao carregar categorias: ' + error.message);
    }
  };

  const handleOpen = (categoria = null) => {
    if (categoria) {
      setForm(categoria);
      setEditando(categoria.id);
    } else {
      setForm({
        nome: '',
        descricao: '',
        margem_lucro: '',
        data_criacao: new Date().toISOString().split('T')[0]
      });
      setEditando(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErro('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.nome?.trim()) {
        setErro('Nome é obrigatório');
        return;
      }

      const categoriaData = {
        ...form,
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        margem_lucro: parseFloat(form.margem_lucro)
      };

      if (editando) {
        await api.put(`/categorias/${editando}`, categoriaData);
      } else {
        await api.post('/categorias', categoriaData);
      }
      handleClose();
      loadCategorias();
    } catch (error) {
      setErro('Erro ao salvar categoria: ' + error.message);
      console.error('Erro completo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta categoria?')) {
      try {
        await api.delete(`/categorias/${id}`);
        loadCategorias();
      } catch (error) {
        setErro('Erro ao excluir categoria: ' + error.message);
      }
    }
  };

  // Função de filtro
  const filteredCategorias = categorias.filter(categoria => {
    const matchesSearch =
      categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMargem =
      (!filters.margemMin || categoria.margem_lucro >= parseFloat(filters.margemMin)) &&
      (!filters.margemMax || categoria.margem_lucro <= parseFloat(filters.margemMax));

    return matchesSearch && matchesMargem;
  });

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar categorias..."
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Margem Mínima (%)"
              type="number"
              value={filters.margemMin}
              onChange={(e) => setFilters(prev => ({ ...prev, margemMin: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Margem Máxima (%)"
              type="number"
              value={filters.margemMax}
              onChange={(e) => setFilters(prev => ({ ...prev, margemMax: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen()}
              fullWidth
            >
              Nova Categoria
            </Button>
          </Grid>
        </Grid>
      </Box>

      {erro && (
        <Alert
          severity="error"
          sx={{ mb: 2, whiteSpace: 'pre-wrap' }}
          onClose={() => setErro('')}
        >
          {erro}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Margem de Lucro</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell>{categoria.descricao}</TableCell>
                <TableCell>{categoria.margem_lucro}%</TableCell>
                <TableCell>
                  {new Date(categoria.data_criacao).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(categoria)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(categoria.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editando ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErro('')}>
              {erro}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="nome"
            label="Nome"
            type="text"
            fullWidth
            value={form.nome}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="descricao"
            label="Descrição"
            type="text"
            fullWidth
            value={form.descricao}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="margem_lucro"
            label="Margem de Lucro (%)"
            type="number"
            fullWidth
            value={form.margem_lucro}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="data_criacao"
            label="Data de Criação"
            type="date"
            fullWidth
            value={form.data_criacao}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}