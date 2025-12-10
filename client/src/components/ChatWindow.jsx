import React, { useRef, useEffect, useState } from 'react';
import { Send, User as UserIcon, Bot } from 'lucide-react';

const ChatWindow = ({ messages, activeChatId, onSendMessage, loading, isDarkMode }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className={`flex-1 flex flex-col h-full relative ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
            }`}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto w-full">
                {!activeChatId ? (
                    <div className="flex-1 flex flex-col items-center justify-center h-full">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                            <Bot size={32} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                    </div>
                ) : (
                    <div className="flex flex-col pb-32 pt-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`w-full py-6 px-4 md:px-6 ${isDarkMode
                                    ? (msg.sender === 'assistant' ? 'bg-gray-800' : 'bg-gray-800')
                                    : (msg.sender === 'assistant' ? 'bg-white' : 'bg-white')
                                    }`}
                            >
                                <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
                                    <div className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center ${msg.sender === 'assistant'
                                        ? 'bg-green-500'
                                        : (isDarkMode ? 'bg-purple-600' : 'bg-blue-600')
                                        }`}>
                                        {msg.sender === 'assistant'
                                            ? <Bot size={20} className="text-white" />
                                            : <UserIcon size={20} className="text-white" />
                                        }
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <p className={`font-semibold text-sm opacity-90 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                            }`}>
                                            {msg.sender === 'assistant' ? 'Saha AI' : 'You'}
                                        </p>
                                        <div className={`prose max-w-none text-[15px] leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'prose-invert text-gray-300' : 'text-gray-800'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="w-full py-6 px-4 md:px-6">
                                <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
                                    <div className="w-8 h-8 rounded-sm shrink-0 flex items-center justify-center bg-green-500">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`w-2 h-2 rounded-full animate-bounce mr-1 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`}></span>
                                        <span className={`w-2 h-2 rounded-full animate-bounce mr-1 delay-75 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`}></span>
                                        <span className={`w-2 h-2 rounded-full animate-bounce delay-150 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area (Sticky Bottom) */}
            <div className={`absolute bottom-0 left-0 w-full border-t p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className={`relative flex items-center w-full p-3 rounded-2xl border shadow-sm transition-colors ${isDarkMode
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-white border-gray-300'
                        }`}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Message Saha AI..."
                            className={`w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none max-h-32 min-h-[24px] placeholder-gray-400 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                            rows="1"
                            style={{ height: 'auto', minHeight: '24px' }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={`ml-2 p-2 self-end rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${input.trim() && !loading
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : (isDarkMode ? 'bg-transparent text-gray-500' : 'bg-transparent text-gray-400')
                                }`}
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Included AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
