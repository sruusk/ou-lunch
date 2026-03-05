export const getWeekNumber = (date: Date): number => {
  // Create a new Date object and set it to the nearest Thursday
  const tempDate = new Date(date.getTime());
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7)); // Adjust for the week starting on Monday

  // Get the first day of the year
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);

  // Calculate the number of days since the first day of the year
  return Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};
