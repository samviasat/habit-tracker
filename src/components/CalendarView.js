import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, IconButton, Box, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths } from 'date-fns';
import { useHabits } from '../context/HabitContext';

const CalendarView = ({ date, onDateChange }) => {
  const { habits, selectedHabit, toggleCompletion, setSelectedHabit } = useHabits();
  const [pendingDays, setPendingDays] = useState(new Set());
  const month = format(date, 'MMMM yyyy');
  const monthStart = startOfMonth(date);
  const days = eachDayOfInterval({
    start: monthStart,
    end: endOfMonth(date)
  });

  useEffect(() => {
    // Reset local completions when selected habit changes
    setPendingDays(new Set());
  }, [selectedHabit]);

  // Calculate empty cells for the start of the month
  const startDayOfWeek = getDay(monthStart);
  const emptyDays = Array(startDayOfWeek).fill(null);

  const handleDateChange = (newDate) => {
    onDateChange(newDate);
  };

  const handleDayClick = (day) => {
    if (selectedHabit) {
      const dateKey = format(day, 'yyyy-MM-dd');
      // Toggle the visual state immediately
      setPendingDays(prev => {
        const newPending = new Set(prev);
        if (newPending.has(dateKey)) {
          newPending.delete(dateKey);
        } else {
          newPending.add(dateKey);
        }
        return newPending;
      });
      // Update the actual habit data
      toggleCompletion(selectedHabit.id, format(day, 'yyyy-MM-dd'));
    }
  };

  const isDayCompleted = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    if (selectedHabit) {
      // When a habit is selected, show completion based on pending state or actual completion
      return pendingDays.has(dateKey) !== selectedHabit.completions[dateKey];
    }
    return false;
  };

  const renderDayContent = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');

    if (!selectedHabit) {
      // Show all completed habits in overview mode
      return habits.map((habit) => (
        habit.completions[dateKey] && (
          <Tooltip key={habit.id} title={habit.name} arrow>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHabit(habit);
              }}
              sx={{
                width: { xs: '8px', sm: '12px' },
                height: { xs: '8px', sm: '12px' },
                borderRadius: '50%',
                bgcolor: habit.color,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: { xs: 'scale(1.1)', sm: 'scale(1.2)' }
                }
              }}
            />
          </Tooltip>
        )
      ));
    }

    // Show selected habit's completion status with immediate feedback
    const isCompleted = selectedHabit.completions[dateKey];
    const isPending = pendingDays.has(dateKey);
    const shouldShowCircle = isPending ? !isCompleted : isCompleted;

    return shouldShowCircle ? (
      <Box
        sx={{
          width: { xs: '16px', sm: '20px' },
          height: { xs: '16px', sm: '20px' },
          borderRadius: '50%',
          bgcolor: selectedHabit.color,
          position: 'absolute',
          bottom: { xs: '8px', sm: '12px' },
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transform: 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      />
    ) : null;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Paper sx={{ 
      p: { xs: 1, sm: 2 }, 
      overflowX: 'hidden' 
    }}>
      <Box sx={{ mb: { xs: 1, sm: 2 }, px: { xs: 1, sm: 0 } }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          {selectedHabit ? `Tracking: ${selectedHabit.name}` : 'Select a habit to track'}
        </Typography>
        {selectedHabit && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Click on days to toggle completion status
          </Typography>
        )}
      </Box>

      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          {month}
        </Typography>
        <div>
          <IconButton 
            onClick={() => handleDateChange(subMonths(date, 1))}
            size="small"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleDateChange(addMonths(date, 1))}
            size="small"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
      </Grid>

      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {weekDays.map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography 
              align="center" 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                pb: { xs: 1, sm: 2 },
                color: 'text.secondary',
                fontSize: { xs: '0.7rem', sm: '0.875rem' }
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}

        {emptyDays.map((_, index) => (
          <Grid item xs={12/7} key={`empty-${index}`}>
            <Paper
              elevation={0}
              sx={{
                height: { xs: '60px', sm: '100px' },
                bgcolor: 'grey.50',
                opacity: 0.3,
                borderRadius: 1
              }}
            />
          </Grid>
        ))}

        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const isToday = dateKey === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <Grid item xs={12/7} key={dateKey}>
              <Paper
                elevation={1}
                onClick={() => handleDayClick(day)}
                sx={{
                  height: { xs: '60px', sm: '100px' },
                  p: { xs: 1, sm: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: selectedHabit ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  boxShadow: 1,
                  position: 'relative',
                  '&:hover': selectedHabit ? {
                    transform: { xs: 'none', sm: 'scale(1.02)' },
                    boxShadow: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      borderRadius: 'inherit'
                    }
                  } : {},
                  '&.today': {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }
                }}
                className={isToday ? 'today' : ''}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'medium',
                    fontSize: { xs: '0.9rem', sm: '1.25rem' },
                    color: isToday ? 'primary.main' : 'text.primary'
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: { xs: '2px', sm: '4px' }, 
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: { xs: '8px', sm: '12px' }
                }}>
                  {renderDayContent(day)}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default CalendarView;
