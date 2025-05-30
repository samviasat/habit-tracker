import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

  const addHabit = (name, description, goal) => {
    const newHabit = {
      id: uuidv4(),
      name,
      description,
      goal,
      streak: { current: 0, longest: 0 },
      completions: {},
      color: HABIT_COLORS[habits.length % HABIT_COLORS.length]
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (id, updates) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleCompletion = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completions = { ...habit.completions };
        completions[date] = !completions[date];
        return {
          ...habit,
          completions,
          streak: calculateStreak(completions)
        };
      }
      return habit;
    }));
  };

  const calculateStreak = (completions) => {
    const dates = Object.keys(completions).sort((a, b) => new Date(b) - new Date(a));
    let currentStreak = 0;
    let longestStreak = 0;
    let consecutive = true;

    for (let i = 0; i < dates.length; i++) {
      if (completions[dates[i]]) {
        if (consecutive) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        }
      } else {
        consecutive = false;
      }
    }

    return { current: currentStreak, longest: longestStreak };
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
      toggleCompletion,
      setCurrentDate,
      setViewType,
      setSelectedHabit
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
