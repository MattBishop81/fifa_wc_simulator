// Match Simulation Engine
// Uses FIFA totalPoints to calculate win probabilities and generate realistic results

import { teams } from '../data/teams';

/**
 * Calculate win probability for team A based on FIFA totalPoints
 * @param {number} pointsA - FIFA totalPoints of team A (higher is better)
 * @param {number} pointsB - FIFA totalPoints of team B
 * @returns {number} - Probability of team A winning (0-1)
 */
export const calculateWinProbability = (pointsA, pointsB) => {
  const diff = pointsA - pointsB; // positive means team A is better
  // Scale probability between 0.20 and 0.90 based on points difference
  // Using 300 as scale factor (more sensitive): 300 point difference = 1.0 probability (clamped)
  // This makes stronger teams win more consistently
  const probability = 0.5 + (diff / 300);
  return Math.max(0.20, Math.min(0.90, probability));
};

/**
 * Generate a realistic scoreline based on team strengths
 * @param {number} pointsA - FIFA totalPoints of team A
 * @param {number} pointsB - FIFA totalPoints of team B
 * @returns {Object} - { goalsA, goalsB }
 */
export const generateScore = (pointsA, pointsB) => {
  // Normalize points to strength (1-5 range)
  // Points range approximately 1039-1877, so map to strength 1-5
  const minPoints = 1039;
  const maxPoints = 1877;
  const pointsRange = maxPoints - minPoints;
  
  const strengthA = 1 + ((pointsA - minPoints) / pointsRange) * 4;
  const strengthB = 1 + ((pointsB - minPoints) / pointsRange) * 4;
  
  // Calculate expected goals based on strength (more deterministic)
  // Base expected goals: strength * 0.6 (slightly higher for more goals)
  const expectedGoalsA = strengthA * 0.6;
  const expectedGoalsB = strengthB * 0.6;
  
  // Add deterministic component based on strength difference
  const strengthDiff = strengthA - strengthB;
  const deterministicBoostA = Math.max(0, strengthDiff * 0.3);
  const deterministicBoostB = Math.max(0, -strengthDiff * 0.3);
  
  // Generate goals with more randomness for predictions (50% deterministic, 50% random)
  // Use higher randomness to get more varied results across multiple simulations
  const goalsA = generateGoalsDeterministic(expectedGoalsA + deterministicBoostA, 0.5);
  const goalsB = generateGoalsDeterministic(expectedGoalsB + deterministicBoostB, 0.5);
  
  return { goalsA, goalsB };
};

/**
 * Generate number of goals based on expected goals with reduced randomness
 * @param {number} expectedGoals - Expected number of goals
 * @param {number} randomnessFactor - Factor controlling randomness (0-1, lower = less random)
 * @returns {number} - Number of goals (0-6)
 */
const generateGoalsDeterministic = (expectedGoals, randomnessFactor = 0.3) => {
  // Base deterministic value (rounded expected goals)
  const deterministicValue = Math.round(expectedGoals);
  
  // Add small random variation scaled by randomness factor
  const randomVariation = (Math.random() - 0.5) * 2 * randomnessFactor;
  const finalValue = deterministicValue + randomVariation;
  
  // Round to nearest integer and clamp to valid range
  let goals = Math.round(finalValue);
  
  // Ensure goals stay within reasonable bounds
  goals = Math.max(0, Math.min(6, goals));
  
  return goals;
};

/**
 * Simulate a group stage match (can end in draw)
 * @param {string|Array} team1Code - Team 1 code or array of possible teams
 * @param {string|Array} team2Code - Team 2 code or array of possible teams
 * @returns {Object|null} - Match result or null if teams are undecided
 */
