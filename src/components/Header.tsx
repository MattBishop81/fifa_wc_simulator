import { useTournament, PHASES } from '../context/TournamentContext';

const Header = () => {
  const { 
    phase, 
    champion, 
    teams,
    simulateEntireTournament,
    resetTournament 
  } = useTournament();
  
  const championTeam = champion ? teams[champion] : null;
  const isCompleted = phase === PHASES.COMPLETED;
  
  return (
    <header className="bg-fifa-darker border-b border-fifa-gray">
      <div className="max-w-[1800px] mx-auto px-4 py-4">
        {/* Top row - Logo, Title, Status */}
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-fifa-gold font-heading tracking-tight">
                26
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-fifa-text-muted uppercase tracking-widest">Match</span>
                <span className="text-lg font-heading font-bold tracking-wide">Schedule</span>
              </div>
            </div>
            
            <div className="h-10 w-px bg-fifa-gray" />
            
            <h1 className="text-2xl font-heading font-bold tracking-wide">
              FIFA WORLD CUP Simulator 2026
              <span className="text-fifa-gold">™</span>
            </h1>
          </div>
          
          {/* Status / Champion */}
          <div className="flex items-center gap-4">
            {isCompleted && championTeam ? (
              <div className="flex items-center gap-3 bg-gradient-to-r from-fifa-gold/20 to-transparent px-6 py-2 rounded-lg border border-fifa-gold/30">
                <span className="text-fifa-gold text-2xl">🏆</span>
                <div>
                  <span className="text-xs text-fifa-text-muted block">CHAMPION</span>
                  <span className="font-heading font-bold text-xl flex items-center gap-2">
                    <span className="text-2xl">{championTeam.flag}</span>
                    {championTeam.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-lg bg-fifa-gray/50">
                <span className="text-xs text-fifa-text-muted block uppercase tracking-wider">Current Phase</span>
                <span className="font-heading font-semibold capitalize">
                  {phase.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom row - Action Buttons */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-fifa-gray/50">
          {!isCompleted && (
            <button
              onClick={simulateEntireTournament}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-fifa-gold to-fifa-gold/70 hover:from-fifa-gold/90 hover:to-fifa-gold/60 text-fifa-dark font-bold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              🎲 Simulate Entire Tournament
            </button>
          )}
          
          <button
            onClick={resetTournament}
            className="px-5 py-2.5 rounded-lg bg-fifa-gray/50 hover:bg-fifa-gray border border-fifa-gray font-semibold text-sm transition-colors"
          >
            🔄 Reset Tournament
          </button>
          
          <div className="flex-1" />
          
          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-fifa-text-muted uppercase tracking-wider">Progress:</span>
            <div className="flex gap-1">
              <div className={`w-8 h-2 rounded-full ${phase !== PHASES.GROUP_STAGE ? 'bg-fifa-group' : 'bg-fifa-gray'}`} title="Groups" />
              <div className={`w-8 h-2 rounded-full ${[PHASES.ROUND_OF_16, PHASES.QUARTER_FINALS, PHASES.SEMI_FINALS, PHASES.FINAL, PHASES.COMPLETED].includes(phase) ? 'bg-fifa-r32' : 'bg-fifa-gray'}`} title="R32" />
              <div className={`w-8 h-2 rounded-full ${[PHASES.QUARTER_FINALS, PHASES.SEMI_FINALS, PHASES.FINAL, PHASES.COMPLETED].includes(phase) ? 'bg-fifa-r16' : 'bg-fifa-gray'}`} title="R16" />
              <div className={`w-8 h-2 rounded-full ${[PHASES.SEMI_FINALS, PHASES.FINAL, PHASES.COMPLETED].includes(phase) ? 'bg-white' : 'bg-fifa-gray'}`} title="QF" />
              <div className={`w-8 h-2 rounded-full ${[PHASES.FINAL, PHASES.COMPLETED].includes(phase) ? 'bg-white' : 'bg-fifa-gray'}`} title="SF" />
              <div className={`w-8 h-2 rounded-full ${isCompleted ? 'bg-fifa-gold' : 'bg-fifa-gray'}`} title="Final" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
