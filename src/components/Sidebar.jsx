import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, Sun, Moon, Compass, GraduationCap } from 'lucide-react';

export default function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onOpenSettings,
  theme,
  onToggleTheme
}) {
  return (
    <aside className="w-64 md:w-72 h-screen flex flex-col bg-slate-900 border-r border-slate-800 text-slate-350 select-none shrink-0 z-10 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-655 to-purple-500 text-white shadow-md shadow-indigo-500/20">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white font-sans flex items-center gap-1.5 leading-none">
            Pathfinder <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-550/20 text-indigo-400 font-semibold border border-indigo-550/20">AI</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Career recommendation chatbot</p>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Consultation</span>
        </button>
      </div>

      {/* Previous Conversations - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">History</span>
        </div>
        
        {conversations.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <GraduationCap className="h-8 w-8 text-slate-800 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-600">No previous consultations</p>
          </div>
        ) : (
          conversations.map((chat) => {
            const isActive = chat.id === activeId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectConversation(chat.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700/80 shadow-inner'
                    : 'hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  <span className="truncate pr-1 text-slate-300 group-hover:text-slate-100 font-medium">
                    {chat.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-655 hover:text-rose-400 hover:bg-slate-700/50 transition-all"
                  title="Delete Chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-slate-800 space-y-1 bg-slate-950/20">
        {/* Toggle Theme Control */}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-400 hover:text-slate-250 text-xs font-semibold transition-colors"
        >
          <span className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <>
                <Sun className="h-4.5 w-4.5 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4.5 w-4.5 text-indigo-400" />
                <span>Switch to Dark</span>
              </>
            )}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700/50 font-normal capitalize">
            {theme}
          </span>
        </button>

        {/* Settings Control */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-400 hover:text-slate-250 text-xs font-semibold transition-colors"
        >
          <Settings className="h-4.5 w-4.5 text-slate-500" />
          <span>Webhook Settings</span>
        </button>
      </div>
    </aside>
  );
}
