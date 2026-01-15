// International tournament teams with ranking points (as of late 2025)
// Rankings are approximate and used for simulation probability

export const teams = {
  // Group A
  MEX: { name: 'Mexico', code: 'MEX', flag: '🇲🇽', ranking: 15, totalPoints: 1675.75, confederation: 'CONCACAF' },
  RSA: { name: 'South Africa', code: 'RSA', flag: '🇿🇦', ranking: 61, totalPoints: 1426.73, confederation: 'CAF' },
  KOR: { name: 'Korea Republic', code: 'KOR', flag: '🇰🇷', ranking: 22, totalPoints: 1599.45, confederation: 'AFC' },
  DEN: { name: 'Denmark', code: 'DEN', flag: '🇩🇰', ranking: 21, totalPoints: 1616.75, confederation: 'UEFA' },
  MKD: { name: 'North Macedonia', code: 'MKD', flag: '🇲🇰', ranking: 66, totalPoints: 1378.57, confederation: 'UEFA' },
  CZE: { name: 'Czech Republic', code: 'CZE', flag: '🇨🇿', ranking: 44, totalPoints: 1487.00, confederation: 'UEFA' },
  ISR: { name: 'Israel', code: 'ISR', flag: '🇮🇱', ranking: 77, totalPoints: 1328.14, confederation: 'UEFA' },
  
  // Group B
  BEL: { name: 'Belgium', code: 'BEL', flag: '🇧🇪', ranking: 8, totalPoints: 1730.71, confederation: 'UEFA' },
  EGY: { name: 'Egypt', code: 'EGY', flag: '🇪🇬', ranking: 32, totalPoints: 1529.71, confederation: 'CAF' },
  NZL: { name: 'New Zealand', code: 'NZL', flag: '🇳🇿', ranking: 87, totalPoints: 1279.25, confederation: 'OFC' },
  
  // Group C
  CAN: { name: 'Canada', code: 'CAN', flag: '🇨🇦', ranking: 26, totalPoints: 1574.01, confederation: 'CONCACAF' },
  ITA: { name: 'Italy', code: 'ITA', flag: '🇮🇹', ranking: 12, totalPoints: 1702.06, confederation: 'UEFA' },
  QAT: { name: 'Qatar', code: 'QAT', flag: '🇶🇦', ranking: 54, totalPoints: 1454.96, confederation: 'AFC' },
  SUI: { name: 'Switzerland', code: 'SUI', flag: '🇨🇭', ranking: 17, totalPoints: 1654.69, confederation: 'UEFA' },
  NIR: { name: 'Northern Ireland', code: 'NIR', flag: '🇬🇧', ranking: 69, totalPoints: 1366.02, confederation: 'UEFA' },
  WAL: { name: 'Wales', code: 'WAL', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}', ranking: 29, totalPoints: 1553.14, confederation: 'UEFA' },
  BIH: { name: 'Bosnia and Herzegovina', code: 'BIH', flag: '🇧🇦', ranking: 71, totalPoints: 1362.37, confederation: 'UEFA' },
  
  // Group D
  BRA: { name: 'Brazil', code: 'BRA', flag: '🇧🇷', ranking: 5, totalPoints: 1760.46, confederation: 'CONMEBOL' },
  MAR: { name: 'Morocco', code: 'MAR', flag: '🇲🇦', ranking: 11, totalPoints: 1716.34, confederation: 'CAF' },
  HAI: { name: 'Haiti', code: 'HAI', flag: '🇭🇹', ranking: 84, totalPoints: 1294.49, confederation: 'CONCACAF' },
  SCO: { name: 'Scotland', code: 'SCO', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}', ranking: 38, totalPoints: 1502.46, confederation: 'UEFA' },
  
  // Group E
  USA: { name: 'United States', code: 'USA', flag: '🇺🇸', ranking: 14, totalPoints: 1681.88, confederation: 'CONCACAF' },
  PAR: { name: 'Paraguay', code: 'PAR', flag: '🇵🇾', ranking: 39, totalPoints: 1501.50, confederation: 'CONMEBOL' },
  AUS: { name: 'Australia', code: 'AUS', flag: '🇦🇺', ranking: 35, totalPoints: 1515.18, confederation: 'AFC' },
  TUR: { name: 'Türkiye', code: 'TUR', flag: '🇹🇷', ranking: 25, totalPoints: 1582.69, confederation: 'UEFA' },
  ROU: { name: 'Romania', code: 'ROU', flag: '🇷🇴', ranking: 47, totalPoints: 1465.78, confederation: 'UEFA' },
  SVK: { name: 'Slovakia', code: 'SVK', flag: '🇸🇰', ranking: 45, totalPoints: 1485.65, confederation: 'UEFA' },
  KOS: { name: 'Kosovo', code: 'KOS', flag: '🇽🇰', ranking: 80, totalPoints: 1308.84, confederation: 'UEFA' },
  
  // Group F
  NED: { name: 'Netherlands', code: 'NED', flag: '🇳🇱', ranking: 7, totalPoints: 1756.27, confederation: 'UEFA' },
  JPN: { name: 'Japan', code: 'JPN', flag: '🇯🇵', ranking: 18, totalPoints: 1650.12, confederation: 'AFC' },
  UKR: { name: 'Ukraine', code: 'UKR', flag: '🇺🇦', ranking: 36, totalPoints: 1506.77, confederation: 'UEFA' },
  TUN: { name: 'Tunisia', code: 'TUN', flag: '🇹🇳', ranking: 41, totalPoints: 1494.86, confederation: 'CAF' },
  SWE: { name: 'Sweden', code: 'SWE', flag: '🇸🇪', ranking: 43, totalPoints: 1487.13, confederation: 'UEFA' },
  ALB: { name: 'Albania', code: 'ALB', flag: '🇦🇱', ranking: 63, totalPoints: 1401.07, confederation: 'UEFA' },
  
  // Group G
  ARG: { name: 'Argentina', code: 'ARG', flag: '🇦🇷', ranking: 2, totalPoints: 1873.33, confederation: 'CONMEBOL' },
  FRA: { name: 'France', code: 'FRA', flag: '🇫🇷', ranking: 3, totalPoints: 1870.00, confederation: 'UEFA' },
  SEN: { name: 'Senegal', code: 'SEN', flag: '🇸🇳', ranking: 19, totalPoints: 1648.07, confederation: 'CAF' },
  NOR: { name: 'Norway', code: 'NOR', flag: '🇳🇴', ranking: 37, totalPoints: 1506.34, confederation: 'UEFA' },
  
  // Group H
  ESP: { name: 'Spain', code: 'ESP', flag: '🇪🇸', ranking: 1, totalPoints: 1877.18, confederation: 'UEFA' },
  CPV: { name: 'Cape Verde', code: 'CPV', flag: '🇨🇻', ranking: 67, totalPoints: 1370.49, confederation: 'CAF' },
  KSA: { name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', ranking: 60, totalPoints: 1429.48, confederation: 'AFC' },
  URU: { name: 'Uruguay', code: 'URU', flag: '🇺🇾', ranking: 16, totalPoints: 1672.62, confederation: 'CONMEBOL' },
  
  // Group I
  GER: { name: 'Germany', code: 'GER', flag: '🇩🇪', ranking: 9, totalPoints: 1724.15, confederation: 'UEFA' },
  ALG: { name: 'Algeria', code: 'ALG', flag: '🇩🇿', ranking: 31, totalPoints: 1532.04, confederation: 'CAF' },
  AUT: { name: 'Austria', code: 'AUT', flag: '🇦🇹', ranking: 24, totalPoints: 1585.51, confederation: 'UEFA' },
  JOR: { name: 'Jordan', code: 'JOR', flag: '🇯🇴', ranking: 64, totalPoints: 1388.93, confederation: 'AFC' },
  IRQ: { name: 'Iraq', code: 'IRQ', flag: '🇮🇶', ranking: 58, totalPoints: 1436.94, confederation: 'AFC' },
  SOL: { name: 'Solomon Islands', code: 'SOL', flag: '🇸🇧', ranking: 152, totalPoints: 1039.86, confederation: 'OFC' },
  SUR: { name: 'Suriname', code: 'SUR', flag: '🇸🇷', ranking: 123, totalPoints: 1140.54, confederation: 'CONCACAF' },
  
  // Group J
  ENG: { name: 'England', code: 'ENG', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}', ranking: 4, totalPoints: 1834.12, confederation: 'UEFA' },
  CRO: { name: 'Croatia', code: 'CRO', flag: '🇭🇷', ranking: 10, totalPoints: 1716.88, confederation: 'UEFA' },
  GHA: { name: 'Ghana', code: 'GHA', flag: '🇬🇭', ranking: 72, totalPoints: 1351.09, confederation: 'CAF' },
  PAN: { name: 'Panama', code: 'PAN', flag: '🇵🇦', ranking: 27, totalPoints: 1559.15, confederation: 'CONCACAF' },
  
  // Group K
  POR: { name: 'Portugal', code: 'POR', flag: '🇵🇹', ranking: 6, totalPoints: 1760.38, confederation: 'UEFA' },
  COL: { name: 'Colombia', code: 'COL', flag: '🇨🇴', ranking: 13, totalPoints: 1701.30, confederation: 'CONMEBOL' },
  UZB: { name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', ranking: 50, totalPoints: 1462.03, confederation: 'AFC' },
  ECU: { name: 'Ecuador', code: 'ECU', flag: '🇪🇨', ranking: 23, totalPoints: 1591.73, confederation: 'CONMEBOL' },
  COD: { name: 'DR Congo', code: 'COD', flag: '🇨🇩', ranking: 56, totalPoints: 1444.16, confederation: 'CAF' },
  JAM: { name: 'Jamaica', code: 'JAM', flag: '🇯🇲', ranking: 70, totalPoints: 1362.46, confederation: 'CONCACAF' },
  NCL: { name: 'New Caledonia', code: 'NCL', flag: '🇳🇨', ranking: 150, totalPoints: 1042.62, confederation: 'OFC' },
  
  // Group L
  CIV: { name: 'Côte d\'Ivoire', code: 'CIV', flag: '🇨🇮', ranking: 42, totalPoints: 1489.59, confederation: 'CAF' },
  IRN: { name: 'Iran', code: 'IRN', flag: '🇮🇷', ranking: 20, totalPoints: 1617.02, confederation: 'AFC' },
  CUW: { name: 'Curaçao', code: 'CUW', flag: '🇨🇼', ranking: 82, totalPoints: 1302.70, confederation: 'CONCACAF' },
  POL: { name: 'Poland', code: 'POL', flag: '🇵🇱', ranking: 28, totalPoints: 1557.47, confederation: 'UEFA' },
};

export const getTeam = (code) => teams[code] || null;

export const getAllTeams = () => Object.values(teams);

export default teams;
