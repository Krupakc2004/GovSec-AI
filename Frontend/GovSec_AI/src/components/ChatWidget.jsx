import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import '../styles/ChatWidget.css';

import { API_BASE } from "../config";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I am your Gujarat Government Scheme Assistant. Ask me about any government scheme in English or Gujarati.",
            sender: 'bot'
        },
        {
            id: 2,
            text: "નમસ્કાર! હું તમારો ગુજરાત સરકાર યોજના સહાયક છું. કોઈપણ સરકારી યોજના વિશે પૂછો.",
            sender: 'bot'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(`session_${Math.random().toString(36).substr(2, 9)}`);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/chatbot/chat`, {
                message: userMessage.text,
                sessionId: sessionId
            });

            const botMessage = {
                id: Date.now() + 1,
                text: response.data.response,
                sender: 'bot'
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "⚠️ Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chat-widget-container">
            {/* Toggle Button */}
            {!isOpen && (
                <button 
                    className="chat-bubble"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open Chatbot"
                >
                    <MessageSquare size={32} color="white" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="header-info">
                            <div className="bot-avatar">
                                <Bot size={22} />
                            </div>
                            <div className="header-text">
                                <h3>Scheme Assistant</h3>
                                <div className="status-indicator">
                                    <div className="status-dot"></div>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button 
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
                            >
                                <div className="bot-message-content">
                                    {msg.sender === 'bot' ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="typing-indicator">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Ask about schemes..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button 
                                className="send-button"
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                <Send size={18} color={!inputValue.trim() || isLoading ? "#64748b" : "#020617"} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
