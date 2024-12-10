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
  InputAdornment,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import api from '../services/api';

export default function Ingredientes() {
  const [ingredientes, setIngredientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    precoMin: '',
    precoMax: '',
    validadeAte: ''
  });

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco_unitario: '',
    data_validade: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadIngredientes();
  }, []);

  const loadIngredientes = async () => {
    try {
      const response = await api.get('/ingredientes');
      setIngredientes(response.data);
    } catch (error) {
      setErro('Erro ao carregar ingredientes: ' + error.message);
    }
  };

  const handleOpen = (ingrediente = null) => {
    if (ingrediente) {
      setForm(ingrediente);
      setEditando(ingrediente.id);
    } else {
      setForm({
        nome: '',
        descricao: '',
        preco_unitario: '',
        data_validade: new Date().toISOString().split('T')[0]
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

      const ingredienteData = {
        ...form,
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        preco_unitario: parseFloat(form.preco_unitario)
      };

      if (editando) {
        await api.put(`/ingredientes/${editando}`, ingredienteData);
      } else {
        await api.post('/ingredientes', ingredienteData);
      }
      handleClose();
      loadIngredientes();
    } catch (error) {
      setErro('Erro ao salvar ingrediente: ' + error.message);
      console.error('Erro completo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este ingrediente?')) {
      try {
        await api.delete(`/ingredientes/${id}`);
        loadIngredientes();
      } catch (error) {
        setErro('Erro ao excluir ingrediente: ' + error.message);
      }
    }
  };

  // Função de filtro
  const filteredIngredientes = ingredientes.filter(ingrediente => {
    const matchesSearch =
      ingrediente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingrediente.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPreco =
      (!filters.precoMin || ingrediente.preco_unitario >= parseFloat(filters.precoMin)) &&
      (!filters.precoMax || ingrediente.preco_unitario <= parseFloat(filters.precoMax));

    const matchesValidade = !filters.validadeAte ||
      new Date(ingrediente.data_validade) <= new Date(filters.validadeAte);

    return matchesSearch && matchesPreco && matchesValidade;
  });

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar ingredientes..."
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
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Preço Mínimo"
              type="number"
              value={filters.precoMin}
              onChange={(e) => setFilters(prev => ({ ...prev, precoMin: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Preço Máximo"
              type="number"
              value={filters.precoMax}
              onChange={(e) => setFilters(prev => ({ ...prev, precoMax: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Validade até"
              type="date"
              value={filters.validadeAte}
              onChange={(e) => setFilters(prev => ({ ...prev, validadeAte: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen()}
              fullWidth
            >
              Novo Ingrediente
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
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Data de Validade</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIngredientes.map((ingrediente) => (
              <TableRow key={ingrediente.id}>
                <TableCell>{ingrediente.nome}</TableCell>
                <TableCell>{ingrediente.descricao}</TableCell>
                <TableCell>R$ {Number(ingrediente.preco_unitario).toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(ingrediente.data_validade).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(ingrediente)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(ingrediente.id)}
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
          {editando ? 'Editar Ingrediente' : 'Novo Ingrediente'}
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
            name="preco_unitario"
            label="Preço Unitário"
            type="number"
            fullWidth
            value={form.preco_unitario}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="data_validade"
            label="Data de Validade"
            type="date"
            fullWidth
            value={form.data_validade}
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