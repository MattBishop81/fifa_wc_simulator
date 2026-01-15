// International tournament groups
// 48 teams in 12 groups of 4
// Note: Some teams are undecided (shown as arrays of possible teams)

import { parseDate, venueToCityId } from './matchHelpers';

export const groups = {
  A: {
    name: 'Group A',
    teams: ['MEX', 'RSA', 'KOR', ['DEN', 'MKD', 'CZE', 'ISR']],
    matches: [
      { id: 'A1', team1: 'MEX', team2: 'RSA', matchday: 1, date: parseDate('Thu 11 June'), venue: venueToCityId['Mexico City'], matchNumber: 1 },
      { id: 'A2', team1: 'KOR', team2: ['DEN', 'MKD', 'CZE', 'ISR'], matchday: 1, date: parseDate('Thu 11 June'), venue: venueToCityId['Guadalajara'], matchNumber: 2 },
      { id: 'A3', team1: 'MEX', team2: 'KOR', matchday: 2, date: parseDate('Thu 18 June'), venue: venueToCityId['Guadalajara'], matchNumber: 28 },
      { id: 'A4', team1: ['DEN', 'MKD', 'CZE', 'ISR'], team2: 'RSA', matchday: 2, date: parseDate('Thu 18 June'), venue: venueToCityId['Atlanta'], matchNumber: 25 },
      { id: 'A5', team1: ['DEN', 'MKD', 'CZE', 'ISR'], team2: 'MEX', matchday: 3, date: parseDate('Wed 24 June'), venue: venueToCityId['Mexico City'], matchNumber: 53 },
      { id: 'A6', team1: 'RSA', team2: 'KOR', matchday: 3, date: parseDate('Wed 24 June'), venue: venueToCityId['Monterrey'], matchNumber: 54 },
    ],
  },
  B: {
    name: 'Group B',
    teams: ['CAN', ['ITA', 'NIR', 'WAL', 'BIH'], 'QAT', 'SUI'],
    matches: [
      { id: 'B1', team1: 'CAN', team2: ['ITA', 'NIR', 'WAL', 'BIH'], matchday: 1, date: parseDate('Fri 12 June'), venue: venueToCityId['Toronto'], matchNumber: 3 },
      { id: 'B2', team1: 'QAT', team2: 'SUI', matchday: 1, date: parseDate('Sat 13 June'), venue: venueToCityId['San Francisco'], matchNumber: 8 },
      { id: 'B3', team1: 'CAN', team2: 'QAT', matchday: 2, date: parseDate('Thu 18 June'), venue: venueToCityId['Vancouver'], matchNumber: 27 },
      { id: 'B4', team1: 'SUI', team2: ['ITA', 'NIR', 'WAL', 'BIH'], matchday: 2, date: parseDate('Thu 18 June'), venue: venueToCityId['Los Angeles'], matchNumber: 26 },
      { id: 'B5', team1: 'SUI', team2: 'CAN', matchday: 3, date: parseDate('Wed 24 June'), venue: venueToCityId['Vancouver'], matchNumber: 51 },
      { id: 'B6', team1: ['ITA', 'NIR', 'WAL', 'BIH'], team2: 'QAT', matchday: 3, date: parseDate('Wed 24 June'), venue: venueToCityId['Seattle'], matchNumber: 52 },
    ],
  },
  C: {
    name: 'Group C',
    teams: ['BRA', 'MAR', 'HAI', 'SCO'],
    matches: [
      { id: 'C1', team1: 'BRA', team2: 'MAR', matchday: 1, date: parseDate('Sat 13 June'), venue: venueToCityId['New York/NJ'], matchNumber: 7 },
      { id: 'C2', team1: 'HAI', team2: 'SCO', matchday: 1, date: parseDate('Sat 13 June'), venue: venueToCityId['Boston'], matchNumber: 5 },
      { id: 'C3', team1: 'BRA', team2: 'HAI', matchday: 2, date: parseDate('Fri 19 June'), venue: venueToCityId['Philadelphia'], matchNumber: 29 },
      { id: 'C4', team1: 'SCO', team2: 'MAR', matchday: 2, date: parseDate('Fri 19 June'), venue: venueToCityId['Boston'], matchNumber: 30 },
      { id: 'C5', team1: 'SCO', team2: 'BRA', matchday: 3, date: parseDate('Wed 24 June'), venue: venueToCityId['Miami'], matchNumber: 49 },
      { id: 'C6', team1: 'MAR', team2: 'HAI', matchday: 3, date: parseDate('Wed 24 June'), venue: venueToCityId['Atlanta'], matchNumber: 50 },
    ],
  },
  D: {
    name: 'Group D',
    teams: ['USA', 'PAR', 'AUS', ['TUR', 'ROU', 'SVK', 'KOS']],
    matches: [
      { id: 'D1', team1: 'USA', team2: 'PAR', matchday: 1, date: parseDate('Fri 12 June'), venue: venueToCityId['Los Angeles'], matchNumber: 4 },
      { id: 'D2', team1: 'AUS', team2: ['TUR', 'ROU', 'SVK', 'KOS'], matchday: 1, date: parseDate('Sat 13 June'), venue: venueToCityId['Vancouver'], matchNumber: 6 },
      { id: 'D3', team1: 'USA', team2: 'AUS', matchday: 2, date: parseDate('Fri 19 June'), venue: venueToCityId['Seattle'], matchNumber: 32 },
      { id: 'D4', team1: ['TUR', 'ROU', 'SVK', 'KOS'], team2: 'PAR', matchday: 2, date: parseDate('Fri 19 June'), venue: venueToCityId['San Francisco'], matchNumber: 31 },
      { id: 'D5', team1: ['TUR', 'ROU', 'SVK', 'KOS'], team2: 'USA', matchday: 3, date: parseDate('Thu 25 June'), venue: venueToCityId['Los Angeles'], matchNumber: 59 },
      { id: 'D6', team1: 'PAR', team2: 'AUS', matchday: 3, date: parseDate('Thu 25 June'), venue: venueToCityId['San Francisco'], matchNumber: 60 },
    ],
  },
  E: {
    name: 'Group E',
    teams: ['GER', 'CUW', 'CIV', 'ECU'],
    matches: [
      { id: 'E1', team1: 'GER', team2: 'CUW', matchday: 1, date: parseDate('Sun 14 June'), venue: venueToCityId['Houston'], matchNumber: 10 },
      { id: 'E2', team1: 'CIV', team2: 'ECU', matchday: 1, date: parseDate('Sun 14 June'), venue: venueToCityId['Philadelphia'], matchNumber: 9 },
      { id: 'E3', team1: 'GER', team2: 'CIV', matchday: 2, date: parseDate('Sat 20 June'), venue: venueToCityId['Toronto'], matchNumber: 33 },
      { id: 'E4', team1: 'ECU', team2: 'CUW', matchday: 2, date: parseDate('Sat 20 June'), venue: venueToCityId['Kansas City'], matchNumber: 34 },
      { id: 'E5', team1: 'ECU', team2: 'GER', matchday: 3, date: parseDate('Thu 25 June'), venue: venueToCityId['New York/NJ'], matchNumber: 56 },
      { id: 'E6', team1: 'CUW', team2: 'CIV', matchday: 3, date: parseDate('Thu 25 June'), venue: venueToCityId['Philadelphia'], matchNumber: 55 },
    ],
  },
  F: {
    name: 'Group F',
    teams: ['NED', 'JPN', ['UKR', 'SWE', 'POL', 'ALB'], 'TUN'],
    matches: [
      { id: 'F1', team1: 'NED', team2: 'JPN', matchday: 1, date: parseDate('Sun 14 June'), venue: venueToCityId['Dallas'], matchNumber: 11 },
      { id: 'F2', team1: ['UKR', 'SWE', 'POL', 'ALB'], team2: 'TUN', matchday: 1, date: parseDate('Sun 14 June'), venue: venueToCityId['Monterrey'], matchNumber: 12 },
      { id: 'F3', team1: 'NED', team2: ['UKR', 'SWE', 'POL', 'ALB'], matchday: 2, date: parseDate('Sat 20 June'), venue: venueToCityId['Houston'], matchNumber: 35 },
      { id: 'F4', team1: 'TUN', team2: 'JPN', matchday: 2, date: parseDate('Sat 20 June'), venue: venueToCityId['Monterrey'], matchNumber: 36 },
      { id: 'F5', team1: 'TUN', team2: 'NED', matchday: 3, date: parseDate('Thu 25 June'), venue: venueToCityId['Kansas City'], matchNumber: 58 },
      { id: 'F6', team1: 'JPN', team2: ['UKR', 'SWE', 'POL', 'ALB'], matchday: 3, date: parseDate('Thu 25 June'), venue: venueToCityId['Dallas'], matchNumber: 57 },
    ],
  },
  G: {
    name: 'Group G',
    teams: ['BEL', 'EGY', 'IRN', 'NZL'],
    matches: [
      { id: 'G1', team1: 'BEL', team2: 'EGY', matchday: 1, date: parseDate('Mon 15 June'), venue: venueToCityId['Seattle'], matchNumber: 16 },
      { id: 'G2', team1: 'IRN', team2: 'NZL', matchday: 1, date: parseDate('Mon 15 June'), venue: venueToCityId['Los Angeles'], matchNumber: 15 },
      { id: 'G3', team1: 'BEL', team2: 'IRN', matchday: 2, date: parseDate('Sun 21 June'), venue: venueToCityId['Los Angeles'], matchNumber: 39 },
      { id: 'G4', team1: 'NZL', team2: 'EGY', matchday: 2, date: parseDate('Sun 21 June'), venue: venueToCityId['Vancouver'], matchNumber: 40 },
      { id: 'G5', team1: 'NZL', team2: 'BEL', matchday: 3, date: parseDate('Fri 26 June'), venue: venueToCityId['Vancouver'], matchNumber: 64 },
      { id: 'G6', team1: 'EGY', team2: 'IRN', matchday: 3, date: parseDate('Fri 26 June'), venue: venueToCityId['Seattle'], matchNumber: 63 },
    ],
  },
  H: {
    name: 'Group H',
    teams: ['ESP', 'CPV', 'KSA', 'URU'],
    matches: [
      { id: 'H1', team1: 'ESP', team2: 'CPV', matchday: 1, date: parseDate('Mon 15 June'), venue: venueToCityId['Atlanta'], matchNumber: 14 },
      { id: 'H2', team1: 'KSA', team2: 'URU', matchday: 1, date: parseDate('Mon 15 June'), venue: venueToCityId['Miami'], matchNumber: 13 },
      { id: 'H3', team1: 'URU', team2: 'CPV', matchday: 2, date: parseDate('Sun 21 June'), venue: venueToCityId['Miami'], matchNumber: 37 },
      { id: 'H4', team1: 'ESP', team2: 'KSA', matchday: 2, date: parseDate('Sun 21 June'), venue: venueToCityId['Atlanta'], matchNumber: 38 },
      { id: 'H5', team1: 'URU', team2: 'ESP', matchday: 3, date: parseDate('Fri 26 June'), venue: venueToCityId['Guadalajara'], matchNumber: 66 },
      { id: 'H6', team1: 'CPV', team2: 'KSA', matchday: 3, date: parseDate('Fri 26 June'), venue: venueToCityId['Houston'], matchNumber: 65 },
    ],
  },
  I: {
    name: 'Group I',
    teams: ['FRA', 'SEN', ['IRQ', 'SOL', 'SUR'], 'NOR'],
    matches: [
      { id: 'I1', team1: 'FRA', team2: 'SEN', matchday: 1, date: parseDate('Tue 16 June'), venue: venueToCityId['New York/NJ'], matchNumber: 17 },
      { id: 'I2', team1: ['IRQ', 'SOL', 'SUR'], team2: 'NOR', matchday: 1, date: parseDate('Tue 16 June'), venue: venueToCityId['Boston'], matchNumber: 18 },
      { id: 'I3', team1: 'FRA', team2: ['IRQ', 'SOL', 'SUR'], matchday: 2, date: parseDate('Mon 22 June'), venue: venueToCityId['Philadelphia'], matchNumber: 42 },
      { id: 'I4', team1: 'NOR', team2: 'SEN', matchday: 2, date: parseDate('Mon 22 June'), venue: venueToCityId['New York/NJ'], matchNumber: 41 },
      { id: 'I5', team1: 'NOR', team2: 'FRA', matchday: 3, date: parseDate('Fri 26 June'), venue: venueToCityId['Boston'], matchNumber: 61 },
      { id: 'I6', team1: 'SEN', team2: ['IRQ', 'SOL', 'SUR'], matchday: 3, date: parseDate('Fri 26 June'), venue: venueToCityId['Toronto'], matchNumber: 62 },
    ],
  },
  J: {
    name: 'Group J',
    teams: ['ARG', 'ALG', 'AUT', 'JOR'],
    matches: [
      { id: 'J1', team1: 'ARG', team2: 'ALG', matchday: 1, date: parseDate('Tue 16 June'), venue: venueToCityId['Kansas City'], matchNumber: 19 },
      { id: 'J2', team1: 'AUT', team2: 'JOR', matchday: 1, date: parseDate('Tue 16 June'), venue: venueToCityId['San Francisco'], matchNumber: 20 },
      { id: 'J3', team1: 'ARG', team2: 'AUT', matchday: 2, date: parseDate('Mon 22 June'), venue: venueToCityId['Dallas'], matchNumber: 43 },
      { id: 'J4', team1: 'JOR', team2: 'ALG', matchday: 2, date: parseDate('Mon 22 June'), venue: venueToCityId['San Francisco'], matchNumber: 44 },
      { id: 'J5', team1: 'JOR', team2: 'ARG', matchday: 3, date: parseDate('Sat 27 June'), venue: venueToCityId['Dallas'], matchNumber: 70 },
      { id: 'J6', team1: 'ALG', team2: 'AUT', matchday: 3, date: parseDate('Sat 27 June'), venue: venueToCityId['Kansas City'], matchNumber: 69 },
    ],
  },
  K: {
    name: 'Group K',
    teams: ['POR', ['COD', 'JAM', 'NCL'], 'UZB', 'COL'],
    matches: [
      { id: 'K1', team1: 'POR', team2: ['COD', 'JAM', 'NCL'], matchday: 1, date: parseDate('Wed 17 June'), venue: venueToCityId['Houston'], matchNumber: 23 },
      { id: 'K2', team1: 'UZB', team2: 'COL', matchday: 1, date: parseDate('Wed 17 June'), venue: venueToCityId['Mexico City'], matchNumber: 24 },
      { id: 'K3', team1: 'POR', team2: 'UZB', matchday: 2, date: parseDate('Tue 23 June'), venue: venueToCityId['Houston'], matchNumber: 47 },
      { id: 'K4', team1: ['COD', 'JAM', 'NCL'], team2: 'COL', matchday: 2, date: parseDate('Tue 23 June'), venue: venueToCityId['Guadalajara'], matchNumber: 48 },
      { id: 'K5', team1: 'COL', team2: 'POR', matchday: 3, date: parseDate('Sat 27 June'), venue: venueToCityId['Miami'], matchNumber: 71 },
      { id: 'K6', team1: ['COD', 'JAM', 'NCL'], team2: 'UZB', matchday: 3, date: parseDate('Sat 27 June'), venue: venueToCityId['Atlanta'], matchNumber: 72 },
    ],
  },
  L: {
    name: 'Group L',
    teams: ['ENG', 'CRO', 'GHA', 'PAN'],
    matches: [
      { id: 'L1', team1: 'ENG', team2: 'CRO', matchday: 1, date: parseDate('Wed 17 June'), venue: venueToCityId['Dallas'], matchNumber: 21 },
      { id: 'L2', team1: 'GHA', team2: 'PAN', matchday: 1, date: parseDate('Wed 17 June'), venue: venueToCityId['Toronto'], matchNumber: 22 },
      { id: 'L3', team1: 'ENG', team2: 'GHA', matchday: 2, date: parseDate('Tue 23 June'), venue: venueToCityId['Boston'], matchNumber: 45 },
      { id: 'L4', team1: 'PAN', team2: 'CRO', matchday: 2, date: parseDate('Tue 23 June'), venue: venueToCityId['Toronto'], matchNumber: 46 },
      { id: 'L5', team1: 'PAN', team2: 'ENG', matchday: 3, date: parseDate('Sat 27 June'), venue: venueToCityId['New York/NJ'], matchNumber: 67 },
      { id: 'L6', team1: 'CRO', team2: 'GHA', matchday: 3, date: parseDate('Sat 27 June'), venue: venueToCityId['Philadelphia'], matchNumber: 68 },
    ],
  },
};

export const getGroup = (groupId) => groups[groupId] || null;

export const getAllGroups = () => Object.entries(groups).map(([id, group]) => ({ id, ...group }));

export default groups;
