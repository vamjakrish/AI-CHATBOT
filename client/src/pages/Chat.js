import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Message, { TypingIndicator } from '../components/Message';
import { getChatById, createChat, sendMessage, clearMessages } from '../utils/api';
import './Chat.css';

const SUGGESTIONS = [
  'Explain quantum computing in simple terms',
  'Write a Python function to sort a list',
  'What are the best practices for REST APIs?',
  'Help me debug this JavaScript code',
];

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatTitle, setChatTitle] = useState('New conversation');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeChatId, setActiveChatId] = useState(id || null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, loading, scrollToBottom]);

  // Load chat when ID changes
  useEffect(() => {
    const loadChat = async () => {
      if (!id) {
        setMessages([]);
        setChatTitle('New conversation');
        setActiveChatId(null);
        return;
      }
      setChatLoading(true);
      setError('');
      try {
        const { data } = await getChatById(id);
        setMessages(data.chat.messages);
        setChatTitle(data.chat.title);
        setActiveChatId(id);
      } catch (err) {
        setError('Could not load this chat. It may have been deleted.');
        navigate('/chat');
      } finally {
        setChatLoading(false);
      }
    };
    loadChat();
  }, [id, navigate]);

  const ensureChatExists = async () => {
    if (activeChatId) return activeChatId;
    const { data } = await createChat();
    const newId = data.chat._id;
    setActiveChatId(newId);
    navigate(`/chat/${newId}`, { replace: true });
    return newId;
  };

  const handleSend = async (messageText = null) => {
  if (loading) return;

  const text = (messageText || input).trim();

  if (!text) return;

  setLoading(true);
  setError('');

  try {
    setInput('');

    const optimisticMsg = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    const chatId = await ensureChatExists();

    await new Promise((resolve) => setTimeout(resolve, 800));

    const { data } = await sendMessage(chatId, text);

    setMessages((prev) => [
      ...prev,
      data.aiMessage,
    ]);

    if (data.title) {
      setChatTitle(data.title);
    }

    setRefreshTrigger((n) => n + 1);

  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.error ||
      'Failed to send message.'
    );
  } finally {
    setLoading(false);
  }
};

  const handleClearChat = async () => {
    if (!activeChatId || !window.confirm('Clear all messages in this chat?')) return;
    try {
      await clearMessages(activeChatId);
      setMessages([]);
      setChatTitle('New conversation');
      setRefreshTrigger((n) => n + 1);
    } catch (err) {
      setError('Failed to clear chat.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextarea = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  return (
    <div className="chat">
      <Sidebar
        refreshTrigger={refreshTrigger}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="chat__main">
        <header className="chat__header">
          <button className="chat__menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            ☰
          </button>
          <div className="chat__header-title">
            <span className="chat__header-icon">✦</span>
            <h1>{chatTitle}</h1>
          </div>
          <div className="chat__header-actions">
            {activeChatId && messages.length > 0 && (
              <button className="chat__action-btn" onClick={handleClearChat} title="Clear chat">
                🗑 Clear
              </button>
            )}
          </div>
        </header>

        <div className="chat__messages">
          {chatLoading ? (
            <div className="chat__center">
              <div className="chat__spinner" />
            </div>
          ) : messages.length === 0 ? (
            <div className="chat__welcome fade-in">
              <div className="chat__welcome-icon">✦</div>
              <h2>How can I help you today?</h2>
              <p>Ask me anything — I'm powered by Google Gemini and ready to assist.</p>
              <div className="chat__suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="chat__suggestion"
                    onClick={() => handleSend(s)}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat__messages-inner">
              {messages.map((msg, i) => (
                <Message key={i} {...msg} />
              ))}
              {loading && <TypingIndicator />}
              {error && (
                <div className="chat__error fade-in">
                  <span>⚠</span> {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat__input-area">
          <div className="chat__input-container">
            <textarea
              ref={textareaRef}
              className="chat__textarea"
              value={input}
              onChange={(e) => { setInput(e.target.value); adjustTextarea(e); }}
              onKeyDown={handleKeyDown}
              placeholder="Message NexusAI..."
              rows={1}
              disabled={loading}
            />
            <button
              className={`chat__send-btn ${input.trim() && !loading ? 'chat__send-btn--active' : ''}`}
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              {loading ? <span className="chat__send-spinner" /> : '↑'}
            </button>
          </div>
          <p className="chat__disclaimer">
            NexusAI can make mistakes. Consider verifying important info. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </div>
    </div>
  );
}
