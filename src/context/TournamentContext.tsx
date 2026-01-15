import { createContext, useContext, useReducer, useCallback } from 'react';
import { groups } from '../data/groups';
import { teams } from '../data/teams';
import { createInitialBracket, knockoutRounds } from '../data/bracket';
import {
  simulateGroupMatch,
  simulateKnockoutMatch,
  calculateGroupStandings,
  getGroupQualifiers,
  simulateRoundRobinQualifier,
} from '../utils/simulator';
import { parseMatchLabel } from '../utils/bracketSeeding';

const TournamentContext = createContext(null as any);

// Tournament phases
export const PHASES = {
  QUALIFIERS: 'qualifiers',
  GROUP_STAGE: 'group_stage',
  ROUND_OF_32: 'round_of_32',
  ROUND_OF_16: 'round_of_16',
  QUARTER_FINALS: 'quarter_finals',
  SEMI_FINALS: 'semi_finals',
  FINAL: 'final',
  COMPLETED: 'completed',
};

// Action types
const ACTIONS = {
  SIMULATE_GROUP_MATCH: 'SIMULATE_GROUP_MATCH',
  SIMULATE_GROUP: 'SIMULATE_GROUP',
  SIMULATE_ALL_GROUPS: 'SIMULATE_ALL_GROUPS',
  ADVANCE_TO_KNOCKOUT: 'ADVANCE_TO_KNOCKOUT',
  SIMULATE_KNOCKOUT_MATCH: 'SIMULATE_KNOCKOUT_MATCH',
  SIMULATE_KNOCKOUT_ROUND: 'SIMULATE_KNOCKOUT_ROUND',
  SIMULATE_ENTIRE_TOURNAMENT: 'SIMULATE_ENTIRE_TOURNAMENT',
  RESET_TOURNAMENT: 'RESET_TOURNAMENT',
  SET_MATCH_RESULT: 'SET_MATCH_RESULT',
  SELECT_UNDECIDED_TEAM: 'SELECT_UNDECIDED_TEAM',
  SIMULATE_QUALIFIERS: 'SIMULATE_QUALIFIERS',
  ADVANCE_TO_GROUP_STAGE: 'ADVANCE_TO_GROUP_STAGE',
  SET_PREDICTIONS: 'SET_PREDICTIONS',
};

// Initialize group match results
const initializeGroupResults = () => {
  const results = {};
  Object.entries(groups).forEach(([groupId, group]) => {
    results[groupId] = group.matches.map(match => ({
      ...match,
      score1: null,
      score2: null,
      winner: null,
      played: false,
    }));
  });
  return results;
};

// Helper to find all undecided team arrays and create unique keys
const findUndecidedTeams = () => {
  const undecided = {};
  Object.entries(groups).forEach(([groupId, group]) => {
    // Check teams array
    group.teams.forEach((team, index) => {
      if (Array.isArray(team)) {
        const key = `${groupId}_team_${index}`;
        undecided[key] = {
          groupId,
          type: 'team',
          index,
          options: team,
        };
      }
    });
  });
  return undecided;
};

// Initial state
const createInitialState = () => ({
  phase: PHASES.QUALIFIERS,
  groupResults: initializeGroupResults(),
  groupStandings: {},
  qualifiedTeams: null,
  bracket: createInitialBracket(),
  champion: null,
  runnerUp: null,
  thirdPlace: null,
  selectedTeams: {}, // Map of undecided team keys to selected team codes
  undecidedTeams: findUndecidedTeams(),
  predictions: null, // Store match predictions from 100 simulations
});

