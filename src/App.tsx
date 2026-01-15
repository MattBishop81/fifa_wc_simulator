import { useState, useEffect } from 'react';
import { TournamentProvider, useTournament, PHASES } from './context/TournamentContext';
import Header from './components/Header';
import Qualifiers from './components/Qualifiers';
import GroupStage from './components/GroupStage';
import KnockoutBracket from './components/KnockoutBracket';
import ScheduleGrid from './components/ScheduleGrid';

const tabs = [
  { id: 'qualifiers', label: 'Qualifiers', icon: '🎯' },
  { id: 'groups', label: 'Group Stage', icon: '🏟️' },
  { id: 'knockout', label: 'Knockout', icon: '🏆' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
];

const TournamentApp = () => {
  const { phase } = useTournament();
  // Start with qualifiers tab if in qualifiers phase, otherwise groups
  const [activeTab, setActiveTab] = useState(phase === PHASES.QUALIFIERS ? 'qualifiers' : 'groups');
  
  // Automatically switch tabs when phase changes
  useEffect(() => {
    if (phase === PHASES.QUALIFIERS) {
      setActiveTab('qualifiers');
    } else if (phase === PHASES.GROUP_STAGE) {
      setActiveTab('groups');
    } else if ([PHASES.ROUND_OF_32, PHASES.ROUND_OF_16, PHASES.QUARTER_FINALS, PHASES.SEMI_FINALS, PHASES.FINAL, PHASES.COMPLETED].includes(phase)) {
      setActiveTab('knockout');
    }
  }, [phase]);
  
  return (
    <div className="min-h-screen bg-fifa-dark">
      <Header />
      
      <main className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-fifa-gray pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-5 py-2.5 rounded-lg font-heading font-semibold text-sm transition-all
                flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-fifa-gray text-white' 
                  : 'text-fifa-text-muted hover:text-white hover:bg-fifa-gray/50'}
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'qualifiers' && <Qualifiers />}
          {activeTab === 'groups' && <GroupStage />}
          {activeTab === 'knockout' && <KnockoutBracket />}
          {activeTab === 'schedule' && <ScheduleGrid />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-fifa-gray mt-12 py-6">
        <div className="max-w-[1800px] mx-auto px-4 text-center text-fifa-text-muted text-sm">
          <p>FIFA World Cup 2026™ Simulator • Built with React + Tailwind CSS</p>
          <p className="text-xs mt-1 opacity-60">
            This is a fan-made simulator for entertainment purposes only. 
            Not affiliated with FIFA.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <TournamentProvider>
      <TournamentApp />
    </TournamentProvider>
  );
};

export default App;
