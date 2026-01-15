import { useTournament } from '../context/TournamentContext';
import TeamBadge from './TeamBadge';
import MatchCard from './MatchCard';

const GroupCard = ({ groupId }) => {
  const { 
    groups, 
    groupResults, 
    groupStandings, 
    simulateGroupMatch,
    simulateGroup,
    selectedTeams,
    undecidedTeams
  } = useTournament();
  
  const group = groups[groupId];
  const matches = groupResults[groupId] || [];
  const standings = groupStandings[groupId] || [];
  
  if (!group) return null;
  
  // Check if all undecided teams for this group are selected
  const groupUndecidedKeys = Object.keys(undecidedTeams).filter(
    key => undecidedTeams[key].groupId === groupId
  );
  const allGroupTeamsSelected = groupUndecidedKeys.every(
    key => selectedTeams[key]
  );
  
  const allMatchesPlayed = matches.every(m => m.played);
  const anyMatchPlayed = matches.some(m => m.played);
  
  return (
    <div className="bg-fifa-gray/30 rounded-xl border border-fifa-gray overflow-hidden">
      {/* Header */}
      <div className="bg-fifa-group/30 px-4 py-3 flex items-center justify-between border-b border-fifa-group/30">
        <h3 className="font-heading font-bold text-lg tracking-wide">
          GROUP {groupId}
        </h3>
        {!allMatchesPlayed && allGroupTeamsSelected && (
          <button
            onClick={() => simulateGroup(groupId)}
            className="text-xs px-3 py-1.5 rounded bg-fifa-group/50 hover:bg-fifa-group transition-colors font-semibold"
          >
            Simulate All
          </button>
        )}
        {!allGroupTeamsSelected && (
          <span className="text-xs text-fifa-text-muted">
            Select teams first
          </span>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        {/* Standings Table */}
        {standings.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-fifa-gray">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-fifa-gray/50 text-fifa-text-muted text-xs">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Team</th>
                  <th className="px-2 py-2 text-center">P</th>
                  <th className="px-2 py-2 text-center">W</th>
                  <th className="px-2 py-2 text-center">D</th>
                  <th className="px-2 py-2 text-center">L</th>
                  <th className="px-2 py-2 text-center">GD</th>
                  <th className="px-2 py-2 text-center font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, idx) => {
                  const isArray = Array.isArray(team.code);
                  return (
                    <tr 
                      key={isArray ? team.code.join('/') : team.code}
                      className={`
                        border-t border-fifa-gray/30
                        ${idx < 2 ? 'bg-fifa-group/20' : ''}
                        ${idx === 2 ? 'bg-fifa-r32/10' : ''}
                      `}
                    >
                      <td className="px-3 py-2 text-fifa-text-muted">{idx + 1}</td>
                      <td className="px-3 py-2">
                        {isArray ? (
                          <div className="flex flex-wrap gap-1">
                            {team.code.map((code, codeIdx) => (
                              <TeamBadge key={codeIdx} code={code} size="xs" />
                            ))}
                          </div>
                        ) : (
                          <TeamBadge code={team.code} size="xs" />
                        )}
                      </td>
                      <td className="px-2 py-2 text-center">{team.played}</td>
                      <td className="px-2 py-2 text-center text-green-400">{team.won}</td>
                      <td className="px-2 py-2 text-center text-fifa-text-muted">{team.drawn}</td>
                      <td className="px-2 py-2 text-center text-red-400">{team.lost}</td>
                      <td className="px-2 py-2 text-center">
                        <span className={team.goalDifference > 0 ? 'text-green-400' : team.goalDifference < 0 ? 'text-red-400' : ''}>
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center font-bold text-fifa-gold">{team.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Matches */}
        <div>
          <h4 className="text-xs text-fifa-text-muted mb-2 uppercase tracking-wider">Matches</h4>
          <div className="grid gap-2">
            {matches.map((match, idx) => {
              // Resolve teams from arrays to selected teams using the resolved groups
              // The groups from context should already have resolved teams
              const resolvedGroupMatch = groups[groupId]?.matches?.find(m => m.id === match.id);
              const resolvedMatch = {
                ...match,
                team1: resolvedGroupMatch?.team1 || match.team1,
                team2: resolvedGroupMatch?.team2 || match.team2,
              };
              
              return (
                <MatchCard
                  key={match.id}
                  match={resolvedMatch}
                  onSimulate={() => simulateGroupMatch(groupId, idx)}
                  variant="group"
                  compact
                  showMatchNumber={false}
                />
              );
            })}
          </div>
        </div>
        
        {/* Qualification indicators */}
        {allMatchesPlayed && standings.length >= 2 && (
          <div className="pt-2 border-t border-fifa-gray/30 text-xs text-fifa-text-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fifa-group" />
              <span>Qualified (Top 2)</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-fifa-r32" />
              <span>Possible 3rd place qualifier</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
