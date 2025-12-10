import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import axios from '../api/axios';
import { Menu } from 'lucide-react';

const ChatInterface = () => {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (activeChatId) {
            fetchMessages(activeChatId);
        } else {
            setMessages([]);
        }
    }, [activeChatId]);

    const fetchChats = async () => {
        try {
            const { data } = await axios.get('/chat/all');
            setChats(data);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const { data } = await axios.get(`/chat/${chatId}`);
            setMessages(data.messages);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleNewChat = () => {
        setActiveChatId(null);
        setMessages([]);
        setSidebarOpen(false);
    };

    const handleSendMessageSmart = async (text) => {
        setLoading(true);
        const tempUserMsg = { sender: 'user', content: text };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            const { data } = await axios.post('/chat/message', { message: text, chatId: activeChatId });

            const newChatId = data.userMsg.chatId;

            if (activeChatId !== newChatId) {
                setActiveChatId(newChatId);
                fetchChats();
            }

            setMessages(prev => {
                const withoutTemp = prev.slice(0, -1);
                return [...withoutTemp, data.userMsg, data.aiMsg];
            });

        } catch (error) {
            console.error("Error", error);
            setMessages(prev => [...prev, { sender: 'assistant', content: "Sorry, I encountered an error." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteChat = async (chatId) => {
        if (!window.confirm("Delete this chat?")) return;
        try {
            await axios.delete(`/chat/${chatId}`);
            setChats(prev => prev.filter(c => c._id !== chatId));
            if (activeChatId === chatId) {
                setActiveChatId(null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
    };

    const handleRenameChat = async (chatId, newTitle) => {
        try {
            const { data } = await axios.put(`/chat/${chatId}`, { title: newTitle });
            setChats(prev => prev.map(c => c._id === chatId ? { ...c, title: data.title } : c));
        } catch (error) {
            console.error("Failed to rename chat", error);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`flex h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`fixed inset-0 z-20 bg-black/50 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />

            <div className={`fixed md:relative z-30 h-full transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <Sidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    onSelectChat={(id) => { setActiveChatId(id); setSidebarOpen(false); }}
                    onNewChat={handleNewChat}
                    onDeleteChat={handleDeleteChat}
                    onRenameChat={handleRenameChat}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className={`md:hidden p-4 flex items-center gap-3 border-b ${isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'
                    }`}>
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu />
                    </button>
                    <span className="font-semibold">Saha AI</span>
                </div>

                <ChatWindow
                    messages={messages}
                    activeChatId={activeChatId}
                    onSendMessage={handleSendMessageSmart}
                    loading={loading}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
};

export default ChatInterface;
