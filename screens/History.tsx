
import React from 'react';
import { Screen, ChatHistoryItem } from '../types';

interface HistoryProps {
    onNavigate: (screen: Screen) => void;
    history: ChatHistoryItem[];
}

const History: React.FC<HistoryProps> = ({ onNavigate, history }) => {
  return (
    <div className="flex-1 container mx-auto p-6 animate-fade-in flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-4xl font-pixel text-white pixel-text-shadow">CHAT HISTORY</h1>
        <button onClick={() => onNavigate(Screen.HOME)} className="bg-central-secondary px-4 py-2 font-pixel text-xs text-white pixel-border hover:bg-red-700">BACK</button>
      </div>
      
      <div className="bg-central-glass pixel-border p-1 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex-1 overflow-hidden flex flex-col">
        <div className="bg-black/50 p-2 border-b border-red-900 flex justify-between items-center text-xs font-mono text-gray-500">
            <span>TOTAL LOGS: {history.length}</span>
            <span>SYSTEM MONITORING ACTIVE</span>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-4 custom-scroll flex-1">
            {history.length === 0 ? (
                <div className="text-center text-gray-500 font-mono py-12">
                    <div className="text-4xl mb-4 opacity-30">∅</div>
                    NO CHAT RECORDS FOUND
                </div>
            ) : (
                history.map((item) => (
                    <div key={item.id} className="border border-gray-800 bg-black/60 p-4 rounded hover:border-red-900 transition-colors">
                        <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                            <span className="font-pixel text-[10px] text-central-accent">USER: {item.username}</span>
                            <span className="font-mono text-[10px] text-gray-600">{item.timestamp}</span>
                        </div>
                        <div className="font-mono text-sm space-y-2">
                            <div className="text-gray-400">
                                <span className="text-gray-600 select-none mr-2">&gt;</span>
                                {item.userMessage}
                            </div>
                            <div className="text-gray-200 pl-4 border-l-2 border-central-secondary/30 mt-2 py-1">
                                <div className="text-[10px] text-central-secondary mb-1 select-none">AI RESP ({item.aiName}):</div>
                                <div className="line-clamp-3 hover:line-clamp-none cursor-pointer transition-all">
                                    {item.aiResponse}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default History;
