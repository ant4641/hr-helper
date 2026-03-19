import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Settings2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant } from '../types';
import { cn } from '../lib/utils';

interface LuckyDrawProps {
  participants: Participant[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [repeatable, setRepeatable] = useState(false);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setAvailableParticipants(participants);
  }, [participants]);

  const startDraw = useCallback(() => {
    if (availableParticipants.length === 0) {
      alert('名單已抽完或尚未匯入名單！');
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    // Animation logic: cycle through names quickly
    const duration = 3000; // 3 seconds
    const interval = 80; // 80ms per name
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(timer);
        
        // Final selection
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        const selected = availableParticipants[randomIndex];
        
        setWinner(selected);
        setIsDrawing(false);
        
        // Confetti effect
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });

        // Update available list if not repeatable
        if (!repeatable) {
          setAvailableParticipants(prev => prev.filter(p => p.id !== selected.id));
        }
      } else {
        setCurrentIndex(Math.floor(Math.random() * availableParticipants.length));
      }
    }, interval);
  }, [availableParticipants, repeatable]);

  const resetDraw = () => {
    setAvailableParticipants(participants);
    setWinner(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      {/* Settings */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">抽籤設定</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={repeatable}
                onChange={() => setRepeatable(!repeatable)}
              />
              <div className={cn(
                "w-10 h-5 rounded-full transition-colors",
                repeatable ? "bg-indigo-600" : "bg-slate-300"
              )} />
              <div className={cn(
                "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                repeatable ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
            <span className="text-xs text-slate-500 group-hover:text-slate-700">允許重複中獎</span>
          </label>
        </div>
        <button
          onClick={resetDraw}
          className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重設名單
        </button>
      </div>

      {/* Main Display */}
      <div className="relative aspect-video glass-card rounded-[2rem] flex flex-col items-center justify-center overflow-hidden border-2 border-indigo-100/50 shadow-xl shadow-indigo-500/5">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {isDrawing ? (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-6xl font-bold text-indigo-600 tracking-tight"
            >
              {availableParticipants[currentIndex]?.name}
            </motion.div>
          ) : winner ? (
            <motion.div
              key="winner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center mb-2">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-lg" />
                </motion.div>
              </div>
              <p className="text-indigo-500 font-semibold tracking-widest uppercase text-sm">恭喜中獎者</p>
              <h2 className="text-7xl font-black text-slate-900 drop-shadow-sm">
                {winner.name}
              </h2>
            </motion.div>
          ) : (
            <div className="text-center space-y-2">
              <Sparkles className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">準備好開始抽獎了嗎？</p>
              <p className="text-xs text-slate-300">剩餘名額: {availableParticipants.length}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={startDraw}
          disabled={isDrawing || availableParticipants.length === 0}
          className={cn(
            "px-12 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95",
            isDrawing || availableParticipants.length === 0
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25"
          )}
        >
          {isDrawing ? '正在抽取...' : '開始抽籤'}
        </button>
      </div>
    </div>
  );
};
