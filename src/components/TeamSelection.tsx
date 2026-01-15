import { useTournament } from '../context/TournamentContext';
import TeamBadge from './TeamBadge';

const TeamSelection = () => {
  const { undecidedTeams, selectedTeams, selectUndecidedTeam, groups } = useTournament();
  
  // Get all undecided teams that haven't been selected yet
  const unselectedTeams = Object.entries(undecidedTeams).filter(
    ([key]) => !selectedTeams[key]
  );
  
  if (unselectedTeams.length === 0) {
    return null; // All teams selected
  }
  
  return (
    <div className="bg-fifa-darker rounded-xl border border-fifa-gray p-6 mb-6">
      <div className="mb-4">
        <h3 className="font-heading text-xl font-bold tracking-wide mb-2">
          Select Undecided Teams
        </h3>
        <p className="text-fifa-text-muted text-sm">
          Please select one team from each undecided slot before simulating the group stage.
        </p>
      </div>
      
      <div className="space-y-4">
        {unselectedTeams.map(([key, info]) => {
          const group = groups[info.groupId];
          const groupName = group.name;
          
          return (
            <div 
              key={key}
              className="bg-fifa-gray/30 rounded-lg border border-fifa-gray/50 p-4"
            >
              <div className="mb-3">
                <span className="text-sm font-semibold text-fifa-text-muted">
                  {groupName} - Position {info.index + 1}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {info.options.map((teamCode) => {
                  const isSelected = selectedTeams[key] === teamCode;
                  return (
                    <button
                      key={teamCode}
                      onClick={() => selectUndecidedTeam(key, teamCode)}
                      className={`
                        px-4 py-2 rounded-lg border transition-all
                        flex items-center gap-2
                        ${isSelected 
                          ? 'bg-fifa-group border-fifa-group text-white' 
                          : 'bg-fifa-darker border-fifa-gray hover:border-fifa-group/50 hover:bg-fifa-gray/20'}
                      `}
                    >
                      <TeamBadge code={teamCode} size="sm" />
                      {isSelected && (
                        <span className="text-xs">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamSelection;
