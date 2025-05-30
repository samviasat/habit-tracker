import React from 'react';
import { Grid, Paper, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths } from 'date-fns';
import { useHabits } from '../context/HabitContext';

const CalendarView = ({ date, onDateChange }) => {
  const { habits } = useHabits();
  const month = format(date, 'MMMM yyyy');
  const days = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date)
  });

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
        {[...Array(7)].map((_, idx) => (
          <Grid item xs={1.66} key={idx}>
            <Typography align="center" variant="caption">
              {format(new Date(2022, 0, idx + 1), 'EEE')}
            </Typography>
          </Grid>
        ))}

        {/* Days grid */}
        {days.map((day) => {
          const dayNumber = format(day, 'd');
          const dayIndex = getDay(day);
          const dayClass = 'day';

          return (
            <Grid item xs={1.66} key={dayNumber}>
              <Paper
                elevation={3}
                sx={{
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                    bgcolor: 'grey.100',
                  },
                }}
                className={dayClass}
                onClick={() => {
                  // Handle day click
                }}
              >
                <Typography>{dayNumber}</Typography>
                {habits.map((habit) => (
                  <div key={habit.id} style={{ width: '10px', height: '10px', borderRadius: '50%', margin: '2px' }}
                    className={getDayClass(day, habit)}
                  />
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default CalendarView;
