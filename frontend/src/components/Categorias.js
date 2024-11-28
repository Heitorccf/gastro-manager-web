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
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../services/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
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
      setErro('Erro ao carregar categorias');
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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editando) {
        await api.put(`/categorias/${editando}`, form);
      } else {
        await api.post('/categorias', form);
      }
      handleClose();
      loadCategorias();
    } catch (error) {
      setErro('Erro ao salvar categoria');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta categoria?')) {
      try {
        await api.delete(`/categorias/${id}`);
        loadCategorias();
      } catch (error) {
        setErro('Erro ao excluir categoria');
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Nova Categoria
      </Button>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Margem de Lucro</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell>{categoria.descricao}</TableCell>
                <TableCell>{categoria.margem_lucro}%</TableCell>
                <TableCell>
                  {new Date(categoria.data_criacao).toLocaleDateString()}
                </TableCell>
                <TableCell>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editando ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nome"
            label="Nome"
            type="text"
            fullWidth
            value={form.nome}
            onChange={handleChange}
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