// Reducer
const tournamentReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SIMULATE_GROUP_MATCH: {
      const { groupId, matchIndex } = action.payload;
      const match = state.groupResults[groupId][matchIndex];
      
      if (match.played) return state;
      
      // Resolve arrays to selected teams
      const team1 = resolveTeam(match.team1, groupId, state.selectedTeams, state.undecidedTeams);
      const team2 = resolveTeam(match.team2, groupId, state.selectedTeams, state.undecidedTeams);
      
      // Cannot simulate if teams are still arrays (not selected)
      if (Array.isArray(team1) || Array.isArray(team2)) {
        return state;
      }
      
      const result = simulateGroupMatch(team1, team2);
      
      if (!result) return state; // Simulation failed
      
      const newGroupResults = {
        ...state.groupResults,
        [groupId]: state.groupResults[groupId].map((m, i) =>
          i === matchIndex
            ? { ...m, ...result, played: true }
            : m
        ),
      };
      
      // Recalculate standings for this group
      // Resolve teams array to use selected teams
      const groupTeams = groups[groupId].teams.map(t => 
        resolveTeam(t, groupId, state.selectedTeams, state.undecidedTeams)
      );
      const newStandings = {
        ...state.groupStandings,
        [groupId]: calculateGroupStandings(newGroupResults[groupId], groupTeams),
      };
      
      return {
        ...state,
        groupResults: newGroupResults,
        groupStandings: newStandings,
      };
    }
    
    case ACTIONS.SIMULATE_GROUP: {
      const { groupId } = action.payload;
      const newMatches = state.groupResults[groupId].map(match => {
        if (match.played) return match;
        
        // Resolve arrays to selected teams
        const team1 = resolveTeam(match.team1, groupId, state.selectedTeams, state.undecidedTeams);
        const team2 = resolveTeam(match.team2, groupId, state.selectedTeams, state.undecidedTeams);
        
        // Skip matches with undecided teams (still arrays)
        if (Array.isArray(team1) || Array.isArray(team2)) {
          return match;
        }
        
        const result = simulateGroupMatch(team1, team2);
        if (!result) return match; // Simulation failed
        return { ...match, ...result, played: true };
      });
      
      const newGroupResults = {
        ...state.groupResults,
        [groupId]: newMatches,
      };
      
      // Resolve teams array to use selected teams
      const groupTeams = groups[groupId].teams.map(t => 
        resolveTeam(t, groupId, state.selectedTeams, state.undecidedTeams)
      );
      const newStandings = {
        ...state.groupStandings,
        [groupId]: calculateGroupStandings(newMatches, groupTeams),
      };
      
      return {
        ...state,
        groupResults: newGroupResults,
        groupStandings: newStandings,
      };
    }
    
    case ACTIONS.SIMULATE_ALL_GROUPS: {
      const newGroupResults = {};
      const newStandings = {};
      
      Object.entries(state.groupResults).forEach(([groupId, matches]) => {
        newGroupResults[groupId] = matches.map(match => {
          if (match.played) return match;
          
          // Resolve arrays to selected teams
          const team1 = resolveTeam(match.team1, groupId, state.selectedTeams, state.undecidedTeams);
          const team2 = resolveTeam(match.team2, groupId, state.selectedTeams, state.undecidedTeams);
          
          // Skip matches with undecided teams (still arrays)
          if (Array.isArray(team1) || Array.isArray(team2)) {
            return match;
          }
          
          const result = simulateGroupMatch(team1, team2);
          if (!result) return match; // Simulation failed
          return { ...match, ...result, played: true };
        });
        
        // Resolve teams array to use selected teams
        const groupTeams = groups[groupId].teams.map(t => 
          resolveTeam(t, groupId, state.selectedTeams, state.undecidedTeams)
        );
        newStandings[groupId] = calculateGroupStandings(newGroupResults[groupId], groupTeams);
      });
      
      return {
        ...state,
        groupResults: newGroupResults,
        groupStandings: newStandings,
      };
    }
    
    case ACTIONS.ADVANCE_TO_KNOCKOUT: {
      if (Object.keys(state.groupStandings).length < 12) {
        return state; // Not all groups complete
      }
      
      const qualifiers = getGroupQualifiers(state.groupStandings);
      
      // Populate Round of 32 bracket using label parsing
      const newBracket = { ...state.bracket };
      const r32 = [...newBracket[knockoutRounds.ROUND_OF_32]];
      
      // Parse each match label to get the correct teams
      r32.forEach((match, index) => {
        if (match.label) {
          const { team1, team2 } = parseMatchLabel(match.label, qualifiers, state.groupStandings);
          r32[index] = { ...match, team1, team2 };
        }
      });
      
      newBracket[knockoutRounds.ROUND_OF_32] = r32;
      
      return {
        ...state,
        phase: PHASES.ROUND_OF_32,
        qualifiedTeams: qualifiers,
        bracket: newBracket,
      };
    }
    
    case ACTIONS.SIMULATE_KNOCKOUT_MATCH: {
      const { round, matchIndex } = action.payload;
      const match = state.bracket[round][matchIndex];
      
      if (!match.team1 || !match.team2 || match.winner) return state;
      
      const result = simulateKnockoutMatch(match.team1, match.team2);
      
      const newBracket = { ...state.bracket };
      newBracket[round] = newBracket[round].map((m, i) =>
        i === matchIndex ? { ...m, ...result } : m
      );
      
      // Advance winner to next round
      const advancedBracket = advanceWinner(newBracket, round, matchIndex, result.winner);
      
      // If semi-finals are complete, simulate Third Place match
      if (round === knockoutRounds.SEMI_FINALS) {
        const semi1 = advancedBracket[knockoutRounds.SEMI_FINALS][0];
        const semi2 = advancedBracket[knockoutRounds.SEMI_FINALS][1];
        if (semi1.winner && semi2.winner && advancedBracket[knockoutRounds.THIRD_PLACE] && advancedBracket[knockoutRounds.THIRD_PLACE][0]) {
          const thirdPlaceMatch = advancedBracket[knockoutRounds.THIRD_PLACE][0];
          if (thirdPlaceMatch.team1 && thirdPlaceMatch.team2 && !thirdPlaceMatch.winner) {
            const thirdPlaceResult = simulateKnockoutMatch(thirdPlaceMatch.team1, thirdPlaceMatch.team2);
            advancedBracket[knockoutRounds.THIRD_PLACE][0] = { ...thirdPlaceMatch, ...thirdPlaceResult };
          }
        }
      }
      
      // Check for tournament completion
      const finalMatch = advancedBracket[knockoutRounds.FINAL][0];
      let newChampion = state.champion;
      let newRunnerUp = state.runnerUp;
      let newThirdPlace = state.thirdPlace;
      let newPhase = state.phase;
      
      if (finalMatch.winner) {
        newChampion = finalMatch.winner;
        newRunnerUp = finalMatch.winner === finalMatch.team1 ? finalMatch.team2 : finalMatch.team1;
        // Get third place from Third Place match
        const thirdPlaceMatch = advancedBracket[knockoutRounds.THIRD_PLACE]?.[0];
        if (thirdPlaceMatch?.winner) {
          newThirdPlace = thirdPlaceMatch.winner;
        }
        newPhase = PHASES.COMPLETED;
      }
      
      return {
        ...state,
        bracket: advancedBracket,
        champion: newChampion,
        runnerUp: newRunnerUp,
        thirdPlace: newThirdPlace,
        phase: newPhase,
      };
    }
    
    case ACTIONS.SIMULATE_KNOCKOUT_ROUND: {
      const { round } = action.payload;
      let newBracket = { ...state.bracket };
      
      newBracket[round] = newBracket[round].map((match, index) => {
        if (!match.team1 || !match.team2 || match.winner) return match;
        const result = simulateKnockoutMatch(match.team1, match.team2);
        return { ...match, ...result };
      });
      
      // Advance all winners
      newBracket[round].forEach((match, index) => {
        if (match.winner) {
          newBracket = advanceWinner(newBracket, round, index, match.winner);
        }
      });
      
      // If semi-finals are complete, simulate Third Place match
      if (round === knockoutRounds.SEMI_FINALS) {
        const semi1 = newBracket[knockoutRounds.SEMI_FINALS][0];
        const semi2 = newBracket[knockoutRounds.SEMI_FINALS][1];
        if (semi1.winner && semi2.winner && newBracket[knockoutRounds.THIRD_PLACE] && newBracket[knockoutRounds.THIRD_PLACE][0]) {
          const thirdPlaceMatch = newBracket[knockoutRounds.THIRD_PLACE][0];
          if (thirdPlaceMatch.team1 && thirdPlaceMatch.team2 && !thirdPlaceMatch.winner) {
            const result = simulateKnockoutMatch(thirdPlaceMatch.team1, thirdPlaceMatch.team2);
            newBracket[knockoutRounds.THIRD_PLACE][0] = { ...thirdPlaceMatch, ...result };
          }
        }
      }
      
      // Check for tournament completion
      const finalMatch = newBracket[knockoutRounds.FINAL][0];
      let newChampion = state.champion;
      let newRunnerUp = state.runnerUp;
      let newThirdPlace = state.thirdPlace;
      let newPhase = getNextPhase(round);
      
      if (finalMatch.winner) {
        newChampion = finalMatch.winner;
        newRunnerUp = finalMatch.winner === finalMatch.team1 ? finalMatch.team2 : finalMatch.team1;
        // Get third place from Third Place match
        const thirdPlaceMatch = newBracket[knockoutRounds.THIRD_PLACE]?.[0];
        if (thirdPlaceMatch?.winner) {
          newThirdPlace = thirdPlaceMatch.winner;
        }
        newPhase = PHASES.COMPLETED;
      }
      
      return {
        ...state,
        bracket: newBracket,
        champion: newChampion,
        runnerUp: newRunnerUp,
        thirdPlace: newThirdPlace,
        phase: newPhase,
      };
    }
    
    case ACTIONS.SIMULATE_ENTIRE_TOURNAMENT: {
      // First simulate qualifiers if needed
      let newState = { ...state };
      
      // Simulate qualifiers (round-robin tournament)
      if (newState.phase === PHASES.QUALIFIERS) {
        const newSelectedTeams = { ...newState.selectedTeams };
        Object.entries(newState.undecidedTeams).forEach(([key, info]) => {
          if (!newSelectedTeams[key] && info.options.length > 0) {
            // Simulate round-robin tournament among the options
            const winner = simulateRoundRobinQualifier(info.options);
            if (winner) {
              newSelectedTeams[key] = winner;
            }
          }
        });
        newState.selectedTeams = newSelectedTeams;
        newState.phase = PHASES.GROUP_STAGE;
      }
      
      // Simulate groups
      const newGroupResults = {};
      const newStandings = {};
      
      Object.entries(groups).forEach(([groupId, group]) => {
        newGroupResults[groupId] = group.matches.map(match => {
          // Resolve arrays to selected teams
          const team1 = resolveTeam(match.team1, groupId, newState.selectedTeams, newState.undecidedTeams);
          const team2 = resolveTeam(match.team2, groupId, newState.selectedTeams, newState.undecidedTeams);
          
          // Skip matches with undecided teams (still arrays)
          if (Array.isArray(team1) || Array.isArray(team2)) {
            return { ...match, score1: null, score2: null, winner: null, played: false };
          }
          
          const result = simulateGroupMatch(team1, team2);
          if (!result) {
            return { ...match, score1: null, score2: null, winner: null, played: false };
          }
          return { ...match, ...result, played: true };
        });
        
        // Resolve teams array to use selected teams
        const groupTeams = group.teams.map(t => 
          resolveTeam(t, groupId, newState.selectedTeams, newState.undecidedTeams)
        );
        newStandings[groupId] = calculateGroupStandings(newGroupResults[groupId], groupTeams);
      });
      
      newState.groupResults = newGroupResults;
      newState.groupStandings = newStandings;
      
      // Advance to knockout
      const qualifiers = getGroupQualifiers(newStandings);
      
      let newBracket = createInitialBracket();
      const r32 = newBracket[knockoutRounds.ROUND_OF_32];
      
      // Populate R32 using label parsing
      r32.forEach((match, index) => {
        if (match.label) {
          const { team1, team2 } = parseMatchLabel(match.label, qualifiers, newStandings);
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
        newBracket[round] = newBracket[round].map((match, index) => {
          if (!match.team1 || !match.team2) return match;
          const result = simulateKnockoutMatch(match.team1, match.team2);
          return { ...match, ...result };
        });
        
        // Advance winners
        newBracket[round].forEach((match, index) => {
          if (match.winner) {
            newBracket = advanceWinner(newBracket, round, index, match.winner);
          }
        });
      });
      
      // Simulate Third Place match after semi-finals are complete
      if (newBracket[knockoutRounds.THIRD_PLACE] && newBracket[knockoutRounds.THIRD_PLACE][0]) {
        const thirdPlaceMatch = newBracket[knockoutRounds.THIRD_PLACE][0];
        if (thirdPlaceMatch.team1 && thirdPlaceMatch.team2) {
          const result = simulateKnockoutMatch(thirdPlaceMatch.team1, thirdPlaceMatch.team2);
          newBracket[knockoutRounds.THIRD_PLACE][0] = { ...thirdPlaceMatch, ...result };
        }
      }
      
      const finalMatch = newBracket[knockoutRounds.FINAL][0];
      const thirdPlaceMatch = newBracket[knockoutRounds.THIRD_PLACE]?.[0];
      
      return {
        ...newState,
        phase: PHASES.COMPLETED,
        qualifiedTeams: qualifiers,
        bracket: newBracket,
        champion: finalMatch.winner,
        runnerUp: finalMatch.winner === finalMatch.team1 ? finalMatch.team2 : finalMatch.team1,
        thirdPlace: thirdPlaceMatch?.winner || null,
      };
    }
    
    case ACTIONS.RESET_TOURNAMENT: {
      return createInitialState();
    }
    
    case ACTIONS.SET_PREDICTIONS: {
      return {
        ...state,
        predictions: action.payload,
      };
    }
    
    case ACTIONS.SELECT_UNDECIDED_TEAM: {
      const { key, teamCode } = action.payload;
      return {
        ...state,
        selectedTeams: {
          ...state.selectedTeams,
          [key]: teamCode,
        },
      };
    }
    
    case ACTIONS.SIMULATE_QUALIFIERS: {
      // Simulate round-robin qualifiers for each undecided team bracket
      const newSelectedTeams = { ...state.selectedTeams };
      
      Object.entries(state.undecidedTeams).forEach(([key, info]) => {
        if (!newSelectedTeams[key] && info.options.length > 0) {
          // Simulate round-robin tournament among the options
          const winner = simulateRoundRobinQualifier(info.options);
          if (winner) {
            newSelectedTeams[key] = winner;
          }
        }
      });
      
      return {
        ...state,
        selectedTeams: newSelectedTeams,
      };
    }
    
    case ACTIONS.ADVANCE_TO_GROUP_STAGE: {
      // Check if all teams are selected
      const allTeamsSelected = Object.keys(state.undecidedTeams).every(
        key => state.selectedTeams[key]
      );
      
      if (!allTeamsSelected) {
        return state; // Cannot advance if teams not selected
      }
      
      return {
        ...state,
        phase: PHASES.GROUP_STAGE,
      };
    }
    
    default:
      return state;
  }
};

