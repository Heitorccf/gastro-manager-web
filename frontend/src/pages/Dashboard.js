import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Categorias from '../components/Categorias';
import Pratos from '../components/Pratos';
import Ingredientes from '../components/Ingredientes';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gerenciamento de Restaurante
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="menu de gerenciamento"
              centered
            >
              <Tab label="Categorias" />
              <Tab label="Pratos" />
              <Tab label="Ingredientes" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Categorias />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Pratos />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Ingredientes />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}