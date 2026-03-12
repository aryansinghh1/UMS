import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, ArrowLeft, Users, BookOpen, Megaphone } from 'lucide-react';
import API from '../services/api';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { courseId, userId, userName, courseTitle }
  const [newMessage, setNewMessage] = useState('');
  const [view, setView] = useState('conversations'); // 'conversations' | 'newChat' | 'chat' | 'announce'
  const [loading, setLoading] = useState(false);
  const [announceText, setAnnounceText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [announceStatus, setAnnounceStatus] = useState(null); // { type: 'success'|'error', msg: '' }
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const currentUserId = userInfo?._id;

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages/conversations');
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  // Fetch contacts (people the user can message)
  const fetchContacts = async () => {
    try {
      const { data } = await API.get('/messages/contacts');
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  // Fetch messages for active chat
  const fetchMessages = async (courseId, userId) => {
    try {
      const { data } = await API.get(`/messages/course/${courseId}/user/${userId}`);
      setMessages(data);
      // Mark as read
      await API.put(`/messages/read/${courseId}/${userId}`);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll for new messages when in a chat
  useEffect(() => {
    if (activeChat) {
      pollRef.current = setInterval(() => {
        fetchMessages(activeChat.courseId, activeChat.userId);
      }, 10000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = (courseId, userId, userName, courseTitle) => {
    setActiveChat({ courseId, userId, userName, courseTitle });
    setView('chat');
    setLoading(true);
    fetchMessages(courseId, userId).then(() => setLoading(false));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await API.post('/messages', {
        receiverId: activeChat.userId,
        courseId: activeChat.courseId,
        content: newMessage.trim(),
      });
      setNewMessage('');
      fetchMessages(activeChat.courseId, activeChat.userId);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const goBack = () => {
    setView('conversations');
    setActiveChat(null);
    setMessages([]);
    fetchConversations();
  };

  const openNewChat = () => {
    setView('newChat');
    fetchContacts();
  };

  const openAnnounce = () => {
    setView('announce');
    setAnnounceText('');
    setSelectedCourse(null);
    setAnnounceStatus(null);
    fetchContacts();
  };

  const handleAnnounce = async (e) => {
    e.preventDefault();
    if (!announceText.trim() || !selectedCourse) return;

    try {
      const { data } = await API.post('/messages/announce', {
        courseId: selectedCourse,
        content: announceText.trim(),
      });
      setAnnounceStatus({ type: 'success', msg: data.message });
      setAnnounceText('');
      setSelectedCourse(null);
    } catch (err) {
      setAnnounceStatus({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to send announcement',
      });
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // --- CONVERSATION LIST VIEW ---
  if (view === 'conversations') {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={32} />
            Messages
          </h1>
          <div className="flex gap-3">
            {userInfo?.role === 'faculty' && (
              <button
                onClick={openAnnounce}
                className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Megaphone size={18} />
                Announce
              </button>
            )}
            <button
              onClick={openNewChat}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              New Message
            </button>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-1">Start a new conversation with your faculty or students</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv, i) => (
              <div
                key={i}
                onClick={() =>
                  openChat(conv.course._id, conv.otherUser._id, conv.otherUser.name, conv.course.title)
                }
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {conv.otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 truncate">{conv.otherUser.name}</h3>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {formatTime(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-blue-500 font-medium">{conv.course.title}</p>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{conv.lastMessage.content}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- NEW CHAT (CONTACTS) VIEW ---
  if (view === 'newChat') {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">New Message</h1>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No contacts available</p>
            <p className="text-gray-400 text-sm mt-1">
              {userInfo?.role === 'student'
                ? 'Enroll in courses to message faculty'
                : 'Students need to enroll in your courses first'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {contacts.map((group) => (
              <div key={group.course._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-600" />
                  <span className="font-semibold text-slate-700">{group.course.title}</span>
                  <span className="text-xs text-gray-400 ml-1">({group.course.courseCode})</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {group.people.map((person) => (
                    <div
                      key={person._id}
                      onClick={() => openChat(group.course._id, person._id, person.name, group.course.title)}
                      className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{person.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{person.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- ANNOUNCE VIEW (Faculty only) ---
  if (view === 'announce') {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="text-orange-500" size={28} />
            Send Announcement
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <p className="text-gray-500 text-sm">
            Send a message to all enrolled students in a course at once.
          </p>

          {/* Course selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contacts.map((group) => (
                <button
                  key={group.course._id}
                  type="button"
                  onClick={() => setSelectedCourse(group.course._id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedCourse === group.course._id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <p className="font-semibold text-slate-800">{group.course.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {group.course.courseCode} &middot; {group.people.length} student{group.people.length !== 1 ? 's' : ''}
                  </p>
                </button>
              ))}
            </div>
            {contacts.length === 0 && (
              <p className="text-gray-400 text-sm mt-2">No courses with enrolled students found.</p>
            )}
          </div>

          {/* Message input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
            <textarea
              value={announceText}
              onChange={(e) => setAnnounceText(e.target.value)}
              rows={4}
              placeholder="Type your announcement here..."
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm resize-none"
            />
          </div>

          {/* Status message */}
          {announceStatus && (
            <div
              className={`p-3 rounded-lg text-sm ${
                announceStatus.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {announceStatus.msg}
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleAnnounce}
            disabled={!selectedCourse || !announceText.trim()}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Megaphone size={18} />
            Send to All Students
          </button>
        </div>
      </div>
    );
  }

  // --- CHAT VIEW ---
  return (
    <div className="p-8 flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
        <button onClick={goBack} className="text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
          {activeChat?.userName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">{activeChat?.userName}</h2>
          <p className="text-xs text-blue-500 font-medium">{activeChat?.courseTitle}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-slate-50 border-x border-gray-100 overflow-y-auto px-5 py-4 space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender._id === currentUserId;
            return (
              <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                    isMine
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-slate-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  {msg.isAnnouncement && (
                    <div className={`flex items-center gap-1 text-[10px] font-semibold mb-1 ${isMine ? 'text-blue-200' : 'text-orange-500'}`}>
                      <Megaphone size={10} />
                      Announcement
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'} text-right`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message Input */}
      <form
        onSubmit={handleSend}
        className="bg-white rounded-b-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
