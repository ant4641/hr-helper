import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Trophy, 
  ClipboardList, 
  Settings,
  LayoutDashboard,
  Github
} from 'lucide-react';
import { ListInput } from './components/ListInput';
import { LuckyDraw } from './components/LuckyDraw';
import { AutoGrouping } from './components/AutoGrouping';
import { Participant } from './types';
import { cn } from './lib/utils';

type Tab = 'input' | 'draw' | 'group';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const tabs = [
    { id: 'input', label: '名單匯入', icon: ClipboardList, color: 'indigo' },
    { id: 'draw', label: '獎項抽籤', icon: Trophy, color: 'amber' },
    { id: 'group', label: '自動分組', icon: Users, color: 'emerald' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none">HR 智慧工具箱</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Lucky Draw & Grouping System</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? `text-${tab.color}-600` : "text-slate-400")} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-none px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'input' && (
              <ListInput 
                participants={participants} 
                onParticipantsChange={setParticipants} 
              />
            )}
            {activeTab === 'draw' && (
              <LuckyDraw participants={participants} />
            )}
            {activeTab === 'group' && (
              <AutoGrouping participants={participants} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <p>© 2026 HR 智慧工具箱. 專為人力資源管理設計.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">使用條款</a>
            <a href="#" className="hover:text-slate-600 transition-colors">隱私政策</a>
            <a href="#" className="flex items-center gap-1 hover:text-slate-600 transition-colors">
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