export const simulateGroupMatch = (team1Code, team2Code) => {
  // Cannot simulate if either team is undecided (array)
  if (Array.isArray(team1Code) || Array.isArray(team2Code)) {
    return null;
  }
  
  const team1 = teams[team1Code];
  const team2 = teams[team2Code];
  
  if (!team1 || !team2) {
    console.error('Invalid team codes:', team1Code, team2Code);
    return null;
  }
  
  // Calculate win probability
  const winProbTeam1 = calculateWinProbability(team1.totalPoints, team2.totalPoints);
  
  // Use probability-based outcome with more randomness
  const random = Math.random();
  
  // Determine outcome based on probability
  let winner = null;
  let goalsA, goalsB;
  
  if (random < winProbTeam1) {
    // Team 1 wins - generate scores where team1 scores more
    const { goalsA: gA, goalsB: gB } = generateScore(team1.totalPoints, team2.totalPoints);
    // Ensure team1 wins (add small boost if needed)
    if (gA > gB) {
      goalsA = gA;
      goalsB = gB;
    } else {
      goalsA = gB + 1; // Ensure team1 wins
      goalsB = gB;
    }
    winner = team1Code;
  } else if (random < winProbTeam1 + (1 - winProbTeam1) * 0.15) {
    // Draw (15% chance of draw when not team1 win)
    const { goalsA: gA, goalsB: gB } = generateScore(team1.totalPoints, team2.totalPoints);
    const avgGoals = Math.round((gA + gB) / 2);
    goalsA = avgGoals;
    goalsB = avgGoals;
    winner = null; // Draw
  } else {
    // Team 2 wins
    const { goalsA: gA, goalsB: gB } = generateScore(team2.totalPoints, team1.totalPoints);
    // Swap since we calculated with team2 as team1
    goalsA = gB;
    goalsB = gA;
    // Ensure team2 wins
    if (goalsB <= goalsA) {
      goalsB = goalsA + 1;
    }
    winner = team2Code;
  }
  
  // Clamp goals to reasonable range
  goalsA = Math.max(0, Math.min(6, goalsA));
  goalsB = Math.max(0, Math.min(6, goalsB));
  
  return {
    team1: team1Code,
    team2: team2Code,
    score1: goalsA,
    score2: goalsB,
    winner,
    isDraw: goalsA === goalsB,
  };
};

/**
 * Simulate a knockout match (must have a winner)
 * @param {string|Array} team1Code - Team 1 code or array of possible teams
 * @param {string|Array} team2Code - Team 2 code or array of possible teams
 * @returns {Object|null} - Match result with winner or null if teams are undecided
 */
export const simulateKnockoutMatch = (team1Code, team2Code) => {
  // Cannot simulate if either team is undecided (array)
  if (Array.isArray(team1Code) || Array.isArray(team2Code)) {
    return null;
  }
  
  const team1 = teams[team1Code];
  const team2 = teams[team2Code];
  
  if (!team1 || !team2) {
    console.error('Invalid team codes:', team1Code, team2Code);
    return null;
  }
  
  let { goalsA, goalsB } = generateScore(team1.totalPoints, team2.totalPoints);
  
  let extraTime = false;
  let penalties = false;
  let penaltyScore = null;
  
  // If draw, go to extra time
  if (goalsA === goalsB) {
    extraTime = true;
    // Extra time - slightly modify scores
    const etRandom = Math.random();
    if (etRandom < 0.35) {
      goalsA += 1;
    } else if (etRandom < 0.70) {
      goalsB += 1;
    }
    // else still tied, go to penalties
    
    if (goalsA === goalsB) {
      penalties = true;
      // Penalty shootout - slightly favor better team (higher totalPoints)
      const winProbA = calculateWinProbability(team1.totalPoints, team2.totalPoints);
      const penA = Math.floor(Math.random() * 3) + 3; // 3-5 penalties made
      const penB = Math.floor(Math.random() * 3) + 3;
      
      if (penA === penB) {
        // Sudden death simulation
        if (Math.random() < winProbA) {
          penaltyScore = { team1: penA + 1, team2: penB };
        } else {
          penaltyScore = { team1: penA, team2: penB + 1 };
        }
      } else {
        penaltyScore = { team1: penA, team2: penB };
      }
    }
  }
  
  let winner;
  if (penalties) {
    winner = penaltyScore.team1 > penaltyScore.team2 ? team1Code : team2Code;
  } else {
    winner = goalsA > goalsB ? team1Code : team2Code;
  }
  
  return {
    team1: team1Code,
    team2: team2Code,
    score1: goalsA,
    score2: goalsB,
    winner,
    extraTime,
    penalties,
    penaltyScore,
  };
};

/**
 * Calculate group standings from match results
 * @param {Array} matches - Array of match results
 * @param {Array} teamCodes - Array of team codes in the group (can contain arrays for undecided teams)
 * @returns {Array} - Sorted standings (preserves arrays for undecided teams)
 */
