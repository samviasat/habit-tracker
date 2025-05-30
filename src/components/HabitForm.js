import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useHabits } from '../context/HabitContext';

const HABIT_COLORS = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FF9800', // Orange
  '#00BCD4', // Cyan
  '#E91E63', // Pink
  '#3F51B5', // Indigo
  '#009688', // Teal
];

const HabitForm = ({ open, onClose, habit = null }) => {
  const { addHabit, updateHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    goal: habit?.goal || 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habit) {
      updateHabit(habit.id, formData);
    } else {
      addHabit(formData.name, formData.description, formData.goal);
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
          <FormControl margin="dense" fullWidth>
            <InputLabel>Goal (times per day)</InputLabel>
            <Select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} time{num > 1 ? 's' : ''} per day
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
