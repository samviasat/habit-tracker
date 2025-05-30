import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const HabitContext = createContext(null);

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Initialize with sample habits
      const sampleHabits = [
        {
          id: uuidv4(),
          name: 'Drink 8 glasses of water',
          description: 'Stay hydrated throughout the day',
          goal: 1,
          streak: { current: 0, longest: 0 },
          completions: {}
        },
        {
          id: uuidv4(),
          name: 'Exercise for 30 minutes',
          description: 'Daily workout session',
          goal: 1,
          streak: { current: 0, longest: 0 },
          completions: {}
        },
        {
          id: uuidv4(),
          name: 'Read for 20 minutes',
          description: 'Daily reading time',
          goal: 1,
          streak: { current: 0, longest: 0 },
          completions: {}
        },
        {
          id: uuidv4(),
          name: 'Meditate',
          description: 'Daily meditation practice',
          goal: 1,
          streak: { current: 0, longest: 0 },
          completions: {}
        }
      ];
      setHabits(sampleHabits);
      localStorage.setItem('habits', JSON.stringify(sampleHabits));
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData) => {
    const newHabit = {
      id: uuidv4(),
      ...habitData,
      streak: { current: 0, longest: 0 },
      completions: {}
    };
    setHabits(prevHabits => {
      const updatedHabits = [...prevHabits, newHabit];
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return updatedHabits;
    });
  };

  const updateHabit = (id, updates) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (habitId, date) => {
    setHabits(prevHabits => {
      const updatedHabits = prevHabits.map(habit => {
        if (habit.id === habitId) {
          const dateKey = format(date, 'yyyy-MM-dd');
          const updatedCompletions = { ...habit.completions };
          updatedCompletions[dateKey] = !updatedCompletions[dateKey];
          
          return {
            ...habit,
            completions: updatedCompletions
          };
        }
        return habit;
      });
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return updatedHabits;
    });
  };

  // Context value object
  const value = {
    habits,
    currentDate,
    viewType,
    setCurrentDate,
    setViewType,
    addHabit,
    toggleHabitCompletion
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
