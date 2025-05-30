import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHabits } from '../context/HabitContext';

const HabitList = ({ onEditHabit }) => {
  const { habits, deleteHabit, selectedHabit, setSelectedHabit } = useHabits();

  return (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>My Habits</Typography>
      <List>
        {habits.map((habit) => (
          <ListItem
            key={habit.id}
            onClick={() => setSelectedHabit(habit)}
            sx={{
              cursor: 'pointer',
              bgcolor: selectedHabit?.id === habit.id ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: selectedHabit?.id === habit.id ? 'primary.light' : 'action.hover',
              },
              borderRadius: 1,
            }}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={(e) => {
                  e.stopPropagation();
                  onEditHabit(habit);
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHabit(habit.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={habit.name}
              secondary={habit.description}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default HabitList;
