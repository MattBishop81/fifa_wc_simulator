import { teams } from '../data/teams';

const TeamBadge = ({ 
  code, 
  size = 'md', 
  showFlag = true, 
  showName = false,
  isWinner = false,
  isLoser = false,
  className = '' 
}) => {
  const team = teams[code];
  
  if (!team) {
    return (
      <div className={`flex items-center gap-1 text-fifa-text-muted ${className}`}>
        <span className="text-xs">TBD</span>
      </div>
    );
  }
  
  const sizeClasses = {
    xs: 'text-xs gap-1',
    sm: 'text-sm gap-1.5',
    md: 'text-base gap-2',
    lg: 'text-lg gap-2',
    xl: 'text-xl gap-3',
  };
  
  const flagSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };
  
  // Check if className already has a text color class
  const hasTextColor = className.includes('text-');
  
  return (
    <div 
      className={`
        flex items-center font-semibold
        ${sizeClasses[size]}
        ${isWinner && !hasTextColor ? 'text-green-400' : ''}
        ${isLoser ? 'text-fifa-text-muted opacity-60' : ''}
        ${className}
      `}
    >
      {showFlag && (
        <span className={flagSizes[size]}>{team.flag}</span>
      )}
      <span className="font-heading tracking-wider">{team.code}</span>
      {showName && (
        <span className="text-fifa-text-muted font-normal text-sm ml-1">
          {team.name}
        </span>
      )}
    </div>
  );
};

export default TeamBadge;
