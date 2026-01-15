import { useTournament, PHASES } from '../context/TournamentContext';
import { knockoutRounds, roundNames } from '../data/bracket';
import MatchCard from './MatchCard';
import TeamBadge from './TeamBadge';

const KnockoutBracket = () => {
  const { 
    phase,
    bracket,
    champion,
    runnerUp,
    teams,
    simulateKnockoutMatch,
    simulateKnockoutRound 
  } = useTournament();
  
  if (phase === PHASES.GROUP_STAGE) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="font-heading text-xl text-fifa-text-muted">
          Complete the Group Stage to unlock the Knockout Rounds
        </h3>
      </div>
    );
  }
  
  const roundOrder = [
    { key: knockoutRounds.ROUND_OF_32, color: 'fifa-r32', label: 'R32' },
    { key: knockoutRounds.ROUND_OF_16, color: 'fifa-r16', label: 'R16' },
    { key: knockoutRounds.QUARTER_FINALS, color: 'white', label: 'QF' },
    { key: knockoutRounds.SEMI_FINALS, color: 'white', label: 'SF' },
    { key: knockoutRounds.FINAL, color: 'fifa-gold', label: 'F' },
  ];
  
  const getVariant = (roundKey) => {
    switch (roundKey) {
      case knockoutRounds.ROUND_OF_32: return 'r32';
      case knockoutRounds.ROUND_OF_16: return 'r16';
      case knockoutRounds.QUARTER_FINALS: return 'qf';
      case knockoutRounds.SEMI_FINALS: return 'sf';
      case knockoutRounds.FINAL: return 'final';
      default: return 'group';
    }
  };
  
  const canSimulateRound = (roundKey) => {
    const matches = bracket[roundKey];
    return matches && matches.some(m => 
      m.team1 && m.team2 && 
      !Array.isArray(m.team1) && !Array.isArray(m.team2) && 
      !m.winner
    );
  };
  
  const allMatchesInRoundComplete = (roundKey) => {
    const matches = bracket[roundKey];
    return matches && matches.every(m => m.winner || (!m.team1 && !m.team2));
  };
  
  return (
    <div className="space-y-6">
      {/* Champion Display */}
      {phase === PHASES.COMPLETED && champion && (
        <div className="text-center py-8 bg-gradient-to-b from-fifa-gold/20 to-transparent rounded-2xl border border-fifa-gold/30">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="font-heading text-3xl font-bold mb-2">WORLD CHAMPION</h2>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl">{teams[champion]?.flag}</span>
            <span className="font-heading text-4xl font-bold">{teams[champion]?.name}</span>
          </div>
          {runnerUp && (
            <div className="mt-4 text-fifa-text-muted">
              <span className="text-lg">Runner-up: </span>
              <span className="text-xl">{teams[runnerUp]?.flag} {teams[runnerUp]?.name}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Bracket Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-wide">Knockout Stage</h2>
          <p className="text-fifa-text-muted text-sm mt-1">
            32 teams compete in single-elimination matches
          </p>
        </div>
      </div>
      
      {/* Knockout Rounds */}
      <div className="space-y-8">
        {roundOrder.map(({ key, color, label }) => {
          const matches = bracket[key] || [];
          const showRound = matches.some(m => m.team1 || m.team2 || m.winner);
          
          if (!showRound) return null;
          
          return (
            <div key={key} className="space-y-3">
              {/* Round Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className={`
                      w-3 h-3 rounded-full
                      ${color === 'fifa-r32' ? 'bg-fifa-r32' : ''}
                      ${color === 'fifa-r16' ? 'bg-fifa-r16' : ''}
                      ${color === 'white' ? 'bg-white' : ''}
                      ${color === 'fifa-gold' ? 'bg-fifa-gold' : ''}
                    `}
                  />
                  <h3 className="font-heading text-xl font-bold tracking-wide">
                    {roundNames[key]}
                  </h3>
                  <span className="text-fifa-text-muted text-sm">
                    ({matches.length} {matches.length === 1 ? 'match' : 'matches'})
                  </span>
                </div>
                
                {canSimulateRound(key) && (
                  <button
                    onClick={() => simulateKnockoutRound(key)}
                    className={`
                      px-4 py-2 rounded-lg font-semibold text-sm transition-colors
                      ${color === 'fifa-r32' ? 'bg-fifa-r32 hover:bg-fifa-r32/80' : ''}
                      ${color === 'fifa-r16' ? 'bg-fifa-r16 hover:bg-fifa-r16/80' : ''}
                      ${color === 'white' ? 'bg-white/20 hover:bg-white/30 text-white' : ''}
                      ${color === 'fifa-gold' ? 'bg-fifa-gold hover:bg-fifa-gold/80 text-fifa-dark' : ''}
                    `}
                  >
                    Simulate Round
                  </button>
                )}
              </div>
              
              {/* Matches Grid */}
              <div 
                className={`
                  grid gap-3
                  ${matches.length > 8 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8' : ''}
                  ${matches.length === 8 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8' : ''}
                  ${matches.length === 4 ? 'grid-cols-2 md:grid-cols-4' : ''}
                  ${matches.length === 2 ? 'grid-cols-2' : ''}
                  ${matches.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : ''}
                `}
              >
                {matches.map((match, idx) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onSimulate={() => simulateKnockoutMatch(key, idx)}
                    variant={getVariant(key)}
                    showMatchNumber
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnockoutBracket;
