import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import { submitStudentProfile, sendChatMessage } from './services/api';

export default function App() {
  // 1. Initial State from localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pathfinder-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [formWebhookUrl, setFormWebhookUrl] = useState(() => {
    return localStorage.getItem('pathfinder-form-webhook-url') || 'https://yug3108.app.n8n.cloud/webhook/9b232bdc-1075-46de-be03-a15f44657476';
  });

  const [chatWebhookUrl, setChatWebhookUrl] = useState(() => {
    return localStorage.getItem('pathfinder-chat-webhook-url') || 'https://yug3108.app.n8n.cloud/webhook/00188b58-3eee-4346-9a79-7e665032b55b/chat';
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('pathfinder-conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem('pathfinder-active-id');
    return saved || null;
  });

  // UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Sync Theme Class with Document Element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pathfinder-theme', theme);
  }, [theme]);

  // 3. Sync Conversations & Active ID with localStorage
  useEffect(() => {
    localStorage.setItem('pathfinder-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeId) {
      localStorage.setItem('pathfinder-active-id', activeId);
    } else {
      localStorage.removeItem('pathfinder-active-id');
    }
  }, [activeId]);

  // Find active conversation
  const activeConversation = conversations.find(c => c.id === activeId);

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Save Webhook Settings
  const handleSaveWebhook = (formUrl, chatUrl) => {
    setFormWebhookUrl(formUrl);
    setChatWebhookUrl(chatUrl);
    localStorage.setItem('pathfinder-form-webhook-url', formUrl);
    localStorage.setItem('pathfinder-chat-webhook-url', chatUrl);
  };

  // Start Consultation (Form Submit)
  const handleStartConsultation = async (studentProfile) => {
    setError(null);
    setIsLoading(true);

    const newChatId = `chat-${Date.now()}`;
    const newSessionId = `session-${Date.now()}`;
    const initialUserPrompt = `Hi, my name is ${studentProfile.name}. I am ${studentProfile.age} years old and currently studying ${studentProfile.course} (${studentProfile.education}). 

My skills include: ${studentProfile.skills}.
My main interests are: ${studentProfile.interests}.
My favorite subjects are: ${studentProfile.favoriteSubjects}.
My ultimate career goal is to: ${studentProfile.careerGoals}.
I prefer a ${studentProfile.workStyle} work style and I am based in ${studentProfile.location}.

Please analyze my profile and give me personalized career recommendations.`;

    const newChat = {
      id: newChatId,
      sessionId: newSessionId,
      title: `Career Consultation - ${studentProfile.name.split(' ')[0]}`,
      timestamp: Date.now(),
      studentProfile: studentProfile,
      messages: [
        {
          id: `msg-${Date.now()}-user`,
          role: 'user',
          content: initialUserPrompt,
          timestamp: Date.now()
        }
      ]
    };

    // Optimistically set the active conversation so loading screen is shown in ChatArea
    setConversations(prev => [newChat, ...prev]);
    setActiveId(newChatId);

    try {
      // Step 1: Submit profile via form submission webhook
      await submitStudentProfile(formWebhookUrl, studentProfile);

      // Step 2: Trigger initial AI recommendation via chat agent webhook
      const response = await sendChatMessage(chatWebhookUrl, initialUserPrompt, newSessionId);
      
      const assistantMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setConversations(prev => prev.map(c => {
        if (c.id === newChatId) {
          return {
            ...c,
            messages: [...c.messages, assistantMessage]
          };
        }
        return c;
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while fetching recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  // Send Follow-up Message
  const handleSendMessage = async (text) => {
    if (!activeConversation) return;

    setError(null);
    setIsLoading(true);

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    // Append user message immediately
    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [...c.messages, userMessage]
        };
      }
      return c;
    }));

    const sessionId = activeConversation.sessionId || `session-${activeConversation.id}`;

    try {
      const response = await sendChatMessage(chatWebhookUrl, text, sessionId);
      
      const assistantMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...c.messages, assistantMessage]
          };
        }
        return c;
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to get a response from Pathfinder AI.");
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate last recommendation/response
  const handleRegenerate = async () => {
    if (!activeConversation) return;

    setError(null);
    setIsLoading(true);

    // Filter out the last message if it is an assistant message, so we can re-fetch
    const msgs = [...activeConversation.messages];
    const lastMsg = msgs[msgs.length - 1];

    if (lastMsg && lastMsg.role === 'assistant') {
      msgs.pop(); // Remove it
      // Restore conversations state without the last AI response
      setConversations(prev => prev.map(c => {
        if (c.id === activeId) {
          return { ...c, messages: msgs };
        }
        return c;
      }));
    }

    const lastUserMsg = msgs[msgs.length - 1];
    if (!lastUserMsg || lastUserMsg.role !== 'user') {
      setIsLoading(false);
      return;
    }

    const sessionId = activeConversation.sessionId || `session-${activeConversation.id}`;

    try {
      const response = await sendChatMessage(chatWebhookUrl, lastUserMsg.content, sessionId);
      
      const assistantMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...c.messages, assistantMessage]
          };
        }
        return c;
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to regenerate recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear / Reset Active Chat to profile onboarding form
  const handleResetConsultation = () => {
    // We keep the conversation ID, but empty its messages so it goes back to form mode,
    // pre-filling with its original student profile details
    if (!activeConversation) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: []
        };
      }
      return c;
    }));
  };

  // Create clean slate new chat
  const handleNewChat = () => {
    setActiveId(null);
    setError(null);
    setIsLoading(false);
  };

  // Select a Chat from Sidebar
  const handleSelectConversation = (id) => {
    setActiveId(id);
    setError(null);
    setIsLoading(false);
  };

  // Delete Conversation
  const handleDeleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* 1. Sidebar Panel */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. Main Chat/Onboarding Area */}
      <ChatArea
        activeConversation={activeConversation}
        isLoading={isLoading}
        error={error}
        onStartConsultation={handleStartConsultation}
        onSendMessage={handleSendMessage}
        onRegenerate={handleRegenerate}
        onResetConsultation={handleResetConsultation}
      />

      {/* 3. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        formWebhookUrl={formWebhookUrl}
        chatWebhookUrl={chatWebhookUrl}
        onSave={handleSaveWebhook}
      />
    </div>
  );
}