// Helper to resolve arrays to selected teams
const resolveTeam = (teamOrArray, groupId, selectedTeams, undecidedTeams) => {
  if (!Array.isArray(teamOrArray)) {
    return teamOrArray;
  }
  
  // Find the key for this array by matching array contents
  const group = groups[groupId];
  let teamIndex = -1;
  
  // Sort arrays for comparison
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
  
  if (teamIndex === -1) return teamOrArray; // Fallback
  
  const key = `${groupId}_team_${teamIndex}`;
  return selectedTeams[key] || teamOrArray; // Return selected team or array if not selected
};

// Helper to get resolved groups (with arrays replaced by selected teams)
const getResolvedGroups = (selectedTeams, undecidedTeams) => {
  const resolved = {};
  Object.entries(groups).forEach(([groupId, group]) => {
    resolved[groupId] = {
      ...group,
      teams: group.teams.map(team => 
        resolveTeam(team, groupId, selectedTeams, undecidedTeams)
      ),
      matches: group.matches.map(match => ({
        ...match,
        team1: resolveTeam(match.team1, groupId, selectedTeams, undecidedTeams),
        team2: resolveTeam(match.team2, groupId, selectedTeams, undecidedTeams),
      })),
    };
  });
  return resolved;
};

// Helper to advance winner to next round
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
  
  // Handle Third Place match - populate with losers from semi-finals
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

