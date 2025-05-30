import React, { useState } from 'react';
import { Paper, Typography, IconButton, Box, Tooltip } from '@mui/material';
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

  // Calculate empty cells for the start of the month
  const startDayOfWeek = getDay(monthStart);
  const emptyDays = Array(startDayOfWeek).fill(null);

  const handlePrevMonth = () => {
    onDateChange(subMonths(date, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(date, 1));
  };

  const handleDayClick = (day) => {
    if (selectedHabit) {
      const dateKey = format(day, 'yyyy-MM-dd');
      setPendingDays(prev => {
        const newPending = new Set(prev);
        if (newPending.has(dateKey)) {
          newPending.delete(dateKey);
        } else {
          newPending.add(dateKey);
        }
        return newPending;
      });
      toggleCompletion(selectedHabit.id, dateKey);
    }
  };

  const renderDayContent = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');

    if (!selectedHabit) {
      return (
        <Box sx={{ 
          display: 'flex', 
          gap: 0.5, 
          flexWrap: 'wrap',
          justifyContent: 'center',
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          minHeight: '12px'
        }}>
          {habits.map((habit) => (
            habit.completions[dateKey] && (
              <Tooltip key={habit.id} title={habit.name} arrow>
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHabit(habit);
                  }}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: habit.color,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.2)'
                    }
                  }}
                />
              </Tooltip>
            )
          ))}
        </Box>
      );
    }

    const isCompleted = selectedHabit.completions[dateKey];
    const isPending = pendingDays.has(dateKey);
    const shouldShowCircle = isPending ? !isCompleted : isCompleted;

    return shouldShowCircle ? (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          bgcolor: selectedHabit.color,
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'transform 0.2s ease',
        }}
      />
    ) : null;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedHabit ? `Tracking: ${selectedHabit.name}` : 'Habit Overview'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{month}</Typography>
        <Box>
          <IconButton onClick={handlePrevMonth} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        mb: 2 
      }}>
        {weekDays.map((day) => (
          <Box 
            key={day} 
            sx={{ 
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'text.secondary',
              pb: 1
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1
      }}>
        {emptyDays.map((_, index) => (
          <Box
            key={`empty-${index}`}
            sx={{
              aspectRatio: '1',
              height: { xs: '60px', sm: '80px', md: '100px' },
              bgcolor: 'grey.100',
              borderRadius: 1
            }}
          />
        ))}

        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const isToday = dateKey === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <Box
              key={dateKey}
              onClick={() => handleDayClick(day)}
              sx={{
                aspectRatio: '1',
                height: { xs: '60px', sm: '80px', md: '100px' },
                border: isToday ? 2 : 1,
                borderColor: isToday ? 'primary.main' : 'grey.300',
                borderRadius: 1,
                position: 'relative',
                cursor: selectedHabit ? 'pointer' : 'default',
                '&:hover': selectedHabit ? {
                  bgcolor: 'action.hover',
                } : {},
                transition: 'all 0.2s ease',
              }}
            >
              <Typography 
                sx={{ 
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  color: isToday ? 'primary.main' : 'text.primary',
                  fontWeight: isToday ? 'bold' : 'normal'
                }}
              >
                {format(day, 'd')}
              </Typography>
              {renderDayContent(day)}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default CalendarView;
