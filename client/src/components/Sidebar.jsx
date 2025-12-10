import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, LogOut, User as UserIcon, Edit2, Share2, Moon, Sun, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onRenameChat, isDarkMode, toggleTheme }) => {
    const { user, logout } = useAuth();
    const [editingChatId, setEditingChatId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const startEditing = (e, chat) => {
        e.stopPropagation();
        setEditingChatId(chat._id);
        setEditTitle(chat.title);
    };

    const cancelEditing = (e) => {
        e?.stopPropagation();
        setEditingChatId(null);
        setEditTitle('');
    };

    const saveEditing = (e, chatId) => {
        e.stopPropagation();
        if (editTitle.trim()) {
            onRenameChat(chatId, editTitle);
        }
        setEditingChatId(null);
    };

    const handleShare = (e, chatId) => {
        e.stopPropagation();
        const url = `${window.location.origin}/chat/${chatId}`;
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };

    return (
        <div className={`w-64 flex flex-col h-full border-r transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
            } hidden md:flex`}>

            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-md transition-colors text-sm font-medium border ${isDarkMode
                            ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                            : 'bg-white hover:bg-gray-100 border-gray-300 shadow-sm'
                        }`}
                >
                    <Plus size={16} />
                    New chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-600">
                <h3 className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                    Recent
                </h3>
                {chats.map((chat) => (
                    <div
                        key={chat._id}
                        className={`group relative flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-colors text-sm overflow-hidden ${activeChatId === chat._id
                                ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
                                : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                            }`}
                        onClick={() => onSelectChat(chat._id)}
                    >
                        <MessageSquare size={16} className="shrink-0" />

                        {editingChatId === chat._id ? (
                            <div className="flex items-center flex-1 gap-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className={`w-full bg-transparent border-b text-xs focus:outline-none ${isDarkMode ? 'border-gray-500 text-white' : 'border-gray-400 text-gray-900'
                                        }`}
                                    autoFocus
                                />
                                <button onClick={(e) => saveEditing(e, chat._id)} className="text-green-500 hover:text-green-400 p-1">
                                    <Check size={14} />
                                </button>
                                <button onClick={cancelEditing} className="text-red-500 hover:text-red-400 p-1">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="truncate flex-1">{chat.title}</span>

                                <div className={`flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 ${activeChatId === chat._id ? 'opacity-100' : ''
                                    }`}>
                                    <button
                                        onClick={(e) => startEditing(e, chat)}
                                        className="p-1 text-gray-400 hover:text-blue-400"
                                        title="Rename"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => handleShare(e, chat._id)}
                                        className="p-1 text-gray-400 hover:text-green-400"
                                        title="Share"
                                    >
                                        <Share2 size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChat(chat._id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div
                    onClick={toggleTheme}
                    className={`flex items-center gap-3 px-2 py-2 mb-2 rounded-md transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="text-sm font-medium">
                        {isDarkMode ? 'Light mode' : 'Dark mode'}
                    </span>
                </div>

                <div className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors cursor-pointer group ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shrink-0">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user?.username}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className={`p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
