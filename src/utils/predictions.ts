// Prediction utilities - run multiple simulations to predict match outcomes

import { groups } from '../data/groups';
import { createInitialBracket, knockoutRounds } from '../data/bracket';
import {
  simulateGroupMatch,
  simulateKnockoutMatch,
  calculateGroupStandings,
  getGroupQualifiers,
  simulateRoundRobinQualifier,
} from './simulator';
import { parseMatchLabel } from './bracketSeeding';

// Helper to resolve arrays to selected teams (same as in TournamentContext)
const resolveTeam = (teamOrArray, groupId, selectedTeams, undecidedTeams) => {
  if (!Array.isArray(teamOrArray)) {
    return teamOrArray;
  }
  
  const group = groups[groupId];
  let teamIndex = -1;
  const sortedArray = [...teamOrArray].sort();
  
  for (let i = 0; i < group.teams.length; i++) {
    if (Array.isArray(group.teams[i])) {
      const sortedGroupArray = [...group.teams[i]].sort();
      if (JSON.stringify(sortedArray) === JSON.stringify(sortedGroupArray)) {
        teamIndex = i;
        break;
      }
    }
  }
  
  if (teamIndex === -1) return teamOrArray;
  const key = `${groupId}_team_${teamIndex}`;
  return selectedTeams[key] || teamOrArray;
};

// Helper to advance winner to next round (same as in TournamentContext)
const advanceWinner = (bracket, currentRound, matchIndex, winner) => {
  const newBracket = JSON.parse(JSON.stringify(bracket));
  
  const roundOrder = [
    knockoutRounds.ROUND_OF_32,
    knockoutRounds.ROUND_OF_16,
    knockoutRounds.QUARTER_FINALS,
    knockoutRounds.SEMI_FINALS,
    knockoutRounds.FINAL,
  ];
  
  const currentRoundIndex = roundOrder.indexOf(currentRound);
  if (currentRoundIndex === -1 || currentRoundIndex >= roundOrder.length - 1) {
    return newBracket;
  }
  
  const nextRound = roundOrder[currentRoundIndex + 1];
  const nextMatchIndex = Math.floor(matchIndex / 2);
  const isFirstTeam = matchIndex % 2 === 0;
  
  if (newBracket[nextRound] && newBracket[nextRound][nextMatchIndex]) {
    if (isFirstTeam) {
      newBracket[nextRound][nextMatchIndex].team1 = winner;
    } else {
      newBracket[nextRound][nextMatchIndex].team2 = winner;
    }
  }
  
  // Handle Third Place match
  if (currentRound === knockoutRounds.SEMI_FINALS) {
    const semiMatch = newBracket[knockoutRounds.SEMI_FINALS][matchIndex];
    const loser = semiMatch.team1 === winner ? semiMatch.team2 : semiMatch.team1;
    
    if (newBracket[knockoutRounds.THIRD_PLACE] && newBracket[knockoutRounds.THIRD_PLACE][0]) {
      const thirdPlaceMatch = newBracket[knockoutRounds.THIRD_PLACE][0];
      if (matchIndex === 0) {
        thirdPlaceMatch.team1 = loser;
      } else if (matchIndex === 1) {
        thirdPlaceMatch.team2 = loser;
      }
    }
  }
  
  return newBracket;
};

