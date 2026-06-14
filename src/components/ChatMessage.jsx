import React, { useState } from 'react';
import { 
  Copy, Check, Download, RefreshCw, Compass, User, 
  BookOpen, DollarSign, Award, Star, ArrowUpRight, CheckCircle2, ChevronRight 
} from 'lucide-react';

// A simple utility to parse markdown-like strings into HTML for rendering
// This avoids heavy external markdown parser libraries, while handling bolding, links, tables, list items, and breaks correctly.
function renderMarkdown(text) {
  if (!text) return '';

  let html = text
    // Escape HTML to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code: `code`
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Bullet points: - item or * item
    .replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>')
    // Wrap consecutive list items in <ul>
    .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>')
    // Headings: ### heading
    .replace(/^\s*###\s+(.*?)$/gm, '<h3>$1</h3>')
    .replace(/^\s*##\s+(.*?)$/gm, '<h2>$1</h2>')
    .replace(/^\s*#\s+(.*?)$/gm, '<h1>$1</h1>')
    // Line breaks
    .replace(/\n/g, '<br />');

  // Fix <ul> nesting breaks
  html = html.replace(/<\/ul><br \/><ul>/g, '');
  
  return <div className="prose-custom text-left" dangerouslySetInnerHTML={{ __html: html }} />;
}

// Helper to parse text into structured career recommendation fields
function parseStructuredRecommendation(content) {
  if (!content) return null;

  // Case 1: Already an object
  if (typeof content === 'object') {
    return {
      careerName: content.careerName || content.name || '',
      matchScore: content.matchScore || content.score || '',
      whyItMatches: content.whyItMatches || content.reason || '',
      requiredSkills: Array.isArray(content.requiredSkills) 
        ? content.requiredSkills 
        : (content.requiredSkills ? String(content.requiredSkills).split(',').map(s => s.trim()) : []),
      roadmap: content.roadmap || { beginner: '', intermediate: '', advanced: '' },
      salary: content.salary || { entry: '', mid: '', senior: '' },
      futureScope: content.futureScope || { demand: '', growth: '' },
      suggestedQuestions: content.suggestedQuestions || content.suggestedNextQuestions || []
    };
  }

  // Case 2: Try JSON parse
  try {
    const data = JSON.parse(content);
    return parseStructuredRecommendation(data);
  } catch (e) {
    // Case 3: Parse markdown/text fields using Regex
    const text = String(content);
    
    // Check if we have standard career indicators to justify structured rendering
    const hasCareerIndicator = /Career Name|Recommended Career/i.test(text);
    if (!hasCareerIndicator) return null;

    const extractField = (regexes) => {
      for (const regex of regexes) {
        const match = text.match(regex);
        if (match && match[1]) return match[1].trim();
      }
      return '';
    };

    const careerName = extractField([
      /Career Name\s*:\s*([^\n]+)/i,
      /Recommended Career\s*:\s*([^\n]+)/i,
      /### Recommended Career\s*\n\s*\*\s*([^\n]+)/i
    ]);

    const matchScore = extractField([
      /Match Score\s*:\s*([^\n]+)/i,
      /Score\s*:\s*([^\n]+)/i,
      /Match\s*:\s*([^\n]+)/i
    ]);

    const whyItMatches = extractField([
      /Why It Matches\s*:\s*([^\n]+)/i,
      /Why\s*:\s*([^\n]+)/i,
      /Reason\s*:\s*([^\n]+)/i
    ]);

    const rawSkills = extractField([
      /Required Skills\s*:\s*([^\n]+)/i,
      /Skills\s*:\s*([^\n]+)/i
    ]);
    const requiredSkills = rawSkills ? rawSkills.split(',').map(s => s.trim()).filter(Boolean) : [];

    const beginner = extractField([
      /Beginner\s*:\s*([^\n]+)/i,
      /Beginner Level\s*:\s*([^\n]+)/i,
      /Roadmap\s*-\s*Beginner\s*:\s*([^\n]+)/i
    ]);

    const intermediate = extractField([
      /Intermediate\s*:\s*([^\n]+)/i,
      /Intermediate Level\s*:\s*([^\n]+)/i,
      /Roadmap\s*-\s*Intermediate\s*:\s*([^\n]+)/i
    ]);

    const advanced = extractField([
      /Advanced\s*:\s*([^\n]+)/i,
      /Advanced Level\s*:\s*([^\n]+)/i,
      /Roadmap\s*-\s*Advanced\s*:\s*([^\n]+)/i
    ]);

    const entrySalary = extractField([
      /Entry Level\s*(Salary)?\s*:\s*([^\n]+)/i,
      /Entry\s*(Salary)?\s*:\s*([^\n]+)/i
    ]);

    const midSalary = extractField([
      /Mid Level\s*(Salary)?\s*:\s*([^\n]+)/i,
      /Mid\s*(Salary)?\s*:\s*([^\n]+)/i
    ]);

    const seniorSalary = extractField([
      /Senior Level\s*(Salary)?\s*:\s*([^\n]+)/i,
      /Senior\s*(Salary)?\s*:\s*([^\n]+)/i
    ]);

    const demand = extractField([
      /Demand level\s*:\s*([^\n]+)/i,
      /Demand\s*:\s*([^\n]+)/i,
      /Future Scope\s*-\s*Demand\s*:\s*([^\n]+)/i
    ]);

    const growth = extractField([
      /Growth potential\s*:\s*([^\n]+)/i,
      /Growth\s*:\s*([^\n]+)/i,
      /Future Scope\s*-\s*Growth\s*:\s*([^\n]+)/i
    ]);

    // Parse suggested questions
    const suggestedQuestions = [];
    const questionsBlock = text.match(/Suggested Next Questions[\s\S]*$/i);
    if (questionsBlock) {
      const lines = questionsBlock[0].split('\n');
      lines.forEach(line => {
        const qMatch = line.match(/^\s*(?:\d+\.|\*|-)\s+(.*?)\??\s*$/);
        if (qMatch && qMatch[1] && qMatch[1].trim()) {
          suggestedQuestions.push(qMatch[1].trim() + '?');
        }
      });
    }

    if (!careerName && !beginner && !entrySalary) return null;

    return {
      careerName: careerName || 'Matching Career',
      matchScore: matchScore || 'N/A',
      whyItMatches: whyItMatches || '',
      requiredSkills,
      roadmap: { beginner, intermediate, advanced },
      salary: { entry: entrySalary, mid: midSalary, senior: seniorSalary },
      futureScope: { demand, growth },
      suggestedQuestions
    };
  }
}

export default function ChatMessage({ message, onRegenerate, onSendSuggestedQuestion }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  // Parse structured data if it's an AI message
  const structuredData = !isUser ? parseStructuredRecommendation(message.content) : null;

  const handleCopy = () => {
    let textToCopy = '';
    if (typeof message.content === 'object') {
      textToCopy = JSON.stringify(message.content, null, 2);
    } else {
      textToCopy = message.content;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let reportText = '';
    
    if (structuredData) {
      reportText = `AI CAREER RECOMMENDATION REPORT
====================================
Career: ${structuredData.careerName}
Match Score: ${structuredData.matchScore}

Why It Matches:
${structuredData.whyItMatches}

Required Skills:
${structuredData.requiredSkills.join(', ')}

LEARNING ROADMAP
----------------
1. Beginner:
   ${structuredData.roadmap.beginner}
2. Intermediate:
   ${structuredData.roadmap.intermediate}
3. Advanced:
   ${structuredData.roadmap.advanced}

SALARY INSIGHTS
---------------
- Entry Level: ${structuredData.salary.entry}
- Mid Level: ${structuredData.salary.mid}
- Senior Level: ${structuredData.salary.senior}

FUTURE SCOPE
------------
- Demand level: ${structuredData.futureScope.demand}
- Growth potential: ${structuredData.futureScope.growth}

Generated by Pathfinder AI.
`;
    } else {
      reportText = typeof message.content === 'object' 
        ? JSON.stringify(message.content, null, 2) 
        : message.content;
    }

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Career_Recommendation_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex w-full gap-4 py-6 px-4 md:px-6 ${isUser ? 'justify-end' : 'justify-start border-b border-slate-100 dark:border-slate-900/60 bg-slate-50/30 dark:bg-slate-900/10'}`}>
      <div className={`flex max-w-4xl gap-3.5 md:gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md ${
          isUser 
            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' 
            : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
        }`}>
          {isUser ? <User className="h-5 w-5" /> : <Compass className="h-5 w-5" />}
        </div>

        {/* Message Content Container */}
        <div className="flex flex-col space-y-3 min-w-0 flex-1">
          {/* Header Role info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isUser ? 'You' : 'Pathfinder AI'}
            </span>
            <span className="text-[10px] text-slate-405 dark:text-slate-500 font-medium">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* User Text Bubble */}
          {isUser ? (
            <div className="rounded-2xl bg-indigo-600 px-4 py-3 text-white text-sm shadow-md shadow-indigo-650/15 max-w-prose">
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          ) : (
            // AI Response
            <div className="space-y-6">
              {/* Structured Career Recommendation Cards */}
              {structuredData ? (
                <div className="space-y-6">
                  {/* Card 1: Recommended Career */}
                  <div className="glass-card rounded-2xl p-5 md:p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-bl-full" />
                    
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-550 dark:text-indigo-400">Recommended Career</span>
                        <h3 className="text-xl md:text-2xl font-extrabold text-slate-850 dark:text-white mt-0.5 tracking-tight font-sans">
                          {structuredData.careerName}
                        </h3>
                      </div>
                      
                      {/* Match Score Badge */}
                      {structuredData.matchScore && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/60">
                          <Star className="h-4 w-4 text-indigo-500 fill-indigo-500 dark:text-indigo-400 dark:fill-indigo-400 animate-pulse-slow" />
                          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-350">
                            {structuredData.matchScore} Match
                          </span>
                        </div>
                      )}
                    </div>

                    {structuredData.whyItMatches && (
                      <div className="mb-4 text-sm text-slate-600 dark:text-slate-350 leading-relaxed border-l-3 border-indigo-500 pl-4 py-1 italic bg-slate-50/50 dark:bg-slate-950/20 rounded-r-lg">
                        {structuredData.whyItMatches}
                      </div>
                    )}

                    {structuredData.requiredSkills.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-2">Required Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {structuredData.requiredSkills.map((skill) => (
                            <span 
                              key={skill} 
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 2: Learning Roadmap */}
                  {(structuredData.roadmap.beginner || structuredData.roadmap.intermediate || structuredData.roadmap.advanced) && (
                    <div className="glass-card rounded-2xl p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/50 pb-3">
                        <BookOpen className="h-5 w-5 text-indigo-500" />
                        <h4 className="font-bold text-sm md:text-base text-slate-850 dark:text-white font-sans tracking-tight">Learning Roadmap</h4>
                      </div>

                      <div className="relative pl-6 border-l-2 border-indigo-100 dark:border-indigo-950/60 ml-2 space-y-6">
                        {/* Beginner step */}
                        {structuredData.roadmap.beginner && (
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-indigo-500 bg-white dark:bg-slate-900 text-indigo-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            </span>
                            <h5 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Beginner Level</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                              {structuredData.roadmap.beginner}
                            </p>
                          </div>
                        )}

                        {/* Intermediate step */}
                        {structuredData.roadmap.intermediate && (
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-purple-500 bg-white dark:bg-slate-900 text-purple-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            </span>
                            <h5 className="text-xs font-bold text-purple-650 dark:text-purple-400 uppercase tracking-wider">Intermediate Level</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                              {structuredData.roadmap.intermediate}
                            </p>
                          </div>
                        )}

                        {/* Advanced step */}
                        {structuredData.roadmap.advanced && (
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500 bg-white dark:bg-slate-900 text-emerald-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </span>
                            <h5 className="text-xs font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider">Advanced Level</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                              {structuredData.roadmap.advanced}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card 3: Salary Insights & Future Scope */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Salary Insights */}
                    <div className="glass-card rounded-2xl p-5 flex flex-col">
                      <div className="flex items-center gap-2 mb-3.5 border-b border-slate-100 dark:border-slate-800/50 pb-2.5">
                        <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
                        <h4 className="font-bold text-xs md:text-sm text-slate-850 dark:text-white uppercase tracking-wider font-sans">Salary Insights</h4>
                      </div>

                      <div className="space-y-2.5 flex-1 justify-center flex flex-col">
                        {/* Entry Level */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Entry Level</span>
                          <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {structuredData.salary.entry || 'N/A'}
                          </span>
                        </div>
                        {/* Mid Level */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Mid Level</span>
                          <span className="font-bold text-slate-800 dark:text-white bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                            {structuredData.salary.mid || 'N/A'}
                          </span>
                        </div>
                        {/* Senior Level */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Senior Level</span>
                          <span className="font-bold text-slate-800 dark:text-white bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-450 px-2 py-0.5 rounded-md">
                            {structuredData.salary.senior || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Future Scope */}
                    <div className="glass-card rounded-2xl p-5 flex flex-col">
                      <div className="flex items-center gap-2 mb-3.5 border-b border-slate-100 dark:border-slate-800/50 pb-2.5">
                        <Award className="h-4.5 w-4.5 text-purple-500" />
                        <h4 className="font-bold text-xs md:text-sm text-slate-850 dark:text-white uppercase tracking-wider font-sans">Future Scope</h4>
                      </div>

                      <div className="space-y-3 flex-1 flex flex-col justify-center text-xs">
                        {structuredData.futureScope.demand && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Market Demand</span>
                            <span className={`font-bold px-2 py-0.5 rounded-md capitalize ${
                              String(structuredData.futureScope.demand).toLowerCase().includes('high')
                                ? 'bg-indigo-50 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-455'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}>
                              {structuredData.futureScope.demand}
                            </span>
                          </div>
                        )}

                        {structuredData.futureScope.growth && (
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-500 font-medium">Growth Potential</span>
                            <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-[11px]">
                              {structuredData.futureScope.growth}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Normal Markdown Fallback
                <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 max-w-prose">
                  {typeof message.content === 'object' 
                    ? <pre className="p-3 bg-slate-900 text-slate-100 text-xs rounded-lg overflow-x-auto">{JSON.stringify(message.content, null, 2)}</pre> 
                    : renderMarkdown(message.content)
                  }
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                {/* Copy Response */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                  title="Copy response to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Download Report */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                  title="Download career analysis as text"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Report</span>
                </button>

                {/* Regenerate Response */}
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-indigo-650 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                    title="Re-run recommendation analysis"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Regenerate</span>
                  </button>
                )}
              </div>

              {/* Suggested Next Questions */}
              {structuredData && structuredData.suggestedQuestions && structuredData.suggestedQuestions.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-2">Suggested Next Questions</span>
                  <div className="flex flex-wrap gap-2">
                    {structuredData.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendSuggestedQuestion(q)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-indigo-100 bg-indigo-50/10 hover:bg-indigo-50/40 text-xs font-medium text-indigo-700 hover:text-indigo-800 dark:border-indigo-950/40 dark:bg-indigo-950/10 dark:text-indigo-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300 transition-all text-left group"
                      >
                        <span className="flex-1">{q}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
