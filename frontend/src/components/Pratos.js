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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import api from '../services/api';

export default function Pratos() {
  const [pratos, setPratos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoria: '',
    precoMin: '',
    precoMax: '',
    hasIngrediente: ''
  });

  const initialForm = {
    nome: '',
    descricao: '',
    preco: '',
    data_criacao: new Date().toISOString().split('T')[0],
    categoria_id: '',
    ingredientes: []
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

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
      setErro('Erro ao carregar dados: ' + error.message);
    }
  };

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
      if (!form.nome?.trim() || !form.categoria_id) {
        setErro('Nome e categoria são obrigatórios');
        return;
      }

      const pratoData = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        preco: parseFloat(form.preco),
        data_criacao: form.data_criacao,
        categoria_id: parseInt(form.categoria_id),
        ingredientes: form.ingredientes.map(id => ({
          ingrediente_id: id,
          quantidade: 1
        }))
      };

      if (editando) {
        await api.put(`/pratos/${editando}`, pratoData);
      } else {
        await api.post('/pratos', pratoData);
      }
      handleClose();
      loadData();
    } catch (error) {
      setErro('Erro ao salvar prato: ' + error.message);
      console.error('Erro completo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este prato?')) {
      try {
        await api.delete(`/pratos/${id}`);
        loadData();
      } catch (error) {
        setErro('Erro ao excluir prato: ' + error.message);
      }
    }
  };

  // Função de filtro
  const filteredPratos = pratos.filter(prato => {
    const matchesSearch =
      prato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prato.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategoria = !filters.categoria ||
      prato.categoria_id === parseInt(filters.categoria);

    const matchesPreco =
      (!filters.precoMin || prato.preco >= parseFloat(filters.precoMin)) &&
      (!filters.precoMax || prato.preco <= parseFloat(filters.precoMax));

    const matchesIngrediente = !filters.hasIngrediente ||
      prato.ingredientes.some(ing => ing.id === parseInt(filters.hasIngrediente));

    return matchesSearch && matchesCategoria && matchesPreco && matchesIngrediente;
  });

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar pratos..."
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
            <FormControl fullWidth size="small">
              <InputLabel>Categoria</InputLabel>
              <Select
                value={filters.categoria}
                onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
                label="Categoria"
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Contém Ingrediente</InputLabel>
              <Select
                value={filters.hasIngrediente}
                onChange={(e) => setFilters(prev => ({ ...prev, hasIngrediente: e.target.value }))}
                label="Contém Ingrediente"
              >
                <MenuItem value="">Todos</MenuItem>
                {ingredientes.map(ing => (
                  <MenuItem key={ing.id} value={ing.id}>{ing.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen()}
              fullWidth
            >
              Novo Prato
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
              <TableCell>Preço</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Ingredientes</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPratos.map((prato) => (
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
                <TableCell align="center">
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
            name="preco"
            label="Preço"
            type="number"
            fullWidth
            value={form.preco}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Categoria</InputLabel>
            <Select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              label="Categoria"
              required
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