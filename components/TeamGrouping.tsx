
import React, { useState } from 'react';
import { Member, Group } from '../types';
import { Users, Shuffle, Share2, Info, ChevronRight, LayoutGrid, List, FileDown } from 'lucide-react';

interface TeamGroupingProps {
  members: Member[];
}

const TeamGrouping: React.FC<TeamGroupingProps> = ({ members }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isGenerating, setIsGenerating] = useState(false);

  const performGrouping = () => {
    setIsGenerating(true);
    
    // Artificial delay for "processing" feel
    setTimeout(() => {
      const shuffled = [...members].sort(() => Math.random() - 0.5);
      const newGroups: Group[] = [];
      const totalGroups = Math.ceil(members.length / groupSize);

      for (let i = 0; i < totalGroups; i++) {
        const teamMembers = shuffled.slice(i * groupSize, (i + 1) * groupSize);
        newGroups.push({
          id: `group-${i}`,
          name: `第 ${i + 1} 組`,
          members: teamMembers,
          theme: getRandomColor()
        });
      }

      setGroups(newGroups);
      setIsGenerating(false);
    }, 800);
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 
      'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-orange-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const shareResults = () => {
    const text = groups.map(g => `${g.name}:\n${g.members.map(m => ` - ${m.name}`).join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('分組結果已複製到剪貼簿！');
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,Group,Name\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `grouping_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      {/* Control Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">分組設置</h2>
            <p className="text-sm text-gray-500">設定每組人數並自動生成名單</p>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <label className="text-sm font-bold text-gray-700 ml-2">每組人數</label>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setGroupSize(Math.max(2, groupSize - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              >-</button>
              <input 
                type="number" 
                value={groupSize} 
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center bg-transparent font-bold text-indigo-600 outline-none"
              />
              <button 
                onClick={() => setGroupSize(groupSize + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              >+</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 mr-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={performGrouping}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? '分組中...' : '開始自動分組'}
          </button>
          
          {groups.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={downloadCSV}
                className="p-3 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl transition-all"
                title="下載 CSV 檔案"
              >
                <FileDown className="w-5 h-5" />
              </button>
              <button
                onClick={shareResults}
                className="p-3 text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-xl transition-all"
                title="複製結果"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Display */}
      {groups.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-gray-50 p-6 rounded-full">
            <Users className="w-12 h-12 text-gray-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">尚未生成分組</h3>
            <p className="text-gray-400">點擊上方的按鈕來進行隨機自動分組</p>
          </div>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {groups.map((group, index) => (
            <div 
              key={group.id} 
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow animate-in zoom-in-95 duration-300`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`${group.theme} px-5 py-4 flex justify-between items-center text-white`}>
                <h3 className="font-bold flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 opacity-70" />
                  {group.name}
                </h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-mono">
                  {group.members.length} 人
                </span>
              </div>
              
              <div className="p-4 bg-gray-50/50">
                <ul className="space-y-2">
                  {group.members.map((m, mIdx) => (
                    <li key={m.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 text-[10px] font-mono text-gray-400 border border-gray-100">
                        {mIdx + 1}
                      </div>
                      <span className="font-medium text-gray-700">{m.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {groups.length > 0 && (
        <div className="bg-indigo-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              <Info className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold opacity-90">分組統計報告</h4>
              <p className="text-indigo-200 text-sm">本次分組完美均衡了所有參與者</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-center sm:text-right">
            <div>
              <p className="text-3xl font-black">{members.length}</p>
              <p className="text-xs uppercase tracking-widest text-indigo-300">參與總人數</p>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div>
              <p className="text-3xl font-black">{groups.length}</p>
              <p className="text-xs uppercase tracking-widest text-indigo-300">總分組數</p>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div>
              <p className="text-3xl font-black">~{groupSize}</p>
              <p className="text-xs uppercase tracking-widest text-indigo-300">平均組人數</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamGrouping;
