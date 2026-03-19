import React, { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import { Upload, ClipboardList, Trash2, UserPlus, Sparkles, UserCheck } from 'lucide-react';
import { Participant } from '../types';
import { cn } from '../lib/utils';

interface ListInputProps {
  onParticipantsChange: (participants: Participant[]) => void;
  participants: Participant[];
}

const MOCK_NAMES = [
  '陳小明', '林美玲', '張大衛', '王曉華', '李建國', 
  '黃雅婷', '周杰倫', '蔡依林', '林書豪', '郭台銘',
  '賈伯斯', '馬斯克', '比爾蓋茲', '庫克', '祖克柏'
];

export const ListInput: React.FC<ListInputProps> = ({ onParticipantsChange, participants }) => {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTextSubmit = () => {
    const names = textInput
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n !== '');
    
    const newParticipants: Participant[] = names.map((name) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
    }));

    onParticipantsChange([...participants, ...newParticipants]);
    setTextInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .map((n: any) => String(n).trim())
          .filter((n) => n !== '' && n !== 'name' && n !== 'Name');
        
        const newParticipants: Participant[] = names.map((name) => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
        }));

        onParticipantsChange([...participants, ...newParticipants]);
      },
      header: false,
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadMockData = () => {
    const mockParticipants: Participant[] = MOCK_NAMES.map((name) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
    }));
    onParticipantsChange(mockParticipants);
  };

  const clearAll = () => {
    onParticipantsChange([]);
    setShowClearConfirm(false);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueParticipants = participants.filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onParticipantsChange(uniqueParticipants);
  };

  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name)
    );
  }, [participants]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Input */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">貼上姓名名單</h3>
            </div>
            <button
              onClick={loadMockData}
              className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              載入模擬名單
            </button>
          </div>
          <textarea
            className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
            placeholder="輸入姓名，以換行或逗號分隔..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            新增至名單
          </button>
        </div>

        {/* File Upload */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center space-y-4 border-dashed border-2 border-slate-200">
          <div className="p-4 bg-indigo-50 rounded-full">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">上傳 CSV 檔案</h3>
            <p className="text-xs text-slate-500 mt-1">支援純文字或 CSV 格式</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-medium transition-colors"
          >
            選擇檔案
          </button>
        </div>
      </div>

      {/* List Display */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">目前名單 ({participants.length} 人)</h3>
            {duplicateNames.size > 0 && (
              <button
                onClick={removeDuplicates}
                className="px-3 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition-all animate-pulse"
              >
                <UserCheck className="w-3.5 h-3.5" />
                移除重複姓名 ({duplicateNames.size} 組)
              </button>
            )}
          </div>
          {participants.length > 0 && (
            <div className="flex items-center gap-2">
              {showClearConfirm ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                  <span className="text-[10px] text-slate-400 font-medium">確定清除？</span>
                  <button
                    onClick={clearAll}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600 transition-colors"
                  >
                    是
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-300 transition-colors"
                  >
                    否
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  全部清除
                </button>
              )}
            </div>
          )}
        </div>
        
        {participants.length === 0 ? (
          <div className="py-12 text-center text-slate-400 italic text-sm">
            尚未加入任何名單...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
            {participants.map((p) => {
              const isDuplicate = duplicateNames.has(p.name);
              return (
                <span
                  key={p.id}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    isDuplicate 
                      ? "bg-amber-100 text-amber-700 border-amber-300 shadow-sm ring-1 ring-amber-200" 
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  {p.name}
                  {isDuplicate && <span className="ml-1 opacity-60">(重複)</span>}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
