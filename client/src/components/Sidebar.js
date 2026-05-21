import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getChats, createChat, deleteChat } from '../utils/api';
import './Sidebar.css';

export default function Sidebar({ onChatSelect, refreshTrigger, isOpen, onClose }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();

  const loadChats = useCallback(async () => {
    try {
      const { data } = await getChats();
      setChats(data.chats);
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChats(); }, [loadChats, refreshTrigger]);

  const handleNewChat = async () => {
    try {
      const { data } = await createChat();
      setChats((prev) => [data.chat, ...prev]);
      navigate(`/chat/${data.chat._id}`);
      if (onChatSelect) onChatSelect(data.chat._id);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChatId === chatId) navigate('/chat');
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const handleSelectChat = (chatId) => {
    navigate(`/chat/${chatId}`);
    if (onChatSelect) onChatSelect(chatId);
    if (onClose) onClose();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const groupedChats = chats.reduce((groups, chat) => {
    const label = formatDate(chat.updatedAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(chat);
    return groups;
  }, {});

  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span>✦</span> NexusAI
          </div>
          <button className="sidebar__close" onClick={onClose}>✕</button>
        </div>

        {/* New Chat */}
        <button className="sidebar__new-chat" onClick={handleNewChat}>
          <span className="sidebar__new-icon">+</span>
          New conversation
        </button>

        {/* Chats list */}
        <div className="sidebar__list">
          {loading ? (
            <div className="sidebar__loading">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="sidebar__skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="sidebar__empty">
              <div className="sidebar__empty-icon">💬</div>
              <p>No conversations yet</p>
              <span>Start a new chat above</span>
            </div>
          ) : (
            Object.entries(groupedChats).map(([label, groupChats]) => (
              <div key={label} className="sidebar__group">
                <div className="sidebar__group-label">{label}</div>
                {groupChats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`sidebar__chat-item ${activeChatId === chat._id ? 'sidebar__chat-item--active' : ''}`}
                    onClick={() => handleSelectChat(chat._id)}
                  >
                    <span className="sidebar__chat-icon">◈</span>
                    <span className="sidebar__chat-title">{chat.title}</span>
                    <button
                      className="sidebar__delete-btn"
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      title="Delete chat"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* User section */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user?.name}</span>
              <span className="sidebar__user-email">{user?.email}</span>
            </div>
          </div>
          <button className="sidebar__logout" onClick={logoutUser} title="Sign out">
            ⏻
          </button>
        </div>
      </aside>
    </>
  );
}
