import React from 'react';
import { List, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHabits } from '../context/HabitContext';

const HabitList = ({ onEditHabit }) => {
  const { habits, deleteHabit, toggleHabitCompletion } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <List>
      {habits.map((habit) => (
        <ListItem
          key={habit.id}
          secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => onEditHabit(habit)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteHabit(habit.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemText
            primary={habit.name}
            secondary={habit.description}
          />
          <Chip
            label={`Streak: ${habit.streak.current} (${habit.streak.longest})`}
            color={habit.streak.current > 0 ? 'primary' : 'default'}
          />
          <IconButton
            size="small"
            onClick={() => toggleHabitCompletion(habit.id, today)}
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
