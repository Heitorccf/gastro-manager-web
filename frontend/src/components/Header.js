import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ height: '48px' }}>
      <Toolbar variant="dense" sx={{ minHeight: '48px' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DW3S6
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleMenu}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Typography variant="body2">
                Bem-vindo(a), {user.name}
              </Typography>
              <KeyboardArrowDown />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}