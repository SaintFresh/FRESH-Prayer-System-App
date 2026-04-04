import { startOfWeek, addDays, isSameDay, isBefore, parseISO } from 'date-fns';

/**
 * Calculates the "Active Monday" for the user's current view.
 * The rule is:
 * 1. The first week starts on the Monday ON or AFTER the onboarding date.
 * 2. If the current date is before that first Monday, we show the first Monday.
 * 3. Otherwise, we show the Monday of the current calendar week.
 */
export function getActiveMonday(onboardingDateStr: string, currentDate: Date = new Date()): Date {
  if (!onboardingDateStr) return startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const onboardingDate = parseISO(onboardingDateStr);
  const firstMonday = startOfWeek(onboardingDate, { weekStartsOn: 1 });
  
  const currentMonday = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // If we are currently BEFORE the first Monday (shouldn't happen with this logic but for safety), 
  // show the first Monday. Otherwise, show the current calendar week's Monday.
  return isBefore(currentMonday, firstMonday) ? firstMonday : currentMonday;
}
