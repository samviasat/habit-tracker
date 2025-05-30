import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HabitProvider } from './context/HabitContext';
import HabitTracker from './components/HabitTracker';
import HabitForm from './components/HabitForm';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
    error: {
      main: '#f44336',
    },
  },
});

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const handleAddHabit = () => {
    setShowForm(true);
    setEditingHabit(null);
  };

  const handleEditHabit = (habit) => {
    setShowForm(true);
    setEditingHabit(habit);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HabitProvider>
        <HabitTracker 
          onAddHabit={handleAddHabit}
          onEditHabit={handleEditHabit}
        />
        <HabitForm 
          open={showForm} 
          onClose={handleCloseForm}
          habit={editingHabit}
        />
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