// Run a single tournament simulation and return all match results
const runSingleSimulation = (selectedTeams, undecidedTeams) => {
  // Simulate qualifiers
  const resolvedSelectedTeams = { ...selectedTeams };
  Object.entries(undecidedTeams).forEach(([key, info]) => {
    if (!resolvedSelectedTeams[key] && info.options.length > 0) {
      const winner = simulateRoundRobinQualifier(info.options);
      if (winner) {
        resolvedSelectedTeams[key] = winner;
      }
    }
  });
  
  // Simulate groups
  const groupResults = {};
  const groupStandings = {};
  
  Object.entries(groups).forEach(([groupId, group]) => {
    groupResults[groupId] = group.matches.map(match => {
      const team1 = resolveTeam(match.team1, groupId, resolvedSelectedTeams, undecidedTeams);
      const team2 = resolveTeam(match.team2, groupId, resolvedSelectedTeams, undecidedTeams);
      
      if (Array.isArray(team1) || Array.isArray(team2)) {
        return { ...match, score1: null, score2: null, winner: null, played: false };
      }
      
      const result = simulateGroupMatch(team1, team2);
      if (!result) {
        return { ...match, score1: null, score2: null, winner: null, played: false };
      }
      return { ...match, ...result, played: true };
    });
    
    const groupTeams = group.teams.map(t => 
      resolveTeam(t, groupId, resolvedSelectedTeams, undecidedTeams)
    );
    groupStandings[groupId] = calculateGroupStandings(groupResults[groupId], groupTeams);
  });
  
  // Advance to knockout
  const qualifiers = getGroupQualifiers(groupStandings);
  let bracket = createInitialBracket();
  const r32 = bracket[knockoutRounds.ROUND_OF_32];
  
  r32.forEach((match, index) => {
    if (match.label) {
      const { team1, team2 } = parseMatchLabel(match.label, qualifiers, groupStandings);
      r32[index] = { ...match, team1, team2 };
    }
  });
  
  // Simulate all knockout rounds
  const knockoutRoundOrder = [
    knockoutRounds.ROUND_OF_32,
    knockoutRounds.ROUND_OF_16,
    knockoutRounds.QUARTER_FINALS,
    knockoutRounds.SEMI_FINALS,
    knockoutRounds.FINAL,
  ];
  
  knockoutRoundOrder.forEach(round => {
    bracket[round] = bracket[round].map((match, index) => {
      if (!match.team1 || !match.team2) return match;
      const result = simulateKnockoutMatch(match.team1, match.team2);
      return { ...match, ...result };
    });
    
    bracket[round].forEach((match, index) => {
      if (match.winner) {
        bracket = advanceWinner(bracket, round, index, match.winner);
      }
    });
  });
  
  // Simulate Third Place match
  if (bracket[knockoutRounds.THIRD_PLACE] && bracket[knockoutRounds.THIRD_PLACE][0]) {
    const thirdPlaceMatch = bracket[knockoutRounds.THIRD_PLACE][0];
    if (thirdPlaceMatch.team1 && thirdPlaceMatch.team2) {
      const result = simulateKnockoutMatch(thirdPlaceMatch.team1, thirdPlaceMatch.team2);
      bracket[knockoutRounds.THIRD_PLACE][0] = { ...thirdPlaceMatch, ...result };
    }
  }
  
  return { groupResults, bracket };
};

