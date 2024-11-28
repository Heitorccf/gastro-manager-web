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

export default function Ingredientes() {
  const [ingredientes, setIngredientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
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
      setErro('Erro ao carregar ingredientes');
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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editando) {
        await api.put(`/ingredientes/${editando}`, form);
      } else {
        await api.post('/ingredientes', form);
      }
      handleClose();
      loadIngredientes();
    } catch (error) {
      setErro('Erro ao salvar ingrediente');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este ingrediente?')) {
      try {
        await api.delete(`/ingredientes/${id}`);
        loadIngredientes();
      } catch (error) {
        setErro('Erro ao excluir ingrediente');
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
        Novo Ingrediente
      </Button>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Data de Validade</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredientes.map((ingrediente) => (
              <TableRow key={ingrediente.id}>
                <TableCell>{ingrediente.nome}</TableCell>
                <TableCell>{ingrediente.descricao}</TableCell>
                <TableCell>R$ {ingrediente.preco_unitario}</TableCell>
                <TableCell>
                  {new Date(ingrediente.data_validade).toLocaleDateString()}
                </TableCell>
                <TableCell>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editando ? 'Editar Ingrediente' : 'Novo Ingrediente'}
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
            name="preco_unitario"
            label="Preço Unitário"
            type="number"
            fullWidth
            value={form.preco_unitario}
            onChange={handleChange}
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