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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../services/api';

export default function Pratos() {
  const [pratos, setPratos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    data_criacao: new Date().toISOString().split('T')[0],
    categoria_id: '',
    ingredientes: []
  });

  useEffect(() => {
    loadPratos();
    loadCategorias();
    loadIngredientes();
  }, []);

  const loadPratos = async () => {
    try {
      const response = await api.get('/pratos');
      setPratos(response.data);
    } catch (error) {
      setErro('Erro ao carregar pratos');
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      setErro('Erro ao carregar categorias');
    }
  };

  const loadIngredientes = async () => {
    try {
      const response = await api.get('/ingredientes');
      setIngredientes(response.data);
    } catch (error) {
      setErro('Erro ao carregar ingredientes');
    }
  };

  const handleOpen = (prato = null) => {
    if (prato) {
      setForm({
        ...prato,
        ingredientes: prato.ingredientes.map(i => i.id)
      });
      setEditando(prato.id);
    } else {
      setForm({
        nome: '',
        descricao: '',
        preco: '',
        data_criacao: new Date().toISOString().split('T')[0],
        categoria_id: '',
        ingredientes: []
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
        await api.put(`/pratos/${editando}`, form);
      } else {
        await api.post('/pratos', form);
      }
      handleClose();
      loadPratos();
    } catch (error) {
      setErro('Erro ao salvar prato');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este prato?')) {
      try {
        await api.delete(`/pratos/${id}`);
        loadPratos();
      } catch (error) {
        setErro('Erro ao excluir prato');
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
        Novo Prato
      </Button>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Ingredientes</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pratos.map((prato) => (
              <TableRow key={prato.id}>
                <TableCell>{prato.nome}</TableCell>
                <TableCell>{prato.descricao}</TableCell>
                <TableCell>R$ {prato.preco}</TableCell>
                <TableCell>{prato.categoria?.nome}</TableCell>
                <TableCell>
                  {prato.ingredientes.map(ing => (
                    <Chip
                      key={ing.id}
                      label={ing.nome}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {new Date(prato.data_criacao).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(prato)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(prato.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editando ? 'Editar Prato' : 'Novo Prato'}
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
            name="preco"
            label="Preço"
            type="number"
            fullWidth
            value={form.preco}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Categoria</InputLabel>
            <Select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              label="Categoria"
            >
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Ingredientes</InputLabel>
            <Select
              multiple
              name="ingredientes"
              value={form.ingredientes}
              onChange={handleChange}
              label="Ingredientes"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={ingredientes.find(i => i.id === value)?.nome}
                    />
                  ))}
                </Box>
              )}
            >
              {ingredientes.map((ing) => (
                <MenuItem key={ing.id} value={ing.id}>
                  {ing.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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