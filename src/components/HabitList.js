import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';

const HabitList = ({ onEditHabit }) => {
  const { habits, deleteHabit, toggleCompletion, selectedHabit, setSelectedHabit } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');

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
          }}
          secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`Streak: ${habit.streak.current}/${habit.streak.longest}`}
                color={habit.streak.current > 0 ? 'primary' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditHabit(habit);
                }}
                size="small"
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
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          }
        >
          <ListItemText
            primary={habit.name}
            secondary={habit.description}
            sx={{ pr: 2 }}
          />
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompletion(habit.id, today);
            }}
            sx={{
              mr: 8,
              color: 'white',
              bgcolor: habit.completions[today] ? habit.color : 'grey.300',
              '&:hover': {
                bgcolor: habit.completions[today] ? habit.color : 'grey.400',
              },
              transition: 'all 0.2s ease',
              width: 32,
              height: 32
            }}
          >
            {habit.completions[today] ? '✓' : ''}
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default HabitList;
