import { useTournament, PHASES } from '../context/TournamentContext';
import TeamBadge from './TeamBadge';

const Qualifiers = () => {
  const tournament = useTournament();
  const { 
    undecidedTeams, 
    selectedTeams, 
    selectUndecidedTeam, 
    originalGroups,
    simulateQualifiers,
    advanceToGroupStage,
    phase
  } = tournament;
  
  // Use originalGroups if available, otherwise fallback to groups
  const groups = originalGroups || tournament.groups;
  
  // Get all undecided teams that haven't been selected yet
  const unselectedTeams = Object.entries(undecidedTeams).filter(
    ([key]) => !selectedTeams[key]
  );
  
  // Check if all teams are selected
  const allTeamsSelected = Object.keys(undecidedTeams).every(
    key => selectedTeams[key]
  );
  
  // Check if we're in qualifiers phase (can edit) or have already advanced (read-only)
  const isQualifiersPhase = phase === PHASES.QUALIFIERS;
  const hasAdvanced = phase !== PHASES.QUALIFIERS && allTeamsSelected;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-wide">Qualifiers</h2>
          <p className="text-fifa-text-muted text-sm mt-1">
            {isQualifiersPhase 
              ? 'Select teams for undecided qualification spots'
              : 'Qualified teams for the tournament'}
          </p>
        </div>
        
        {isQualifiersPhase && (
          <div className="flex gap-3">
            {!allTeamsSelected && (
              <button
                onClick={simulateQualifiers}
                className="px-4 py-2 rounded-lg bg-fifa-group hover:bg-fifa-group/80 transition-colors font-semibold text-sm"
              >
                Simulate Qualifiers
              </button>
            )}
            
            {allTeamsSelected && (
              <button
                onClick={advanceToGroupStage}
                className="px-4 py-2 rounded-lg bg-fifa-r32 hover:bg-fifa-r32/80 transition-colors font-semibold text-sm animate-pulse"
              >
                Advance to Group Stage →
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Team Selection - Only show if in qualifiers phase and there are unselected teams */}
      {isQualifiersPhase && unselectedTeams.length > 0 && (
        <div className="bg-fifa-darker rounded-xl border border-fifa-gray p-6">
          <div className="mb-4">
            <h3 className="font-heading text-xl font-bold tracking-wide mb-2">
              Select Undecided Teams
            </h3>
            <p className="text-fifa-text-muted text-sm">
              Please select one team from each undecided slot, or click "Simulate Qualifiers" to run a round-robin tournament based on FIFA rankings.
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
      )}
      
      {/* All Teams Selected Message - Only show if in qualifiers phase */}
      {isQualifiersPhase && unselectedTeams.length === 0 && (
        <div className="bg-fifa-darker rounded-xl border border-fifa-gray p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-heading text-xl font-bold tracking-wide mb-2">
              All Teams Selected
            </h3>
            <p className="text-fifa-text-muted text-sm mb-4">
              All undecided qualification spots have been filled. You can now proceed to the Group Stage.
            </p>
            <button
              onClick={advanceToGroupStage}
              className="px-6 py-3 rounded-lg bg-fifa-r32 hover:bg-fifa-r32/80 transition-colors font-semibold text-sm animate-pulse"
            >
              Advance to Group Stage →
            </button>
          </div>
        </div>
      )}
      
      {/* Selected Teams Summary - Always show if there are selected teams */}
      {Object.keys(selectedTeams).length > 0 && (
        <div className="bg-fifa-gray/30 rounded-xl border border-fifa-gray p-6">
          <h3 className="font-heading text-lg font-bold tracking-wide mb-4">
            {hasAdvanced ? 'Qualified Teams' : 'Selected Teams'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(selectedTeams).map(([key, teamCode]) => {
              const info = undecidedTeams[key];
              const group = groups[info?.groupId];
              return (
                <div 
                  key={key}
                  className="bg-fifa-darker rounded-lg border border-fifa-gray/50 p-3 flex items-center gap-2"
                >
                  <TeamBadge code={teamCode} size="xs" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {group?.name} - Pos {info?.index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Show message if no teams selected yet and not in qualifiers phase */}
      {!isQualifiersPhase && Object.keys(selectedTeams).length === 0 && (
        <div className="bg-fifa-darker rounded-xl border border-fifa-gray p-6">
          <div className="text-center py-8">
            <p className="text-fifa-text-muted text-sm">
              No qualifiers have been selected yet. Return to the Qualifiers phase to select teams.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Qualifiers;
