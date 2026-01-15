import TeamBadge from './TeamBadge';

const MatchCard = ({ 
  match, 
  onSimulate,
  variant = 'group', // 'group' | 'knockout'
  showMatchNumber = true,
  compact = false,
}) => {
  const { team1, team2, score1, score2, winner, played, extraTime, penalties, penaltyScore } = match;
  
  const isPlayed = played || (score1 !== null && score2 !== null);
  // Cannot simulate if either team is an array (undecided) or if match is already played
  const canSimulate = team1 && team2 && !Array.isArray(team1) && !Array.isArray(team2) && !isPlayed;
  
  // Helper to render team(s) - handles both single team code and array of codes
  const renderTeam = (teamCodeOrArray, isTeam1) => {
    if (Array.isArray(teamCodeOrArray)) {
      // Display all possible teams without TBD label
      return (
        <div className="flex flex-wrap gap-1 items-center">
          {teamCodeOrArray.map((code, idx) => (
            <TeamBadge 
              key={idx}
              code={code} 
              size={compact ? "xs" : "sm"} 
              isWinner={false}
              isLoser={false}
            />
          ))}
        </div>
      );
    }
    return (
      <TeamBadge 
        code={teamCodeOrArray} 
        size={compact ? "xs" : "sm"} 
        isWinner={winner === teamCodeOrArray}
        isLoser={winner && winner !== teamCodeOrArray}
      />
    );
  };
  
  const variantStyles = {
    group: 'bg-fifa-group/20 border-fifa-group/40 hover:border-fifa-group',
    r32: 'bg-fifa-r32/20 border-fifa-r32/40 hover:border-fifa-r32',
    r16: 'bg-fifa-r16/20 border-fifa-r16/40 hover:border-fifa-r16',
    qf: 'bg-white/10 border-white/30 hover:border-white/50',
    sf: 'bg-white/10 border-white/30 hover:border-white/50',
    final: 'bg-fifa-gold/20 border-fifa-gold/40 hover:border-fifa-gold',
  };
  
  const style = variantStyles[variant] || variantStyles.group;
  
  if (compact) {
    return (
      <div 
        className={`
          rounded border transition-all cursor-pointer
          ${style}
          ${canSimulate ? 'hover:scale-[1.02]' : ''}
        `}
        onClick={() => canSimulate && onSimulate?.()}
      >
        <div className="px-2 py-1.5 flex items-center justify-between gap-2">
          {renderTeam(team1, true)}
          
          {isPlayed && !Array.isArray(team1) && !Array.isArray(team2) ? (
            <div className="flex items-center gap-1 font-mono text-xs font-bold">
              <span className={winner === team1 ? 'text-green-400' : ''}>{score1}</span>
              <span className="text-fifa-text-muted">-</span>
              <span className={winner === team2 ? 'text-green-400' : ''}>{score2}</span>
              {extraTime && !penalties && <span className="text-[10px] text-fifa-text-muted ml-1">AET</span>}
              {penalties && <span className="text-[10px] text-fifa-text-muted ml-1">P</span>}
            </div>
          ) : (
            <span className="text-[10px] text-fifa-text-muted">vs</span>
          )}
          
          {renderTeam(team2, false)}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`
        rounded-lg border transition-all
        ${style}
        ${canSimulate ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
      `}
      onClick={() => canSimulate && onSimulate?.()}
    >
      {showMatchNumber && match.id && (
        <div className="px-3 py-1 border-b border-white/10 flex justify-between items-center">
          <span className="text-[10px] text-fifa-text-muted font-mono">{match.id}</span>
          {canSimulate && (
            <span className="text-[10px] text-fifa-gold animate-pulse">Click to simulate</span>
          )}
        </div>
      )}
      
      <div className="p-3 space-y-2">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          {renderTeam(team1, true)}
          {isPlayed && !Array.isArray(team1) && !Array.isArray(team2) && (
            <span className={`font-mono font-bold ${winner === team1 ? 'text-green-400' : ''}`}>
              {score1}
            </span>
          )}
        </div>
        
        {/* Team 2 */}
        <div className="flex items-center justify-between">
          {renderTeam(team2, false)}
          {isPlayed && !Array.isArray(team1) && !Array.isArray(team2) && (
            <span className={`font-mono font-bold ${winner === team2 ? 'text-green-400' : ''}`}>
              {score2}
            </span>
          )}
        </div>
        
        {/* Extra info */}
        {isPlayed && (extraTime || penalties) && (
          <div className="text-[10px] text-fifa-text-muted text-center pt-1 border-t border-white/10">
            {penalties ? (
              <span>Penalties ({penaltyScore?.team1}-{penaltyScore?.team2})</span>
            ) : (
              <span>After Extra Time</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
