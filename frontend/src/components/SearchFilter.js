import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchFilter({ onSearch, placeholder }) {
  return (
    <Box sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder={placeholder || "Pesquisar..."}
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}