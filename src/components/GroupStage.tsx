import { useTournament, PHASES } from '../context/TournamentContext';
import GroupCard from './GroupCard';

const GroupStage = () => {
  const { 
    phase,
    groupStandings,
    simulateAllGroups,
    advanceToKnockout,
    undecidedTeams,
    selectedTeams
  } = useTournament();
  
  const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  // Check if all undecided teams have been selected
  const allTeamsSelected = Object.keys(undecidedTeams).every(
    key => selectedTeams[key]
  );
  
  // Check if all groups are complete
  const allGroupsComplete = Object.keys(groupStandings).length === 12 && 
    Object.values(groupStandings).every(standings => 
      standings.length === 4 && standings[0].played === 3
    );
  
  const showAdvanceButton = phase === PHASES.GROUP_STAGE && allGroupsComplete;
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-wide">Group Stage</h2>
          <p className="text-fifa-text-muted text-sm mt-1">
            48 teams in 12 groups • Top 2 + best 8 third-place teams advance
          </p>
        </div>
        
        <div className="flex gap-3">
          {phase === PHASES.GROUP_STAGE && !allGroupsComplete && allTeamsSelected && (
            <button
              onClick={simulateAllGroups}
              className="px-4 py-2 rounded-lg bg-fifa-group hover:bg-fifa-group/80 transition-colors font-semibold text-sm"
            >
              Simulate All Groups
            </button>
          )}
          
          {showAdvanceButton && (
            <button
              onClick={advanceToKnockout}
              className="px-4 py-2 rounded-lg bg-fifa-r32 hover:bg-fifa-r32/80 transition-colors font-semibold text-sm animate-pulse"
            >
              Advance to Knockout Stage →
            </button>
          )}
        </div>
      </div>
      
      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groupIds.map(groupId => (
          <GroupCard key={groupId} groupId={groupId} />
        ))}
      </div>
    </div>
  );
};

export default GroupStage;
