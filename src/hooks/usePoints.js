import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

export function usePoints() {
  const [points, setPoints] = useLocalStorage(STORAGE_KEYS.points, 0);
  
  // Calculate level based on points
  const level = Math.floor(points / 100) + 1;
  
  // Calculate progress to next level
  const progressToNextLevel = points % 100;
  const pointsToNextLevel = 100 - progressToNextLevel;
  const progressPercentage = (progressToNextLevel / 100) * 100;
  
  // Add points function
  const addPoints = useCallback((amount) => {
    setPoints(prevPoints => prevPoints + amount);
  }, [setPoints]);
  
  // Reset points function (for testing)
  const resetPoints = useCallback(() => setPoints(0), [setPoints]);
  
  return {
    points,
    level,
    progressToNextLevel,
    pointsToNextLevel,
    progressPercentage,
    addPoints,
    resetPoints
  };
}
