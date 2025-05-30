import React, { useState } from 'react';
import { Grid, Paper, Typography, IconButton, Box, Chip, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths } from 'date-fns';
import { useHabits } from '../context/HabitContext';

const CalendarView = ({ date, onDateChange }) => {
  const { habits, toggleHabitCompletion } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const month = format(date, 'MMMM yyyy');
  const monthStart = startOfMonth(date);
  const days = eachDayOfInterval({
    start: monthStart,
    end: endOfMonth(date)
  });

  // Calculate empty cells for the start of the month
  const startDayOfWeek = getDay(monthStart);
  const emptyDays = Array(startDayOfWeek).fill(null);

  const handleDateChange = (newDate) => {
    onDateChange(newDate);
  };

  const handleDayClick = (day) => {
    if (selectedHabit) {
      toggleHabitCompletion(selectedHabit.id, day);
    }
  };

  const getDayClass = (day, habit) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const completion = habit?.completions[dateKey];
    const today = format(new Date(), 'yyyy-MM-dd') === dateKey;

    if (today) return 'today';
    if (completion === undefined) return 'future';
    return completion ? 'completed' : 'missed';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Paper sx={{ p: 2 }}>
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>Select Habit to Track:</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          {habits.map(habit => (
            <Chip
              key={habit.id}
              label={habit.name}
              onClick={() => setSelectedHabit(habit)}
              color={selectedHabit?.id === habit.id ? "primary" : "default"}
              variant={selectedHabit?.id === habit.id ? "filled" : "outlined"}
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {selectedHabit 
            ? "Click on any day to toggle completion status" 
            : "Select a habit above to track its completion, or click a dot below to select a habit"}
        </Typography>
      </Box>

      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{month}</Typography>
        <div>
          <IconButton onClick={() => handleDateChange(subMonths(date, 1))}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => handleDateChange(addMonths(date, 1))}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </Grid>

      <Grid container spacing={2}>
        {/* Weekdays header */}
        {weekDays.map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography 
              align="center" 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                pb: 2,
                color: 'text.secondary'
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}

        {/* Empty cells for start of month */}
        {emptyDays.map((_, index) => (
          <Grid item xs={12/7} key={`empty-${index}`}>
            <Paper
              elevation={0}
              sx={{
                height: '100px',
                bgcolor: 'grey.50',
                opacity: 0.3,
                borderRadius: 1
              }}
            />
          </Grid>
        ))}

        {/* Calendar days */}
        {days.map((day) => (
          <Grid item xs={12/7} key={format(day, 'yyyy-MM-dd')}>
            <Paper
              elevation={1}
              onClick={() => handleDayClick(day)}
              sx={{
                height: '100px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: selectedHabit ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                boxShadow: 1,
                position: 'relative',
                '&:hover': selectedHabit ? {
                  transform: 'scale(1.02)',
                  boxShadow: 2,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderRadius: 'inherit'
                  }
                } : {},
                '&.completed': {
                  bgcolor: 'success.main',
                  opacity: 0.8
                },
                '&.missed': {
                  bgcolor: 'error.main',
                  opacity: 0.8
                },
                '&.today': {
                  border: '2px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50'
                },
                '&.future': {
                  bgcolor: 'background.paper',
                }
              }}
              className={selectedHabit ? getDayClass(day, selectedHabit) : 
                        format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'medium', 
                  mb: 1,
                  color: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'primary.main' : 'text.primary'
                }}
              >
                {format(day, 'd')}
              </Typography>
              {!selectedHabit && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '4px', 
                  justifyContent: 'center',
                  marginTop: 'auto'
                }}>
                  {habits.map((habit) => (
                    <Tooltip key={habit.id} title={habit.name} arrow>
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          margin: '1px',
                          border: '1px solid rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                        className={getDayClass(day, habit)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHabit(habit);
                        }}
                      />
                    </Tooltip>
                  ))}
                </div>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default CalendarView;