// Run 100 simulations and aggregate predictions
export const generatePredictions = async (selectedTeams, undecidedTeams, onProgress) => {
  const predictions = {
    groupMatches: {},
    knockoutMatches: {},
  };
  
  const NUM_SIMULATIONS = 1000;
  console.log(`Starting ${NUM_SIMULATIONS} simulations...`);
  
  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    try {
      const { groupResults, bracket } = runSingleSimulation(selectedTeams, undecidedTeams);
      
      // Update progress and allow UI to render
      if (onProgress) {
        onProgress(i + 1, NUM_SIMULATIONS);
      }
      
      // Allow UI to update every few simulations
      if ((i + 1) % 5 === 0 || i === NUM_SIMULATIONS - 1) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Debug: Check a specific match after first few simulations
      if (i < 3) {
        const testMatch = groupResults['G']?.find(m => m.id === 'G4' || m.matchNumber === 42);
        if (testMatch) {
          console.log(`Simulation ${i + 1}: Match G4 (matchNumber 42) winner:`, testMatch.winner, 'score:', testMatch.score1, '-', testMatch.score2, 'team1:', testMatch.team1, 'team2:', testMatch.team2);
        }
      }
      
      // Aggregate group match results
      Object.entries(groupResults).forEach(([groupId, matches]) => {
        matches.forEach(match => {
          const matchKey = `${groupId}_${match.id}`;
          if (!predictions.groupMatches[matchKey]) {
            predictions.groupMatches[matchKey] = {
              matchId: match.id,
              groupId,
              team1: null,
              team2: null,
              team1Appearances: {},
              team2Appearances: {},
              winners: {},
              draws: 0,
              team1Wins: 0,
              team2Wins: 0,
            };
          }
          
          const pred = predictions.groupMatches[matchKey];
          
          // For group matches, teams are fixed, so track them once
          if (match.team1 && !Array.isArray(match.team1)) {
            if (!pred.team1) pred.team1 = match.team1;
            pred.team1Appearances[match.team1] = (pred.team1Appearances[match.team1] || 0) + 1;
          }
          if (match.team2 && !Array.isArray(match.team2)) {
            if (!pred.team2) pred.team2 = match.team2;
            pred.team2Appearances[match.team2] = (pred.team2Appearances[match.team2] || 0) + 1;
          }
          
          // Track win probabilities for each team
          if (match.winner) {
            pred.winners[match.winner] = (pred.winners[match.winner] || 0) + 1;
          } else if (match.score1 === match.score2 && match.score1 !== null && match.score1 !== undefined) {
            pred.draws += 1;
          }
          
          // Track win probability for team1 and team2 specifically
          if (match.team1 && !Array.isArray(match.team1) && match.winner === match.team1) {
            pred.team1Wins = (pred.team1Wins || 0) + 1;
          }
          if (match.team2 && !Array.isArray(match.team2) && match.winner === match.team2) {
            pred.team2Wins = (pred.team2Wins || 0) + 1;
          }
          
          // Debug: Track a specific match (G4 is EGY vs NZL, matchNumber 42)
          if ((match.id === 'G4' || match.matchNumber === 42) && groupId === 'G') {
            if (i < 3 || i === NUM_SIMULATIONS - 1) {
              console.log(`  Simulation ${i + 1}: Match G4 - team1=${match.team1}, team2=${match.team2}, winner=${match.winner}, team1Wins=${pred.team1Wins}, team2Wins=${pred.team2Wins}, draws=${pred.draws}`);
            }
          }
        });
      });
      
      // Aggregate knockout match results
      Object.entries(bracket).forEach(([round, matches]) => {
        matches.forEach(match => {
          // Use the round key directly (e.g., 'round_of_32', 'round_of_16', etc.)
          const matchKey = `${round}_${match.id}`;
          if (!predictions.knockoutMatches[matchKey]) {
            predictions.knockoutMatches[matchKey] = {
              matchId: match.id,
              round,
              team1Appearances: {},
              team2Appearances: {},
              winners: {},
            };
          }
          
          const pred = predictions.knockoutMatches[matchKey];
          
          // Track team1 appearances (even if null/undefined, we still want to track)
          if (match.team1 && typeof match.team1 === 'string') {
            pred.team1Appearances[match.team1] = (pred.team1Appearances[match.team1] || 0) + 1;
          }
          
          // Track team2 appearances
          if (match.team2 && typeof match.team2 === 'string') {
            pred.team2Appearances[match.team2] = (pred.team2Appearances[match.team2] || 0) + 1;
          }
          
          // Track winners
          if (match.winner && typeof match.winner === 'string') {
            pred.winners[match.winner] = (pred.winners[match.winner] || 0) + 1;
          }
          
          // Debug: Log final match specifically
          if (round === 'final' && match.id === 'F' && i < 3) {
            console.log(`  Simulation ${i + 1}: Final match - team1=${match.team1}, team2=${match.team2}, winner=${match.winner}`);
            console.log(`    Match key: ${matchKey}`);
            console.log(`    Current team1Appearances:`, Object.keys(pred.team1Appearances).length, 'teams');
            console.log(`    Current team2Appearances:`, Object.keys(pred.team2Appearances).length, 'teams');
            console.log(`    Current winners:`, Object.keys(pred.winners).length, 'teams');
          }
        });
      });
    } catch (error) {
      console.error(`Error in simulation ${i + 1}:`, error);
      // Continue with next simulation even if one fails
    }
  }
  
  console.log(`Completed ${NUM_SIMULATIONS} simulations. Aggregating results...`);
  console.log(`Total group matches found:`, Object.keys(predictions.groupMatches).length);
  
  // Convert counts to percentages
  Object.keys(predictions.groupMatches).forEach(key => {
    const pred = predictions.groupMatches[key];
    Object.keys(pred.team1Appearances).forEach(team => {
      pred.team1Appearances[team] = (pred.team1Appearances[team] / NUM_SIMULATIONS) * 100;
    });
    Object.keys(pred.team2Appearances).forEach(team => {
      pred.team2Appearances[team] = (pred.team2Appearances[team] / NUM_SIMULATIONS) * 100;
    });
    Object.keys(pred.winners).forEach(team => {
      pred.winners[team] = (pred.winners[team] / NUM_SIMULATIONS) * 100;
    });
    pred.draws = (pred.draws / NUM_SIMULATIONS) * 100;
    
    // Calculate win probabilities for team1 and team2
    // Use the raw counts, not undefined check
    pred.team1WinProbability = ((pred.team1Wins || 0) / NUM_SIMULATIONS) * 100;
    pred.team2WinProbability = ((pred.team2Wins || 0) / NUM_SIMULATIONS) * 100;
    
    // Debug: Log match G4 specifically (matchNumber 42, EGY vs NZL)
    if (key === 'G_G4') {
      console.log(`Final Match G_G4 (matchNumber 42): team1=${pred.team1}, team2=${pred.team2}, team1Wins=${pred.team1Wins}, team2Wins=${pred.team2Wins}, draws=${pred.draws}, total=${NUM_SIMULATIONS}`);
      console.log(`  team1WinProbability=${pred.team1WinProbability}%, team2WinProbability=${pred.team2WinProbability}%`);
      console.log(`  winners object:`, pred.winners);
    }
  });
  
  Object.keys(predictions.knockoutMatches).forEach(key => {
    const pred = predictions.knockoutMatches[key];
    Object.keys(pred.team1Appearances).forEach(team => {
      pred.team1Appearances[team] = (pred.team1Appearances[team] / NUM_SIMULATIONS) * 100;
    });
    Object.keys(pred.team2Appearances).forEach(team => {
      pred.team2Appearances[team] = (pred.team2Appearances[team] / NUM_SIMULATIONS) * 100;
    });
    Object.keys(pred.winners).forEach(team => {
      pred.winners[team] = (pred.winners[team] / NUM_SIMULATIONS) * 100;
    });
  });
  
  // Final debug: Check G_G4 one more time
  const finalMatch = predictions.groupMatches['G_G4'];
  if (finalMatch) {
    console.log(`\n=== FINAL PREDICTION FOR G_G4 ===`);
    console.log(`team1: ${finalMatch.team1}, team2: ${finalMatch.team2}`);
    console.log(`team1Wins: ${finalMatch.team1Wins} out of ${NUM_SIMULATIONS}`);
    console.log(`team2Wins: ${finalMatch.team2Wins} out of ${NUM_SIMULATIONS}`);
    console.log(`draws: ${finalMatch.draws} out of ${NUM_SIMULATIONS}`);
    console.log(`team1WinProbability: ${finalMatch.team1WinProbability}%`);
    console.log(`team2WinProbability: ${finalMatch.team2WinProbability}%`);
    console.log(`Total should be: ${finalMatch.team1Wins + finalMatch.team2Wins + finalMatch.draws} (should be ${NUM_SIMULATIONS})`);
  } else {
    console.log(`WARNING: G_G4 prediction not found! Available keys:`, Object.keys(predictions.groupMatches).slice(0, 10));
  }
  
  // Debug: Check final match
  const finalPrediction = predictions.knockoutMatches['final_F'];
  if (finalPrediction) {
    console.log(`\n=== FINAL MATCH PREDICTION ===`);
    console.log(`Match key: final_F`);
    console.log(`team1Appearances: ${Object.keys(finalPrediction.team1Appearances).length} unique teams`);
    console.log(`team2Appearances: ${Object.keys(finalPrediction.team2Appearances).length} unique teams`);
    console.log(`winners: ${Object.keys(finalPrediction.winners).length} unique teams`);
    console.log(`Top 5 team1 appearances:`, Object.entries(finalPrediction.team1Appearances).sort(([, a], [, b]) => b - a).slice(0, 5));
    console.log(`Top 5 team2 appearances:`, Object.entries(finalPrediction.team2Appearances).sort(([, a], [, b]) => b - a).slice(0, 5));
    console.log(`Top 5 winners:`, Object.entries(finalPrediction.winners).sort(([, a], [, b]) => b - a).slice(0, 5));
  } else {
    console.log(`WARNING: final_F prediction not found! Available knockout keys:`, Object.keys(predictions.knockoutMatches).slice(0, 10));
  }
  
  return predictions;
};
