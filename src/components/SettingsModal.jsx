import React, { useState } from 'react';
import { X, Settings, Link2, Info, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, formWebhookUrl, chatWebhookUrl, onSave }) {
  const [formUrl, setFormUrl] = useState(formWebhookUrl);
  const [chatUrl, setChatUrl] = useState(chatWebhookUrl);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formUrl, chatUrl);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleCopySample = () => {
    const samplePayload = `{
  "name": "Alex",
  "age": "21",
  "education": "Bachelor's Degree",
  "course": "Computer Science",
  "skills": "JavaScript, Python, React",
  "interests": "AI, UI/UX, Automation",
  "favoriteSubjects": "Algorithms, HCI",
  "careerGoals": "Software Engineer",
  "workStyle": "Remote / Hybrid",
  "location": "New York, USA",
  "additionalInfo": "None"
}`;
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 glass animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Settings className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure your chatbot endpoints and services</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800/80 dark:hover:text-slate-350 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-2">
              n8n Form Ingestion Webhook URL (Onboarding Form)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Link2 className="h-5 w-5 text-slate-450 dark:text-slate-505" />
              </div>
              <input
                type="url"
                required
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-450 dark:focus:bg-slate-950"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
              <Info className="h-3.5 w-3.5 mt-0.5 text-indigo-500 shrink-0" />
              <span>Enter the webhook URL for the <strong>On form submission</strong> trigger.</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-2">
              n8n Chat Agent Webhook URL (When chat message received)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Link2 className="h-5 w-5 text-slate-450 dark:text-slate-550" />
              </div>
              <input
                type="url"
                required
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={chatUrl}
                onChange={(e) => setChatUrl(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-450 dark:focus:bg-slate-950"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
              <Info className="h-3.5 w-3.5 mt-0.5 text-indigo-550 shrink-0" />
              <span>Enter the webhook URL for the <strong>When chat message received</strong> trigger.</span>
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 dark:border-indigo-950/30 dark:bg-indigo-950/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                Expected Request Schema
              </span>
              <button
                type="button"
                onClick={handleCopySample}
                className="text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Example'}
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto max-h-[140px] custom-scrollbar bg-slate-950/5 dark:bg-slate-950/45 p-2.5 rounded-lg">
{`{
  "name": "String",
  "age": "String",
  "education": "String",
  "course": "String",
  "skills": "String",
  "interests": "String",
  "favoriteSubjects": "String",
  "careerGoals": "String",
  "workStyle": "String",
  "location": "String",
  "additionalInfo": "String"
}`}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-650 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saved}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-md ${
                saved 
                  ? 'bg-emerald-500 shadow-emerald-500/20' 
                  : 'bg-indigo-650 hover:bg-indigo-600 active:scale-95 shadow-indigo-650/20 hover:shadow-indigo-650/30'
              }`}
            >
              {saved ? (
                <>
                  <Check className="h-4.5 w-4.5" />
                  Saved Successfully
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
