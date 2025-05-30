import React from 'react';
import { Container, Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import { useHabits } from '../context/HabitContext';
import HabitList from './HabitList';
import CalendarView from './CalendarView';

const HabitTracker = ({ onAddHabit, onEditHabit }) => {
  const { viewType, setViewType, currentDate, setCurrentDate } = useHabits();

  const handleViewChange = (newView) => {
    setViewType(newView);
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleAddHabitClick = () => {
    onAddHabit();
  };

  const handleEditHabit = (habit) => {
    onEditHabit(habit);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h4" align="center">
              Daily Habit Tracker
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                <Button
                  variant={viewType === 'month' ? 'contained' : 'outlined'}
                  startIcon={<CalendarViewMonthIcon />}
                  onClick={() => handleViewChange('month')}
                >
                  Month
                </Button>
                <Button
                  variant={viewType === 'week' ? 'contained' : 'outlined'}
                  startIcon={<CalendarViewWeekIcon />}
                  onClick={() => handleViewChange('week')}
                  sx={{ ml: 1 }}
                >
                  Week
                </Button>
              </div>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddHabitClick}
              >
                Add Habit
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <HabitList onEditHabit={handleEditHabit} />
        </Grid>
        <Grid item xs={12}>
          <CalendarView date={currentDate} onDateChange={handleDateChange} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HabitTracker;
