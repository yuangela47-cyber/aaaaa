
import React, { useState, useEffect } from 'react';
import { AppTab, Member } from './types';
import MemberInput from './components/MemberInput';
import LuckyDraw from './components/LuckyDraw';
import TeamGrouping from './components/TeamGrouping';
import { Users, Gift, ListPlus, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INPUT);
  const [members, setMembers] = useState<Member[]>([]);
  
  // Persistent storage simulation
  useEffect(() => {
    const saved = localStorage.getItem('hr-members');
    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved members", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hr-members', JSON.stringify(members));
  }, [members]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">HR Buddy <span className="text-indigo-600">Toolbox</span></h1>
            </div>
            
            <nav className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setActiveTab(AppTab.INPUT)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === AppTab.INPUT 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ListPlus className="w-4 h-4" />
                <span>名單管理</span>
              </button>
              <button
                onClick={() => setActiveTab(AppTab.LUCKY_DRAW)}
                disabled={members.length === 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  members.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeTab === AppTab.LUCKY_DRAW 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>獎品抽籤</span>
              </button>
              <button
                onClick={() => setActiveTab(AppTab.GROUPING)}
                disabled={members.length === 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  members.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeTab === AppTab.GROUPING 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>自動分組</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === AppTab.INPUT && (
          <MemberInput 
            members={members} 
            setMembers={setMembers} 
            onProceed={() => setActiveTab(AppTab.LUCKY_DRAW)}
          />
        )}
        {activeTab === AppTab.LUCKY_DRAW && (
          <LuckyDraw members={members} />
        )}
        {activeTab === AppTab.GROUPING && (
          <TeamGrouping members={members} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          &copy; 2024 HR Buddy Toolbox - Professional HR Support System
        </div>
      </footer>
    </div>
  );
};

export default App;
