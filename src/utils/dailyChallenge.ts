import { PROBLEMS } from '../problems';
import type { Problem } from '../types';

/**
 * Deterministically picks a "Daily Challenge" based on the current date.
 */
export function getDailyChallenge(): Problem {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Create a simple hash from the date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Use the hash to pick a problem from the list
  const index = Math.abs(hash) % PROBLEMS.length;
  return PROBLEMS[index];
}

/**
 * Returns time remaining until the next challenge (midnight).
 */
export function getTimeUntilNextChallenge(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