// Get next phase
const getNextPhase = (currentRound) => {
  const phaseMap = {
    [knockoutRounds.ROUND_OF_32]: PHASES.ROUND_OF_16,
    [knockoutRounds.ROUND_OF_16]: PHASES.QUARTER_FINALS,
    [knockoutRounds.QUARTER_FINALS]: PHASES.SEMI_FINALS,
    [knockoutRounds.SEMI_FINALS]: PHASES.FINAL,
    [knockoutRounds.FINAL]: PHASES.COMPLETED,
  };
  return phaseMap[currentRound] || PHASES.GROUP_STAGE;
};

// Provider component
export const TournamentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tournamentReducer, null, createInitialState);
  
  const simulateGroupMatch = useCallback((groupId, matchIndex) => {
    dispatch({ type: ACTIONS.SIMULATE_GROUP_MATCH, payload: { groupId, matchIndex } });
  }, []);
  
  const simulateGroup = useCallback((groupId) => {
    dispatch({ type: ACTIONS.SIMULATE_GROUP, payload: { groupId } });
  }, []);
  
  const simulateAllGroups = useCallback(() => {
    dispatch({ type: ACTIONS.SIMULATE_ALL_GROUPS });
  }, []);
  
  const advanceToKnockout = useCallback(() => {
    dispatch({ type: ACTIONS.ADVANCE_TO_KNOCKOUT });
  }, []);
  
  const simulateKnockoutMatch = useCallback((round, matchIndex) => {
    dispatch({ type: ACTIONS.SIMULATE_KNOCKOUT_MATCH, payload: { round, matchIndex } });
  }, []);
  
  const simulateKnockoutRound = useCallback((round) => {
    dispatch({ type: ACTIONS.SIMULATE_KNOCKOUT_ROUND, payload: { round } });
  }, []);
  
  const simulateEntireTournament = useCallback(() => {
    dispatch({ type: ACTIONS.SIMULATE_ENTIRE_TOURNAMENT });
  }, []);
  
  const resetTournament = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_TOURNAMENT });
  }, []);
  
  const selectUndecidedTeam = useCallback((key, teamCode) => {
    dispatch({ type: ACTIONS.SELECT_UNDECIDED_TEAM, payload: { key, teamCode } });
  }, []);
  
  const simulateQualifiers = useCallback(() => {
    dispatch({ type: ACTIONS.SIMULATE_QUALIFIERS });
  }, []);
  
  const advanceToGroupStage = useCallback(() => {
    dispatch({ type: ACTIONS.ADVANCE_TO_GROUP_STAGE });
  }, []);
  
  const setPredictions = useCallback((predictions) => {
    dispatch({ type: ACTIONS.SET_PREDICTIONS, payload: predictions });
  }, []);
  
  // Get resolved groups (with qualified teams instead of arrays)
  const resolvedGroups = getResolvedGroups(state.selectedTeams, state.undecidedTeams);
  
  const value = {
    ...state,
    teams,
    groups: resolvedGroups, // Use resolved groups instead of original
    originalGroups: groups, // Keep original for reference
    simulateGroupMatch,
    simulateGroup,
    simulateAllGroups,
    advanceToKnockout,
    simulateKnockoutMatch,
    simulateKnockoutRound,
    simulateEntireTournament,
    resetTournament,
    selectUndecidedTeam,
    simulateQualifiers,
    advanceToGroupStage,
    setPredictions,
  };
  
  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};

export default TournamentContext;
