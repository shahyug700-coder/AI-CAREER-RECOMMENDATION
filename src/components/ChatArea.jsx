import React, { useState, useEffect, useRef } from 'react';
import { Compass, Send, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import WelcomeForm from './WelcomeForm';
import ChatMessage from './ChatMessage';

function LoadingIndicator() {
  const messages = [
    "Analyzing your profile...",
    "Finding matching careers...",
    "Generating roadmap..."
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full gap-4 py-6 px-4 md:px-6 justify-start border-b border-slate-100 dark:border-slate-900/60 bg-slate-50/30 dark:bg-slate-900/10 animate-pulse">
      <div className="flex max-w-4xl gap-3.5 md:gap-5 flex-row">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md">
          <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        {/* Loading Content */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
              Pathfinder AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Pulsing Dots */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-2xl">
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 typing-dot" />
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 typing-dot" />
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 typing-dot" />
            </div>
            {/* Cycling Text */}
            <span className="text-xs md:text-sm font-semibold text-slate-505 dark:text-slate-400">
              {messages[index]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatArea({
  activeConversation,
  isLoading,
  error,
  onStartConsultation,
  onSendMessage,
  onRegenerate,
  onResetConsultation
}) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading, error]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSuggestedQuestion = (questionText) => {
    onSendMessage(questionText);
  };

  // Show WelcomeForm if there are no messages in the active conversation
  const showForm = !activeConversation || activeConversation.messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950 relative">
      
      {/* Top Navigation Bar */}
      <div className="h-14 md:h-16 border-b border-slate-100 dark:border-slate-900/60 px-4 md:px-6 flex items-center justify-between bg-white/70 dark:bg-slate-950/70 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-2">
          {!showForm && (
            <button
              onClick={onResetConsultation}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Back to Form"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="text-xs md:text-sm font-bold text-slate-800 dark:text-white leading-none">
              {showForm ? 'Career Profile Assessment' : activeConversation.title}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              {showForm ? 'Onboarding & Setup' : 'Interactive Recommendations'}
            </p>
          </div>
        </div>
        
        {!showForm && (
          <button
            onClick={onResetConsultation}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>New Profile</span>
          </button>
        )}
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {showForm ? (
          <WelcomeForm 
            onSubmit={onStartConsultation} 
            initialData={activeConversation?.studentProfile} 
          />
        ) : (
          <div className="flex-1 flex flex-col divide-y divide-slate-100 dark:divide-slate-900/60 pb-36">
            {activeConversation.messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={msg.role === 'assistant' && msg.id === activeConversation.messages[activeConversation.messages.length - 1].id ? onRegenerate : null}
                onSendSuggestedQuestion={handleSuggestedQuestion}
              />
            ))}
            
            {/* Webhook Loading state */}
            {isLoading && <LoadingIndicator />}

            {/* Error Message display */}
            {error && (
              <div className="flex w-full gap-4 py-6 px-4 md:px-6 justify-start bg-rose-50/50 dark:bg-rose-950/10">
                <div className="flex max-w-4xl gap-3.5 md:gap-5 flex-row">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-400">Connection Error</span>
                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {error}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={onRegenerate}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-355 transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Retry Webhook Connection</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Floating Chat Input (Only visible when conversation starts) */}
      {!showForm && (
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 dark:to-transparent shrink-0">
          <form 
            onSubmit={handleSend}
            className="max-w-3xl mx-auto relative flex items-center rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 glass focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a follow-up question about your roadmap or skills..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-5 py-4 text-sm outline-none text-slate-850 dark:text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="mr-3 p-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-650/20 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="text-center mt-2.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Pathfinder coordinates with your local profile settings. Chat history is saved locally.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
