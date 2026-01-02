
import React, { useState, useEffect, useRef } from 'react';
import { Member } from '../types';
import { Gift, RotateCcw, Trophy, CheckCircle2, History } from 'lucide-react';

interface LuckyDrawProps {
  members: Member[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ members }) => {
  const [currentPool, setCurrentPool] = useState<Member[]>(members);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Member | null>(null);
  const [winnersHistory, setWinnersHistory] = useState<Member[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [spinningSpeed, setSpinningSpeed] = useState(50);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentPool(members);
  }, [members]);

  const startDraw = () => {
    if (currentPool.length === 0) {
      alert('所有成員都已中獎！');
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    setSpinningSpeed(50);
    
    let cycles = 0;
    const maxCycles = 40;
    
    const tick = () => {
      setDisplayIndex(Math.floor(Math.random() * currentPool.length));
      cycles++;
      
      if (cycles < maxCycles) {
        // Linear slow down toward the end
        const nextSpeed = 50 + (cycles * 5);
        timerRef.current = window.setTimeout(tick, nextSpeed);
      } else {
        finalizeDraw();
      }
    };

    tick();
  };

  const finalizeDraw = () => {
    const pool = currentPool;
    const winIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[winIndex];
    
    setWinner(selected);
    setWinnersHistory(prev => [selected, ...prev]);
    setIsSpinning(false);

    if (!allowRepeat) {
      setCurrentPool(prev => prev.filter(m => m.id !== selected.id));
    }

    // Dynamic import for confetti to avoid large initial bundle if not used
    import('https://cdn.skypack.dev/canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    });
  };

  const resetDraw = () => {
    if (confirm('確定要重置所有抽獎紀錄嗎？')) {
      setCurrentPool(members);
      setWinner(null);
      setWinnersHistory([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Stage */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center border border-indigo-50 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="mb-8 p-6 rounded-full bg-indigo-50 text-indigo-600">
              <Trophy className="w-16 h-16" />
            </div>

            <div className="text-center h-40 flex flex-col justify-center">
              {isSpinning ? (
                <div className="space-y-4">
                  <div className="text-6xl font-black text-indigo-600 animate-bounce">
                    {currentPool[displayIndex]?.name}
                  </div>
                  <p className="text-gray-400 font-medium animate-pulse">抽取中...</p>
                </div>
              ) : winner ? (
                <div className="space-y-4 animate-in zoom-in duration-300">
                  <p className="text-indigo-600 font-bold tracking-widest uppercase text-sm">恭喜獲獎者</p>
                  <div className="text-7xl font-black text-gray-900 drop-shadow-sm">
                    {winner.name}
                  </div>
                </div>
              ) : (
                <div className="text-4xl font-bold text-gray-300">
                  準備抽獎
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col w-full gap-4 max-w-sm">
              <button
                onClick={startDraw}
                disabled={isSpinning || currentPool.length === 0}
                className={`w-full py-5 rounded-2xl text-xl font-bold shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 ${
                  isSpinning || currentPool.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                {isSpinning ? '抽取中...' : '開始抽獎'}
              </button>
              
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={allowRepeat}
                      onChange={() => setAllowRepeat(!allowRepeat)}
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${allowRepeat ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${allowRepeat ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 font-medium transition-colors">允許重複抽中</span>
                </label>

                <button 
                  onClick={resetDraw}
                  className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置池
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="text-indigo-600 w-5 h-5 flex-shrink-0" />
            <p className="text-sm text-indigo-800">
              目前抽獎池內共有 <span className="font-bold">{currentPool.length}</span> 位候選人。
              {!allowRepeat && '抽中後將自動從名單移除。'}
            </p>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[500px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            抽獎歷史
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {winnersHistory.length === 0 ? (
              <div className="text-center py-20 text-gray-400 space-y-2">
                <Gift className="w-8 h-8 mx-auto opacity-20" />
                <p>尚無抽獎紀錄</p>
              </div>
            ) : (
              winnersHistory.map((win, idx) => (
                <div key={`${win.id}-${idx}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl animate-in slide-in-from-right duration-300">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {winnersHistory.length - idx}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{win.name}</div>
                    <div className="text-xs text-gray-400">獲獎時刻: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
