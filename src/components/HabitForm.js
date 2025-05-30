import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useHabits } from '../context/HabitContext';

const HabitForm = ({ open, onClose, habit = null }) => {
  const { addHabit, updateHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habit) {
      updateHabit(habit.id, formData);
    } else {
      addHabit(formData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{habit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Habit Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {habit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HabitForm;
