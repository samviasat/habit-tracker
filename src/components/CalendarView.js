import React from 'react';
import { Grid, Paper, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths } from 'date-fns';
import { useHabits } from '../context/HabitContext';

const CalendarView = ({ date, onDateChange }) => {
  const { habits } = useHabits();
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

  const getDayClass = (day, habit) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const completion = habit.completions[dateKey];
    const today = format(new Date(), 'yyyy-MM-dd') === dateKey;

    if (today) return 'today';
    if (completion === undefined) return 'future';
    return completion ? 'completed' : 'missed';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Paper sx={{ p: 2 }}>
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

      <Grid container spacing={1}>
        {/* Weekdays header */}
        {weekDays.map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography 
              align="center" 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                pb: 1
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
                bgcolor: 'grey.100',
                opacity: 0.5
              }}
            />
          </Grid>
        ))}

        {/* Calendar days */}
        {days.map((day) => (
          <Grid item xs={12/7} key={format(day, 'yyyy-MM-dd')}>
            <Paper
              elevation={1}
              sx={{
                height: '100px',
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
                '&.completed': {
                  bgcolor: 'primary.light',
                },
                '&.missed': {
                  bgcolor: 'error.light',
                },
                '&.today': {
                  border: '2px solid',
                  borderColor: 'primary.main',
                },
                '&.future': {
                  bgcolor: 'background.paper',
                }
              }}
              className={format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {format(day, 'd')}
              </Typography>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '2px', 
                justifyContent: 'center' 
              }}>
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      margin: '1px'
                    }}
                    className={getDayClass(day, habit)}
                  />
                ))}
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default CalendarView;
