import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, LayoutGrid, ListFilter, Download } from 'lucide-react';
import Papa from 'papaparse';
import { Participant, Group } from '../types';
import { cn } from '../lib/utils';

interface AutoGroupingProps {
  participants: Participant[];
}

export const AutoGrouping: React.FC<AutoGroupingProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);

  const generateGroups = () => {
    if (participants.length === 0) return;

    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    const numGroups = Math.ceil(shuffled.length / groupSize);

    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize),
      });
    }

    setGroups(newGroups);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    const csvData = groups.flatMap(group => 
      group.members.map(member => ({
        '組別': group.name,
        '姓名': member.name
      }))
    );

    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Controls */}
      <div className="glass-card p-6 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold whitespace-nowrap">分組設定</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {[2, 3, 4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => setGroupSize(size)}
                className={cn(
                  "flex-none w-10 h-10 rounded-lg text-sm font-bold transition-all",
                  groupSize === size
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {size}
              </button>
            ))}
            <div className="px-2 border-l border-slate-200 ml-1 flex flex-col items-center">
              <input
                type="number"
                min="1"
                max={participants.length || 100}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                className="w-12 bg-transparent text-center text-sm font-bold outline-none"
              />
              <span className="text-[10px] text-slate-400 block text-center">自訂</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={generateGroups}
            disabled={participants.length === 0}
            className="flex-1 lg:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            立即自動分組
          </button>
          
          {groups.length > 0 && (
            <button
              onClick={downloadCSV}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
              title="下載 CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">下載結果</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Visualization */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-indigo-500"
            >
              <div className="p-4 bg-indigo-50/50 flex justify-between items-center border-bottom border-indigo-100">
                <h4 className="font-bold text-indigo-900">{group.name}</h4>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full font-bold">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-4 space-y-2">
                {group.members.map((member, mIdx) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      {mIdx + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{member.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 glass-card rounded-3xl border-dashed border-2">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <ListFilter className="w-8 h-8 text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 font-medium">尚未進行分組</p>
            <p className="text-xs text-slate-400">設定每組人數並點擊按鈕開始</p>
          </div>
        </div>
      )}
    </div>
  );
};
