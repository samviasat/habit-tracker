import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHabits } from '../context/HabitContext';

const HabitList = ({ onEditHabit }) => {
  const { habits, deleteHabit, selectedHabit, setSelectedHabit } = useHabits();

  return (
    <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      {habits.map((habit) => (
        <ListItem
          key={habit.id}
          onClick={() => setSelectedHabit(selectedHabit?.id === habit.id ? null : habit)}
          sx={{
            cursor: 'pointer',
            bgcolor: selectedHabit?.id === habit.id ? 'action.selected' : 'transparent',
            borderLeft: `4px solid ${habit.color}`,
            '&:hover': {
              bgcolor: 'action.hover',
            },
            transition: 'background-color 0.2s ease',
            pr: 12, // Add more padding on the right for actions
          }}
        >
          <ListItemText
            primary={habit.name}
            secondary={habit.description}
          />
          <ListItemSecondaryAction>
            <IconButton 
              edge="end" 
              aria-label="edit"
              onClick={(e) => {
                e.stopPropagation();
                onEditHabit(habit);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              edge="end" 
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteHabit(habit.id);
              }}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default HabitList;
