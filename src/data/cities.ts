// FIFA World Cup 2026 Host Cities
// 16 cities across USA, Mexico, and Canada

export const regions = {
  WESTERN: 'Western Region',
  CENTRAL: 'Central Region',
  EASTERN: 'Eastern Region',
};

export const cities = [
  // Western Region
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', region: regions.WESTERN, timezone: 'PT' },
  { id: 'seattle', name: 'Seattle', country: 'USA', region: regions.WESTERN, timezone: 'PT' },
  { id: 'san_francisco', name: 'San Francisco Bay Area', country: 'USA', region: regions.WESTERN, timezone: 'PT' },
  { id: 'los_angeles', name: 'Los Angeles', country: 'USA', region: regions.WESTERN, timezone: 'PT' },
  
  // Central Region - Mexico
  { id: 'guadalajara', name: 'Guadalajara', country: 'Mexico', region: regions.CENTRAL, timezone: 'CT' },
  { id: 'mexico_city', name: 'Mexico City', country: 'Mexico', region: regions.CENTRAL, timezone: 'CT' },
  { id: 'monterrey', name: 'Monterrey', country: 'Mexico', region: regions.CENTRAL, timezone: 'CT' },
  
  // Central Region - USA
  { id: 'houston', name: 'Houston', country: 'USA', region: regions.CENTRAL, timezone: 'CT' },
  { id: 'dallas', name: 'Dallas', country: 'USA', region: regions.CENTRAL, timezone: 'CT' },
  { id: 'kansas_city', name: 'Kansas City', country: 'USA', region: regions.CENTRAL, timezone: 'CT' },
  
  // Eastern Region
  { id: 'atlanta', name: 'Atlanta', country: 'USA', region: regions.EASTERN, timezone: 'ET' },
  { id: 'miami', name: 'Miami', country: 'USA', region: regions.EASTERN, timezone: 'ET' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', region: regions.EASTERN, timezone: 'ET' },
  { id: 'boston', name: 'Boston', country: 'USA', region: regions.EASTERN, timezone: 'ET' },
  { id: 'philadelphia', name: 'Philadelphia', country: 'USA', region: regions.EASTERN, timezone: 'ET' },
  { id: 'new_york', name: 'New York / New Jersey', country: 'USA', region: regions.EASTERN, timezone: 'ET' },
];

export const getCitiesByRegion = (region) => cities.filter(city => city.region === region);

export const getCity = (id) => cities.find(city => city.id === id);

export default cities;
