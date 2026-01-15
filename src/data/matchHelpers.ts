// Helper functions for match scheduling

// Map venue names from CSV to city IDs
export const venueToCityId = {
  'Mexico City': 'mexico_city',
  'Toronto': 'toronto',
  'Vancouver': 'vancouver',
  'Los Angeles': 'los_angeles',
  'Boston': 'boston',
  'New York/NJ': 'new_york',
  'Guadalajara': 'guadalajara',
  'Philadelphia': 'philadelphia',
  'Houston': 'houston',
  'Dallas': 'dallas',
  'Monterrey': 'monterrey',
  'Miami': 'miami',
  'Atlanta': 'atlanta',
  'Seattle': 'seattle',
  'San Francisco': 'san_francisco',
  'Kansas City': 'kansas_city',
  'TBD': null,
};

// Parse date string like "Thu 11 June" to a date object
export const parseDate = (dateStr) => {
  if (dateStr === 'TBD' || !dateStr || dateStr.trim() === '') return null;
  
  // Handle "TBD (Mon 22 June)" format
  if (dateStr.includes('TBD')) {
    const match = dateStr.match(/\((\w+)\s+(\d+)\s+(\w+)\)/);
    if (match) {
      const [, dayName, day, month] = match;
      const monthMap = { 'June': 5, 'July': 6 }; // 0-indexed
      return { day: parseInt(day), month: monthMap[month] || 5, dayName, isTBD: true };
    }
    return null;
  }
  
  // Parse "Thu 11 June" format
  const match = dateStr.match(/(\w+)\s+(\d+)\s+(\w+)/);
  if (!match) return null;
  
  const [, dayName, day, month] = match;
  const monthMap = { 'June': 5, 'July': 6 }; // 0-indexed (June = 5, July = 6)
  return { 
    day: parseInt(day), 
    month: monthMap[month] || 5, 
    dayName,
    isTBD: false 
  };
};

// Format date object to display string
export const formatDate = (dateObj) => {
  if (!dateObj) return 'TBD';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dateObj.dayName} ${dateObj.day} ${monthNames[dateObj.month]}`;
};

// Get date key for sorting/grouping (YYYY-MM-DD format)
export const getDateKey = (dateObj) => {
  if (!dateObj) return '9999-99-99'; // TBD dates go to end
  const year = 2026;
  const month = String(dateObj.month + 1).padStart(2, '0');
  const day = String(dateObj.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
