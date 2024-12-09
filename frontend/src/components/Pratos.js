import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Alert, FormControl, InputLabel, Select,
  MenuItem, Chip, Box, Typography
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
  const [debugInfo, setDebugInfo] = useState('');
  const initialForm = {
    nome: '',
    descricao: '',
    preco: '',
    data_criacao: new Date().toISOString().split('T')[0],
    categoria_id: '',
    ingredientes: []
  };
  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    try {
      const [pratosRes, categoriasRes, ingredientesRes] = await Promise.all([
        api.get('/pratos'),
        api.get('/categorias'),
        api.get('/ingredientes')
      ]);
      setPratos(pratosRes.data);
      setCategorias(categoriasRes.data);
      setIngredientes(ingredientesRes.data);
    } catch (error) {
      const errorMsg = `Erro ao carregar dados: ${error.message}
        Detalhes: ${error.response?.data?.message || 'Sem detalhes adicionais'}`;
      setErro(errorMsg);
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpen = (prato = null) => {
    if (prato) {
      setForm({
        ...prato,
        ingredientes: prato.ingredientes?.map(i => i.id) || []
      });
      setEditando(prato.id);
    } else {
      setForm(initialForm);
      setEditando(null);
    }
    setOpen(true);
    setErro('');
    setDebugInfo('');
  };

  const handleClose = () => {
    setOpen(false);
    setErro('');
    setDebugInfo('');
    setForm(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo alterado: ${name}, Valor: `, value);
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validações
      if (!form.nome?.trim()) {
        throw new Error('Nome é obrigatório');
      }
      if (!form.categoria_id) {
        throw new Error('Categoria é obrigatória');
      }
      if (!form.preco || form.preco <= 0) {
        throw new Error('Preço deve ser maior que zero');
      }

      const pratoData = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        preco: parseFloat(form.preco),
        data_criacao: form.data_criacao,
        categoria_id: parseInt(form.categoria_id),
        ingredientes: Array.isArray(form.ingredientes) ?
          form.ingredientes.map(ingredienteId => ({
            ingrediente_id: ingredienteId,
            quantidade: 1 // Valor padrão para quantidade
          })) : []
      };

      // Debug info
      const debugData = `
        Dados sendo enviados:
        ${JSON.stringify(pratoData, null, 2)}
      `;
      setDebugInfo(debugData);
      console.log('Dados enviados:', pratoData);

      let response;
      if (editando) {
        response = await api.put(`/pratos/${editando}`, pratoData);
      } else {
        response = await api.post('/pratos', pratoData);
      }

      console.log('Resposta do servidor:', response.data);
      handleClose();
      loadData();
    } catch (error) {
      const errorMessage = `
        Erro ao ${editando ? 'atualizar' : 'criar'} prato:
        Status: ${error.response?.status || 'N/A'}
        Mensagem: ${error.response?.data?.message || error.message}
        Detalhes: ${JSON.stringify(error.response?.data || {}, null, 2)}
      `;

      setErro(errorMessage);
      console.error('Erro completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Error stack:', error.stack);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este prato?')) {
      try {
        await api.delete(`/pratos/${id}`);
        loadData();
      } catch (error) {
        const errorMsg = `Erro ao excluir prato: ${error.message}
          Detalhes: ${error.response?.data?.message || 'Sem detalhes adicionais'}`;
        setErro(errorMsg);
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

      {erro && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            whiteSpace: 'pre-wrap',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {erro}
        </Alert>
      )}

      {debugInfo && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            whiteSpace: 'pre-wrap',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {debugInfo}
        </Alert>
      )}

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
                <TableCell>R$ {Number(prato.preco).toFixed(2)}</TableCell>
                <TableCell>{prato.categoria?.nome}</TableCell>
                <TableCell>
                  {prato.ingredientes?.map(ing => (
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
          {erro && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
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
            name="preco"
            label="Preço"
            type="number"
            fullWidth
            value={form.preco}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense" required>
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
              value={form.ingredientes || []}
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