// International tournament knockout stage structure
// 32 teams qualify from group stage (top 2 from each group + 8 best 3rd place)

import { parseDate, venueToCityId } from './matchHelpers';

export const knockoutRounds = {
  ROUND_OF_32: 'round_of_32',
  ROUND_OF_16: 'round_of_16',
  QUARTER_FINALS: 'quarter_finals',
  SEMI_FINALS: 'semi_finals',
  THIRD_PLACE: 'third_place',
  FINAL: 'final',
};

export const roundNames = {
  [knockoutRounds.ROUND_OF_32]: 'Round of 32',
  [knockoutRounds.ROUND_OF_16]: 'Round of 16',
  [knockoutRounds.QUARTER_FINALS]: 'Quarter-Finals',
  [knockoutRounds.SEMI_FINALS]: 'Semi-Finals',
  [knockoutRounds.THIRD_PLACE]: 'Third Place',
  [knockoutRounds.FINAL]: 'Final',
};

// Initial bracket structure - teams will be populated after group stage
export const createInitialBracket = () => ({
  [knockoutRounds.ROUND_OF_32]: [
    { id: 'R32_1', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Runner-up A vs Runner-up B', date: parseDate('Sun 28 June'), venue: venueToCityId['Los Angeles'], matchNumber: 73 },
    { id: 'R32_2', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner E vs 3rd A/B/C/D/F', date: parseDate('Mon 29 June'), venue: venueToCityId['Boston'], matchNumber: 74 },
    { id: 'R32_3', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner F vs Runner-up C', date: parseDate('Mon 29 June'), venue: venueToCityId['Monterrey'], matchNumber: 75 },
    { id: 'R32_4', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner C vs Runner-up F', date: parseDate('Mon 29 June'), venue: venueToCityId['Houston'], matchNumber: 76 },
    { id: 'R32_5', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner I vs 3rd C/D/F/G/H', date: parseDate('Tue 30 June'), venue: venueToCityId['New York/NJ'], matchNumber: 77 },
    { id: 'R32_6', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Runner-up E vs Runner-up I', date: parseDate('Tue 30 June'), venue: venueToCityId['Dallas'], matchNumber: 78 },
    { id: 'R32_7', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner A vs 3rd C/E/F/H/I', date: parseDate('Tue 30 June'), venue: venueToCityId['Mexico City'], matchNumber: 79 },
    { id: 'R32_8', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner L vs 3rd E/H/I/J/K', date: parseDate('Wed 1 July'), venue: venueToCityId['Atlanta'], matchNumber: 80 },
    { id: 'R32_9', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner D vs 3rd B/E/F/I/J', date: parseDate('Wed 1 July'), venue: venueToCityId['San Francisco'], matchNumber: 81 },
    { id: 'R32_10', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner G vs 3rd A/E/H/I/J', date: parseDate('Wed 1 July'), venue: venueToCityId['Seattle'], matchNumber: 82 },
    { id: 'R32_11', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Runner-up K vs Runner-up L', date: parseDate('Thu 2 July'), venue: venueToCityId['Toronto'], matchNumber: 83 },
    { id: 'R32_12', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner H vs Runner-up J', date: parseDate('Thu 2 July'), venue: venueToCityId['Los Angeles'], matchNumber: 84 },
    { id: 'R32_13', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner B vs 3rd E/F/G/I/J', date: parseDate('Thu 2 July'), venue: venueToCityId['Vancouver'], matchNumber: 85 },
    { id: 'R32_14', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner J vs Runner-up H', date: parseDate('Fri 3 July'), venue: venueToCityId['Miami'], matchNumber: 86 },
    { id: 'R32_15', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Winner K vs 3rd D/E/I/J/L', date: parseDate('Fri 3 July'), venue: venueToCityId['Kansas City'], matchNumber: 87 },
    { id: 'R32_16', team1: null, team2: null, winner: null, score1: null, score2: null, 
      label: 'Runner-up D vs Runner-up G', date: parseDate('Fri 3 July'), venue: venueToCityId['Dallas'], matchNumber: 88 },
  ],
  [knockoutRounds.ROUND_OF_16]: [
    { id: 'R16_1', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_2', 'R32_5'], date: parseDate('Sat 4 July'), venue: venueToCityId['Philadelphia'], matchNumber: 89 },
    { id: 'R16_2', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_1', 'R32_4'], date: parseDate('Sat 4 July'), venue: venueToCityId['Houston'], matchNumber: 90 },
    { id: 'R16_3', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_3', 'R32_6'], date: parseDate('Sun 5 July'), venue: venueToCityId['New York/NJ'], matchNumber: 91 },
    { id: 'R16_4', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_7', 'R32_8'], date: parseDate('Sun 5 July'), venue: venueToCityId['Mexico City'], matchNumber: 92 },
    { id: 'R16_5', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_11', 'R32_12'], date: parseDate('Mon 6 July'), venue: venueToCityId['Dallas'], matchNumber: 93 },
    { id: 'R16_6', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_9', 'R32_10'], date: parseDate('Mon 6 July'), venue: venueToCityId['Seattle'], matchNumber: 94 },
    { id: 'R16_7', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_14', 'R32_16'], date: parseDate('Tue 7 July'), venue: venueToCityId['Atlanta'], matchNumber: 95 },
    { id: 'R16_8', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R32_13', 'R32_15'], date: parseDate('Tue 7 July'), venue: venueToCityId['Vancouver'], matchNumber: 96 },
  ],
  [knockoutRounds.QUARTER_FINALS]: [
    { id: 'QF_1', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R16_1', 'R16_2'], date: parseDate('Thu 9 July'), venue: venueToCityId['Boston'], matchNumber: 97 },
    { id: 'QF_2', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R16_5', 'R16_6'], date: parseDate('Fri 10 July'), venue: venueToCityId['Los Angeles'], matchNumber: 98 },
    { id: 'QF_3', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R16_3', 'R16_4'], date: parseDate('Sat 11 July'), venue: venueToCityId['Miami'], matchNumber: 99 },
    { id: 'QF_4', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['R16_7', 'R16_8'], date: parseDate('Sat 11 July'), venue: venueToCityId['Kansas City'], matchNumber: 100 },
  ],
  [knockoutRounds.SEMI_FINALS]: [
    { id: 'SF_1', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['QF_1', 'QF_2'], date: parseDate('Tue 14 July'), venue: venueToCityId['Dallas'], matchNumber: 101 },
    { id: 'SF_2', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['QF_3', 'QF_4'], date: parseDate('Wed 15 July'), venue: venueToCityId['Atlanta'], matchNumber: 102 },
  ],
  [knockoutRounds.THIRD_PLACE]: [
    { id: 'TP', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsLosersFrom: ['SF_1', 'SF_2'], date: parseDate('Sat 18 July'), venue: venueToCityId['Miami'], matchNumber: 103 },
  ],
  [knockoutRounds.FINAL]: [
    { id: 'F', team1: null, team2: null, winner: null, score1: null, score2: null, 
      feedsFrom: ['SF_1', 'SF_2'], date: parseDate('Sun 19 July'), venue: venueToCityId['New York/NJ'], matchNumber: 104 },
  ],
});

export default knockoutRounds;
