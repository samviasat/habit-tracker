import React from 'react';
import { List, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';

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
              ml: 2,
              bgcolor: habit.completions[today] ? 'primary.main' : 'grey.200',
              '&:hover': {
                bgcolor: habit.completions[today] ? 'primary.dark' : 'grey.300',
              }
            }}
          >
            {habit.completions[today] ? '✅' : '❌'}
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default HabitList;
