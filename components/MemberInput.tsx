
import React, { useState, useRef, useMemo } from 'react';
import { Member } from '../types';
import { Upload, Trash2, UserPlus, Play, Users, Sparkles, AlertTriangle, UserCheck } from 'lucide-react';

interface MemberInputProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  onProceed: () => void;
}

const MemberInput: React.FC<MemberInputProps> = ({ members, setMembers, onProceed }) => {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockNames = [
    "陳小明", "林美惠", "張志強", "王大同", "李佩珊", 
    "吳佳蓉", "黃志成", "周杰倫", "蔡依林", "郭台銘",
    "賈伯斯", "馬斯克", "陳大天", "李美華", "張小花"
  ];

  // Calculate duplicates
  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      counts[m.name] = (counts[m.name] || 0) + 1;
    });
    return new Set(Object.keys(counts).filter(name => counts[name] > 1));
  }, [members]);

  const loadMockData = () => {
    const newMembers = mockNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    setMembers(newMembers);
  };

  const removeDuplicates = () => {
    setMembers(prev => {
      const seen = new Set();
      return prev.filter(member => {
        const isDuplicate = seen.has(member.name);
        seen.add(member.name);
        return !isDuplicate;
      });
    });
  };

  const handleBulkAdd = () => {
    if (!textInput.trim()) return;
    const names = textInput
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    const newMembers = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    setMembers(prev => [...prev, ...newMembers]);
    setTextInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const names = content
        .split(/[\n,\r]+/)
        .map(name => name.trim())
        .filter(name => name.length > 0 && name.toLowerCase() !== 'name'); 
      
      const newMembers = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));

      setMembers(prev => [...prev, ...newMembers]);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const clearAll = () => {
    if (confirm('確定要清除所有名單嗎？')) {
      setMembers([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              新增名單
            </h2>
            <button 
              onClick={loadMockData}
              className="text-xs flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full hover:bg-amber-100 transition-colors font-medium"
            >
              <Sparkles className="w-3 h-3" />
              載入模擬名單
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手動輸入 (每行一個姓名或以逗號分隔)
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="例如：&#10;王小明&#10;陳大天&#10;李美華"
              />
              <button
                onClick={handleBulkAdd}
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                加入名單
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 uppercase font-bold text-xs tracking-widest">or</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上傳 CSV 檔案
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.txt"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-600 font-medium py-6 rounded-xl transition-all flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span>點擊上傳或拖拽 CSV 檔案</span>
                <span className="text-xs text-gray-400 font-normal">支援單欄位姓名列表</span>
              </button>
            </div>
          </div>
        </div>

        {members.length > 0 && (
          <button
            onClick={onProceed}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
          >
            <Play className="w-6 h-6 fill-current" />
            <span className="text-lg">開始抽獎 / 分組</span>
          </button>
        )}
      </div>

      {/* List Display Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            當前名單 ({members.length} 人)
          </h2>
          <div className="flex gap-2">
            {duplicateNames.size > 0 && (
              <button
                onClick={removeDuplicates}
                className="text-amber-600 hover:text-amber-700 text-xs font-bold flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200"
              >
                <UserCheck className="w-3.5 h-3.5" />
                移除重複 ({duplicateNames.size})
              </button>
            )}
            {members.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
                全部清除
              </button>
            )}
          </div>
        </div>

        {duplicateNames.size > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-medium">
              偵測到名單中有重複姓名，已在下方標記。建議先移除重複項再進行分組。
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Users className="w-12 h-12 mb-2 opacity-20" />
              <p>目前還沒有任何成員</p>
            </div>
          ) : (
            members.map((member, index) => {
              const isDuplicate = duplicateNames.has(member.name);
              return (
                <div 
                  key={member.id} 
                  className={`flex items-center justify-between p-3 rounded-lg group transition-all ${
                    isDuplicate 
                    ? 'bg-amber-50 border border-amber-200' 
                    : 'bg-gray-50 hover:bg-indigo-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 w-6">{index + 1}</span>
                    <span className={`font-medium ${isDuplicate ? 'text-amber-900' : 'text-gray-700'}`}>
                      {member.name}
                    </span>
                    {isDuplicate && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded uppercase">重複</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberInput;
