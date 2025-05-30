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
              sx={{
                height: '100px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 1,
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 2,
                },
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
              className={format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''}
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
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px', 
                justifyContent: 'center',
                marginTop: 'auto'
              }}>
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      margin: '1px',
                      border: '1px solid rgba(0,0,0,0.1)'
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