export const calculateGroupStandings = (matches, teamCodes) => {
  const standings = {};
  
  // Initialize standings for each team or array of teams
  teamCodes.forEach(codeOrArray => {
    if (Array.isArray(codeOrArray)) {
      // For arrays, create a combined entry
      const arrayKey = codeOrArray.join('/');
      standings[arrayKey] = {
        code: codeOrArray, // Keep as array
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    } else {
      standings[codeOrArray] = {
        code: codeOrArray,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    }
  });
  
  // Process each match result
  matches.forEach(match => {
    if (match.score1 === null || match.score2 === null) return;
    
    // Skip matches with undecided teams (arrays)
    if (Array.isArray(match.team1) || Array.isArray(match.team2)) return;
    
    const team1 = standings[match.team1];
    const team2 = standings[match.team2];
    
    if (!team1 || !team2) return;
    
    team1.played++;
    team2.played++;
    
    team1.goalsFor += match.score1;
    team1.goalsAgainst += match.score2;
    team2.goalsFor += match.score2;
    team2.goalsAgainst += match.score1;
    
    if (match.score1 > match.score2) {
      team1.won++;
      team1.points += 3;
      team2.lost++;
    } else if (match.score2 > match.score1) {
      team2.won++;
      team2.points += 3;
      team1.lost++;
    } else {
      team1.drawn++;
      team2.drawn++;
      team1.points += 1;
      team2.points += 1;
    }
    
    team1.goalDifference = team1.goalsFor - team1.goalsAgainst;
    team2.goalDifference = team2.goalsFor - team2.goalsAgainst;
  });
  
  // Sort by: points, goal difference, goals scored
  // Arrays (undecided teams) should appear at the end with 0 points
  return Object.values(standings).sort((a, b) => {
    const aIsArray = Array.isArray(a.code);
    const bIsArray = Array.isArray(b.code);
    
    // If one is array and other isn't, array goes last
    if (aIsArray && !bIsArray) return 1;
    if (!aIsArray && bIsArray) return -1;
    
    // Both arrays or both single teams - sort normally
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
};

/**
 * Simulate a round-robin qualifier tournament
 * Each team plays every other team once, winner is determined by standings
 * @param {Array<string>} teamCodes - Array of team codes to compete
 * @returns {string|null} - Winner team code, or null if invalid
 */
export const simulateRoundRobinQualifier = (teamCodes) => {
  if (!Array.isArray(teamCodes) || teamCodes.length === 0) {
    return null;
  }
  
  // If only one team, they win by default
  if (teamCodes.length === 1) {
    return teamCodes[0];
  }
  
  // Generate all possible matchups (round-robin: each team plays every other team once)
  const matches = [];
  for (let i = 0; i < teamCodes.length; i++) {
    for (let j = i + 1; j < teamCodes.length; j++) {
      matches.push({
        team1: teamCodes[i],
        team2: teamCodes[j],
      });
    }
  }
  
  // Simulate all matches
  const matchResults = matches.map(match => {
    const result = simulateGroupMatch(match.team1, match.team2);
    if (!result) {
      // Fallback if simulation fails
      return {
        team1: match.team1,
        team2: match.team2,
        score1: 0,
        score2: 0,
        winner: null,
        isDraw: true,
      };
    }
    return result;
  });
  
  // Calculate standings
  const standings = calculateGroupStandings(matchResults, teamCodes);
  
  // Return the winner (top team)
  if (standings.length > 0 && standings[0].code) {
    return standings[0].code;
  }
  
  return null;
};

/**
 * Get qualifiers from group stage
 * Top 2 from each group + 8 best 3rd place teams
 * Preserves arrays for undecided teams
 * @param {Object} allGroupStandings - Standings for all groups
 * @returns {Object} - Qualified teams organized by position
 */
export const getGroupQualifiers = (allGroupStandings) => {
  const firstPlace = [];
  const secondPlace = [];
  const thirdPlace = [];
  
  Object.entries(allGroupStandings).forEach(([groupId, standings]) => {
    if (standings.length >= 1) {
      // First place (preserve array if it's an array)
      firstPlace.push({ ...standings[0], group: groupId });
    }
    if (standings.length >= 2) {
      // Second place (preserve array if it's an array)
      secondPlace.push({ ...standings[1], group: groupId });
    }
    if (standings.length >= 3) {
      // Third place (preserve array if it's an array)
      thirdPlace.push({ ...standings[2], group: groupId });
    }
  });
  
  // Sort third place teams and take best 8
  // Arrays (undecided teams) should be sorted to the end
  const bestThirdPlace = thirdPlace
    .sort((a, b) => {
      const aIsArray = Array.isArray(a.code);
      const bIsArray = Array.isArray(b.code);
      
      // If one is array and other isn't, array goes last
      if (aIsArray && !bIsArray) return 1;
      if (!aIsArray && bIsArray) return -1;
      
      // Both arrays or both single teams - sort normally
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    })
    .slice(0, 8);
  
  return {
    firstPlace,
    secondPlace,
    thirdPlace: bestThirdPlace,
  };
};

export default {
  calculateWinProbability,
  generateScore,
  simulateGroupMatch,
  simulateKnockoutMatch,
  calculateGroupStandings,
  getGroupQualifiers,
  simulateRoundRobinQualifier,
};
