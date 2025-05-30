import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const HabitContext = createContext(null);

// Define a list of visually distinct colors for habits
const HABIT_COLORS = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FF9800', // Orange
  '#00BCD4', // Cyan
  '#E91E63', // Pink
  '#3F51B5', // Indigo
  '#009688', // Teal
];

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');
  const [selectedHabit, setSelectedHabit] = useState(null);

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
          completions: {},
          color: HABIT_COLORS[0]
        },
        {
          id: uuidv4(),
          name: 'Exercise for 30 minutes',
          description: 'Daily workout session',
          goal: 1,
          streak: { current: 0, longest: 0 },
          completions: {},
          color: HABIT_COLORS[1]
        },
        {
          id: uuidv4(),
          name: 'Read for 20 minutes',
          description: 'Daily reading time',
          goal: 1,
          streak: { current: 0, longest: 0 },
          completions: {},
          color: HABIT_COLORS[2]
        },
        {
          id: uuidv4(),
          name: 'Meditate',
          description: 'Daily meditation practice',
          goal: 1,
          streak: { current: 0, longest: 0 },
          completions: {},
          color: HABIT_COLORS[3]
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
      completions: {},
      color: HABIT_COLORS[habits.length % HABIT_COLORS.length]
    };
    setHabits(prevHabits => {
      const updatedHabits = [...prevHabits, newHabit];
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return updatedHabits;
    });
  };

  const updateHabit = (id, updates) => {
    setHabits(prevHabits => 
      prevHabits.map(habit =>
        habit.id === id ? { ...habit, ...updates } : habit
      )
    );
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

  return (
    <HabitContext.Provider value={{
      habits,
      currentDate,
      viewType,
      selectedHabit,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleCompletion: toggleHabitCompletion,
      setCurrentDate,
      setViewType,
      setSelectedHabit
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
