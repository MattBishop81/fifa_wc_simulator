import { useState } from 'react';
import { useTournament, PHASES } from '../context/TournamentContext';
import { knockoutRounds, roundNames } from '../data/bracket';
import { cities, regions, getCity } from '../data/cities';
import { getDateKey, formatDate } from '../data/matchHelpers';
import { generatePredictions } from '../utils/predictions';
import TeamBadge from './TeamBadge';

// Simplified schedule grid view inspired by FIFA official schedule
const ScheduleGrid = () => {
  const { 
    phase,
    groupResults,
    bracket,
    groups,
    selectedTeams,
    undecidedTeams,
    predictions,
    setPredictions,
    teams 
  } = useTournament();
  
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState({ current: 0, total: 100 });
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'group': return 'bg-fifa-group text-white';
      case 'r32': return 'bg-fifa-r32 text-white';
      case 'r16': return 'bg-fifa-r16 text-white';
      case 'qf': return 'bg-white/90 text-fifa-dark';
      case 'sf': return 'bg-white/90 text-fifa-dark';
      case 'final': return 'bg-fifa-gold text-fifa-dark';
      default: return 'bg-fifa-gray';
    }
  };
  
  const getTypeBorder = (type) => {
    switch (type) {
      case 'group': return 'border-fifa-group/50';
      case 'r32': return 'border-fifa-r32/50';
      case 'r16': return 'border-fifa-r16/50';
      case 'qf': return 'border-white/30';
      case 'sf': return 'border-white/30';
      case 'final': return 'border-fifa-gold/50';
      default: return 'border-fifa-gray';
    }
  };
  
  // Get region cities
  const westernCities = cities.filter(c => c.region === regions.WESTERN);
  const centralCities = cities.filter(c => c.region === regions.CENTRAL);
  const easternCities = cities.filter(c => c.region === regions.EASTERN);
  
  // Get all matches with dates and venues from groups
  const allGroupMatchesWithSchedule = Object.entries(groups).flatMap(([groupId, group]) =>
    group.matches.map(match => {
      const result = groupResults[groupId]?.find(m => m.id === match.id) || {};
      return {
        ...match,
        ...result,
        groupId,
        type: 'group',
        stage: `Group ${groupId}`,
      };
    })
  );
  
  // Get all knockout matches with dates and venues
  const allKnockoutMatches = [
    ...(bracket[knockoutRounds.ROUND_OF_32] || []).map(m => ({ ...m, type: 'r32', stage: 'Round of 32', round: knockoutRounds.ROUND_OF_32 })),
    ...(bracket[knockoutRounds.ROUND_OF_16] || []).map(m => ({ ...m, type: 'r16', stage: 'Round of 16', round: knockoutRounds.ROUND_OF_16 })),
    ...(bracket[knockoutRounds.QUARTER_FINALS] || []).map(m => ({ ...m, type: 'qf', stage: 'Quarter-Finals', round: knockoutRounds.QUARTER_FINALS })),
    ...(bracket[knockoutRounds.SEMI_FINALS] || []).map(m => ({ ...m, type: 'sf', stage: 'Semi-Finals', round: knockoutRounds.SEMI_FINALS })),
    ...(bracket[knockoutRounds.THIRD_PLACE] || []).map(m => ({ ...m, type: 'tp', stage: 'Third Place', round: knockoutRounds.THIRD_PLACE })),
    ...(bracket[knockoutRounds.FINAL] || []).map(m => ({ ...m, type: 'final', stage: 'Final', round: knockoutRounds.FINAL })),
  ];
  
  // Combine all matches
  const allMatches = [...allGroupMatchesWithSchedule, ...allKnockoutMatches];
  
  // Group matches by date and venue
  const matchesByDateAndVenue = {};
  allMatches.forEach(match => {
    if (!match.date || !match.venue) return;
    const dateKey = getDateKey(match.date);
    if (!matchesByDateAndVenue[dateKey]) {
      matchesByDateAndVenue[dateKey] = {};
    }
    if (!matchesByDateAndVenue[dateKey][match.venue]) {
      matchesByDateAndVenue[dateKey][match.venue] = [];
    }
    matchesByDateAndVenue[dateKey][match.venue].push(match);
  });
  
  // Get unique dates sorted
  const uniqueDates = Object.keys(matchesByDateAndVenue)
    .sort()
    .map(dateKey => {
      const firstMatch = Object.values(matchesByDateAndVenue[dateKey])[0]?.[0];
      return {
        dateKey,
        date: firstMatch?.date,
        displayDate: formatDate(firstMatch?.date),
        type: firstMatch?.type || 'group',
      };
    });
  
  // Use actual dates from matches, or fallback to default dates
  const dates = uniqueDates.length > 0 ? uniqueDates : [
    { dateKey: '2026-06-11', displayDate: 'Thu 11 Jun', type: 'group' },
    { dateKey: '2026-06-12', displayDate: 'Fri 12 Jun', type: 'group' },
  ];
  
  const handlePredictMatches = async () => {
    setIsPredicting(true);
    setPredictionProgress({ current: 0, total: 100 });
    
    try {
      // Allow UI to render the modal first
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Run predictions with progress updates
      const pred = await generatePredictions(selectedTeams, undecidedTeams, (current, total) => {
        setPredictionProgress({ current, total });
      });
      
      setPredictions(pred);
      
      // Show completion message briefly before closing
      setPredictionProgress({ current: 100, total: 100 });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsPredicting(false);
    } catch (error) {
      console.error('Error generating predictions:', error);
      setIsPredicting(false);
      alert('Error generating predictions. Please try again.');
    }
  };
  
  const getMatchPrediction = (match) => {
    if (!predictions) return null;
    
    if (match.groupId) {
      const matchKey = `${match.groupId}_${match.id}`;
      return predictions.groupMatches[matchKey];
    } else {
      // Try to find the round key from the match
      let roundKey = null;
      
      // Check if match has a round property
      if (match.round) {
        roundKey = match.round;
      } else {
        // Map type to round key
        const roundMap = {
          'r32': knockoutRounds.ROUND_OF_32,
          'r16': knockoutRounds.ROUND_OF_16,
          'qf': knockoutRounds.QUARTER_FINALS,
          'sf': knockoutRounds.SEMI_FINALS,
          'final': knockoutRounds.FINAL,
          'tp': knockoutRounds.THIRD_PLACE,
        };
        roundKey = roundMap[match.type];
      }
      
      if (roundKey) {
        const matchKey = `${roundKey}_${match.id}`;
        return predictions.knockoutMatches[matchKey];
      }
    }
    return null;
  };
  
  const getMostLikelyOutcome = (prediction) => {
    if (!prediction) return null;
    
    if (prediction.winners) {
      const sortedWinners = Object.entries(prediction.winners)
        .sort(([, a], [, b]) => b - a);
      if (sortedWinners.length > 0) {
        return {
          team: sortedWinners[0][0],
          probability: sortedWinners[0][1],
        };
      }
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-wide">Match Schedule</h2>
          <p className="text-fifa-text-muted text-sm mt-1">
            104 matches across 16 cities • June 11 - July 19, 2026
          </p>
        </div>
        <button
          onClick={handlePredictMatches}
          disabled={isPredicting}
          className={`
            px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all
            ${isPredicting 
              ? 'bg-fifa-gray/50 text-fifa-text-muted cursor-not-allowed' 
              : 'bg-fifa-gold text-fifa-dark hover:bg-fifa-gold/90'}
          `}
        >
          {isPredicting 
            ? `Predicting... ${predictionProgress.current}/${predictionProgress.total}`
            : '🔮 Predict Matches'}
        </button>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-fifa-group" />
          <span>Group Stage (48 matches)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-fifa-r32" />
          <span>Round of 32 (16 matches)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-fifa-r16" />
          <span>Round of 16 (8 matches)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/90" />
          <span>Quarter/Semi Finals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-fifa-gold" />
          <span>Final</span>
        </div>
      </div>
      
      {/* Schedule Overview */}
      <div className="bg-fifa-darker rounded-xl border border-fifa-gray overflow-hidden">
        <div className="overflow-x-auto">
          {/* Timeline Header */}
          <div className="grid grid-cols-[180px_1fr] border-b border-fifa-gray min-w-max">
            <div className="p-3 bg-fifa-gray/30 font-heading font-bold">
              CITY / DATE
            </div>
            <div className="flex">
              {dates.map((d, i) => (
                <div 
                  key={d.dateKey || i}
                  className={`
                    w-[90px] flex-shrink-0 py-2 text-center text-xs border-l border-fifa-gray/30
                    ${getTypeColor(d.type)}/20
                  `}
                >
                  <div className="font-semibold">{d.displayDate}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Regions */}
          {[
            { name: 'Western Region', cities: westernCities },
            { name: 'Central Region', cities: centralCities },
            { name: 'Eastern Region', cities: easternCities },
          ].map((region, ri) => (
            <div key={region.name}>
              {/* Region Header */}
              <div className="grid grid-cols-[180px_1fr] bg-fifa-gray/20 border-t border-fifa-gray min-w-max">
                <div className="p-2 text-xs font-heading font-bold text-fifa-text-muted uppercase tracking-wider flex items-center">
                  <span className="transform -rotate-90 text-[10px] mr-2">▼</span>
                  {region.name}
                </div>
                <div />
              </div>
              
              {/* Cities */}
              {region.cities.map((city, ci) => (
                <div 
                  key={city.id}
                  className="grid grid-cols-[180px_1fr] border-t border-fifa-gray/30 hover:bg-fifa-gray/10 transition-colors min-w-max"
                >
                  <div className="p-3 flex flex-col justify-center">
                    <span className="font-heading font-semibold text-sm">{city.name.toUpperCase()}</span>
                    <span className="text-[10px] text-fifa-text-muted">{city.timezone}</span>
                  </div>
                  <div className="flex items-center py-2">
                    {/* Show actual matches for this city */}
                    {dates.map((d, di) => {
                      const dateMatches = matchesByDateAndVenue[d.dateKey]?.[city.id] || [];
                      return (
                        <div 
                          key={d.dateKey || di}
                          className="w-[90px] flex-shrink-0 flex flex-col items-center gap-1 border-l border-fifa-gray/10 py-2"
                        >
                          {dateMatches.map((match, mi) => {
                            const matchType = match.type || 'group';
                            // Check if match has been played - either has played flag, winner, or scores
                            const isPlayed = match.played || match.winner || (match.score1 !== null && match.score1 !== undefined && match.score2 !== null && match.score2 !== undefined);
                            const winner = match.winner;
                            const hasWinner = winner && !Array.isArray(winner) && typeof winner === 'string';
                            const hasScores = match.score1 !== null && match.score1 !== undefined && match.score2 !== null && match.score2 !== undefined;
                            const isDraw = hasScores && !hasWinner && matchType === 'group'; // Group matches can be draws
                            
                            // Get prediction if available
                            const prediction = getMatchPrediction(match);
                            const predictedWinner = getMostLikelyOutcome(prediction);
                            
                            // Use predicted teams if no actual teams yet
                            let team1 = match.team1;
                            let team2 = match.team2;
                            
                            if (!team1 && prediction && prediction.team1Appearances) {
                              const sorted = Object.entries(prediction.team1Appearances).sort(([, a], [, b]) => b - a);
                              if (sorted.length > 0) team1 = sorted[0][0];
                            }
                            if (!team2 && prediction && prediction.team2Appearances) {
                              const sorted = Object.entries(prediction.team2Appearances).sort(([, a], [, b]) => b - a);
                              if (sorted.length > 0) team2 = sorted[0][0];
                            }
                            
                            const hasTeams = team1 && team2 && !Array.isArray(team1) && !Array.isArray(team2);
                            const displayWinner = hasWinner ? winner : (predictedWinner ? predictedWinner.team : null);
                            
                            return (
                              <div
                                key={match.id || mi}
                                onClick={() => setSelectedMatch({ match, prediction })}
                                className={`
                                  w-20 rounded text-[9px] p-1.5 flex flex-col items-center justify-center gap-0.5
                                  ${getTypeColor(matchType)}/30 border ${getTypeBorder(matchType)}
                                  ${isPlayed ? 'opacity-100' : 'opacity-70'}
                                  ${displayWinner ? 'bg-fifa-gold/20 border-fifa-gold/50' : ''}
                                  ${isDraw ? 'bg-fifa-gray/30' : ''}
                                  ${prediction && !isPlayed ? 'ring-1 ring-fifa-gold/30' : ''}
                                  hover:scale-105 transition-transform cursor-pointer
                                `}
                                title={
                                  hasWinner 
                                    ? `${match.stage || matchType}: ${teams[winner]?.name || winner} won${hasScores ? ` ${match.score1}-${match.score2}` : ''}`
                                    : predictedWinner
                                    ? `${match.stage || matchType}: ${teams[predictedWinner.team]?.name || predictedWinner.team} predicted (${predictedWinner.probability.toFixed(1)}%)`
                                    : isDraw
                                    ? `${match.stage || matchType}: Draw${hasScores ? ` ${match.score1}-${match.score2}` : ''}`
                                    : `${match.stage || matchType}: ${match.matchNumber || ''}`
                                }
                              >
                                {hasTeams && (hasScores || hasWinner || isDraw) ? (
                                  <>
                                    <div className={`flex items-center gap-0.5 ${team1 === displayWinner ? 'ring-1 ring-fifa-gold rounded px-0.5' : ''}`}>
                                      <TeamBadge 
                                        code={team1} 
                                        size="xs" 
                                        isWinner={team1 === displayWinner}
                                        className={team1 === displayWinner ? 'text-fifa-gold' : ''}
                                      />
                                      {hasScores && (
                                        <span className={`text-xs font-bold ${team1 === displayWinner ? 'text-fifa-gold' : ''}`}>
                                          {match.score1}
                                        </span>
                                      )}
                                    </div>
                                    {hasScores && (
                                      <span className="text-xs opacity-50">-</span>
                                    )}
                                    <div className={`flex items-center gap-0.5 ${team2 === displayWinner ? 'ring-1 ring-fifa-gold rounded px-0.5' : ''}`}>
                                      {hasScores && (
                                        <span className={`text-xs font-bold ${team2 === displayWinner ? 'text-fifa-gold' : ''}`}>
                                          {match.score2}
                                        </span>
                                      )}
                                      <TeamBadge 
                                        code={team2} 
                                        size="xs" 
                                        isWinner={team2 === displayWinner}
                                        className={team2 === displayWinner ? 'text-fifa-gold' : ''}
                                      />
                                    </div>
                                    {isDraw && (
                                      <span className="text-[6px] mt-0.5 opacity-60">Draw</span>
                                    )}
                                  </>
                                ) : hasWinner ? (
                                  <>
                                    <TeamBadge code={winner} size="xs" />
                                    {hasScores && (
                                      <span className="text-[8px] mt-0.5 font-semibold">
                                        {match.score1}-{match.score2}
                                      </span>
                                    )}
                                  </>
                                ) : isDraw && hasScores ? (
                                  <>
                                    <span className="text-[8px] font-semibold">Draw</span>
                                    <span className="text-[8px] mt-0.5 font-semibold">
                                      {match.score1}-{match.score2}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-semibold">
                                      {matchType === 'group' ? 'GS' : 
                                       matchType === 'r32' ? 'R32' :
                                       matchType === 'r16' ? 'R16' :
                                       matchType === 'qf' ? 'QF' :
                                       matchType === 'sf' ? 'SF' :
                                       matchType === 'final' ? 'F' :
                                       matchType === 'tp' ? 'TP' : matchType}
                                    </span>
                                    {match.matchNumber && (
                                      <span className="text-[8px] opacity-60">#{match.matchNumber}</span>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Match Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-fifa-group/20 rounded-lg p-4 border border-fifa-group/30">
          <div className="text-2xl font-heading font-bold">72</div>
          <div className="text-xs text-fifa-text-muted">Group Matches</div>
        </div>
        <div className="bg-fifa-r32/20 rounded-lg p-4 border border-fifa-r32/30">
          <div className="text-2xl font-heading font-bold">16</div>
          <div className="text-xs text-fifa-text-muted">Round of 32</div>
        </div>
        <div className="bg-fifa-r16/20 rounded-lg p-4 border border-fifa-r16/30">
          <div className="text-2xl font-heading font-bold">8</div>
          <div className="text-xs text-fifa-text-muted">Round of 16</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-heading font-bold">4</div>
          <div className="text-xs text-fifa-text-muted">Quarter-Finals</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-heading font-bold">2</div>
          <div className="text-xs text-fifa-text-muted">Semi-Finals</div>
        </div>
        <div className="bg-fifa-gold/20 rounded-lg p-4 border border-fifa-gold/30">
          <div className="text-2xl font-heading font-bold text-fifa-gold">1</div>
          <div className="text-xs text-fifa-text-muted">Final</div>
        </div>
      </div>
      
      {/* Prediction Progress Modal */}
      {isPredicting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-fifa-darker rounded-xl border border-fifa-gray max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="font-heading text-xl font-bold mb-2">Predicting Matches</h3>
              <p className="text-fifa-text-muted text-sm mb-6">
                Running {predictionProgress.total} tournament simulations...
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-fifa-gray/30 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-fifa-gold h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(predictionProgress.current / predictionProgress.total) * 100}%` }}
                />
              </div>
              
              {/* Progress Text */}
              <div className="text-fifa-gold font-semibold text-lg mb-2">
                {predictionProgress.current} / {predictionProgress.total}
              </div>
              <div className="text-fifa-text-muted text-xs">
                {predictionProgress.current === predictionProgress.total 
                  ? 'Finalizing predictions...' 
                  : 'Simulating tournaments...'}
              </div>
              
              {/* Animated dots */}
              <div className="flex justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-fifa-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-fifa-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-fifa-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Match Prediction Modal */}
      {selectedMatch && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMatch(null)}
        >
          <div 
            className="bg-fifa-darker rounded-xl border border-fifa-gray max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold">
                  {selectedMatch.match.stage || selectedMatch.match.type} - Match {selectedMatch.match.matchNumber || selectedMatch.match.id}
                </h3>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-fifa-text-muted hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              {selectedMatch.prediction ? (
                <div className="space-y-6">
                  {selectedMatch.match.groupId ? (
                    // Group Stage Match - Show fixed teams with win probabilities
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Team 1 */}
                        <div className="p-4 bg-fifa-gray/20 rounded-lg border border-fifa-gray/30">
                          <h4 className="font-heading font-semibold mb-3 text-fifa-gold text-sm">Team 1</h4>
                          {selectedMatch.prediction.team1 && (
                            <>
                              <TeamBadge code={selectedMatch.prediction.team1} size="md" showName={true} />
                              <div className="mt-3">
                                <div className="text-xs text-fifa-text-muted mb-1">Win Probability</div>
                                <div className="text-2xl font-bold text-fifa-gold">
                                  {selectedMatch.prediction.team1WinProbability !== undefined 
                                    ? selectedMatch.prediction.team1WinProbability.toFixed(1) 
                                    : '0.0'}%
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Team 2 */}
                        <div className="p-4 bg-fifa-gray/20 rounded-lg border border-fifa-gray/30">
                          <h4 className="font-heading font-semibold mb-3 text-fifa-gold text-sm">Team 2</h4>
                          {selectedMatch.prediction.team2 && (
                            <>
                              <TeamBadge code={selectedMatch.prediction.team2} size="md" showName={true} />
                              <div className="mt-3">
                                <div className="text-xs text-fifa-text-muted mb-1">Win Probability</div>
                                <div className="text-2xl font-bold text-fifa-gold">
                                  {selectedMatch.prediction.team2WinProbability !== undefined 
                                    ? selectedMatch.prediction.team2WinProbability.toFixed(1) 
                                    : '0.0'}%
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Draw Probability */}
                      {selectedMatch.prediction.draws !== undefined && selectedMatch.prediction.draws > 0 && (
                        <div className="p-4 bg-fifa-gray/20 rounded-lg border border-fifa-gray/30">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-semibold">Draw</span>
                            <span className="text-2xl font-bold text-fifa-gold">{selectedMatch.prediction.draws.toFixed(1)}%</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Knockout Match - Show appearance and win probabilities
                    <>
                      {/* Team 1 Appearance Probabilities */}
                      <div>
                        <h4 className="font-heading font-semibold mb-3 text-fifa-gold">Team 1 - Possible Teams</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedMatch.prediction.team1Appearances || {})
                            .sort(([, a], [, b]) => b - a)
                            .map(([team, prob]) => (
                              <div key={team} className="flex items-center justify-between p-2 bg-fifa-gray/20 rounded">
                                <TeamBadge code={team} size="sm" />
                                <span className="text-fifa-gold font-semibold">{prob.toFixed(1)}% chance to appear</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      {/* Team 2 Appearance Probabilities */}
                      <div>
                        <h4 className="font-heading font-semibold mb-3 text-fifa-gold">Team 2 - Possible Teams</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedMatch.prediction.team2Appearances || {})
                            .sort(([, a], [, b]) => b - a)
                            .map(([team, prob]) => (
                              <div key={team} className="flex items-center justify-between p-2 bg-fifa-gray/20 rounded">
                                <TeamBadge code={team} size="sm" />
                                <span className="text-fifa-gold font-semibold">{prob.toFixed(1)}% chance to appear</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      {/* Winner Probabilities */}
                      <div>
                        <h4 className="font-heading font-semibold mb-3 text-fifa-gold">Win Probabilities</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedMatch.prediction.winners || {})
                            .sort(([, a], [, b]) => b - a)
                            .map(([team, prob]) => (
                              <div key={team} className="flex items-center justify-between p-2 bg-fifa-gray/20 rounded">
                                <TeamBadge code={team} size="sm" />
                                <span className="text-fifa-gold font-semibold">{prob.toFixed(1)}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-fifa-text-muted">
                  <p>No predictions available for this match.</p>
                  <p className="text-sm mt-2">Click "Predict Matches" to generate predictions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGrid;
