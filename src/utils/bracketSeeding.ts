// Helper functions for parsing bracket labels and seeding teams

/**
 * Parse a bracket label like "1C" or "3A/B/F" to get the team code
 * @param {string} label - Label like "1C", "2A", "3A/B/F", "Winner E", "Runner-up A"
 * @param {Object} qualifiers - Object with firstPlace, secondPlace, thirdPlace arrays
 * @param {Object} groupStandings - All group standings
 * @returns {string|null} - Team code or null if not found
 */
export const parseBracketLabel = (label, qualifiers, groupStandings) => {
  if (!label) return null;
  
  const trimmed = label.trim();
  
  // Handle "Winner X" format (e.g., "Winner E")
  const winnerMatch = trimmed.match(/^Winner\s+([A-L])$/i);
  if (winnerMatch) {
    const groupId = winnerMatch[1].toUpperCase();
    const firstPlace = qualifiers.firstPlace.find(q => q.group === groupId);
    // If code is an array, it means it's still undecided - return null
    if (firstPlace && Array.isArray(firstPlace.code)) {
      return null;
    }
    return firstPlace?.code || null;
  }
  
  // Handle "Runner-up X" format (e.g., "Runner-up A")
  const runnerUpMatch = trimmed.match(/^Runner-up\s+([A-L])$/i);
  if (runnerUpMatch) {
    const groupId = runnerUpMatch[1].toUpperCase();
    const secondPlace = qualifiers.secondPlace.find(q => q.group === groupId);
    // If code is an array, it means it's still undecided - return null
    if (secondPlace && Array.isArray(secondPlace.code)) {
      return null;
    }
    return secondPlace?.code || null;
  }
  
  // Handle "1X" format (first place from group X)
  const firstPlaceMatch = trimmed.match(/^1([A-L])$/i);
  if (firstPlaceMatch) {
    const groupId = firstPlaceMatch[1].toUpperCase();
    const firstPlace = qualifiers.firstPlace.find(q => q.group === groupId);
    // If code is an array, it means it's still undecided - return null
    if (firstPlace && Array.isArray(firstPlace.code)) {
      return null;
    }
    return firstPlace?.code || null;
  }
  
  // Handle "2X" format (second place from group X)
  const secondPlaceMatch = trimmed.match(/^2([A-L])$/i);
  if (secondPlaceMatch) {
    const groupId = secondPlaceMatch[1].toUpperCase();
    const secondPlace = qualifiers.secondPlace.find(q => q.group === groupId);
    // If code is an array, it means it's still undecided - return null
    if (secondPlace && Array.isArray(secondPlace.code)) {
      return null;
    }
    return secondPlace?.code || null;
  }
  
  // Handle "3X/Y/Z" or "3rd X/Y/Z" format (third place from one of groups X, Y, Z)
  const thirdPlaceMatch = trimmed.match(/^3(?:rd)?\s*([A-L](?:\/[A-L])*)$/i);
  if (thirdPlaceMatch) {
    // Extract all groups from the match (e.g., "A/B/C/D/F" -> ["A", "B", "C", "D", "F"])
    const groupsStr = thirdPlaceMatch[1];
    const possibleGroups = groupsStr.split('/').map(g => g.trim().toUpperCase());
    
    // Find the first available third place team from the possible groups
    for (const groupId of possibleGroups) {
      const thirdPlace = qualifiers.thirdPlace.find(q => q.group === groupId);
      if (thirdPlace) {
        // If code is an array, it means it's still undecided - return null
        if (Array.isArray(thirdPlace.code)) {
          return null;
        }
        return thirdPlace.code;
      }
    }
    
    // If no third place team found from these groups, return null
    return null;
  }
  
  return null;
};

/**
 * Parse a bracket match label like "1C vs 3A/B/F" to get both team codes
 * @param {string} label - Full match label
 * @param {Object} qualifiers - Object with firstPlace, secondPlace, thirdPlace arrays
 * @param {Object} groupStandings - All group standings
 * @returns {Object} - { team1: string|null, team2: string|null }
 */
export const parseMatchLabel = (label, qualifiers, groupStandings) => {
  if (!label) return { team1: null, team2: null };
  
  const parts = label.split(/\s+vs\s+/i);
  if (parts.length !== 2) {
    return { team1: null, team2: null };
  }
  
  const team1 = parseBracketLabel(parts[0].trim(), qualifiers, groupStandings);
  const team2 = parseBracketLabel(parts[1].trim(), qualifiers, groupStandings);
  
  return { team1, team2 };
};
