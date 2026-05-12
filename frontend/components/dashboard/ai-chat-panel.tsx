'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  X,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "Show pending DIR-3 KYC",
  "Outstanding invoices",
  "Generate board resolution",
  "Upcoming due dates",
  "Who are current directors?",
  "Compliance status report",
];

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m Niyam AI, your compliance operations assistant. I can help you with filings, compliance tracking, client management, and more. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I've analyzed your query about "${messageText}". Here's what I found:\n\n• You have 3 pending DIR-3 KYC tasks\n• Total outstanding invoices: ₹8.4L\n• Next compliance deadline: May 20, 2026\n\nWould you like me to provide more details or help with anything else?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-80 h-screen bg-white border-l border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Niyam AI</h2>
              <p className="text-xs text-gray-500">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                <Sparkles size={32} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Welcome to Niyam AI</h3>
              <p className="text-xs text-gray-500">Your AI-powered compliance assistant</p>
            </motion.div>
          ) : (
            messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {/* Actions for assistant messages */}
                  {message.type === 'assistant' && (
                    <div className="flex gap-2 mt-2 -mx-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy size={14} className="text-gray-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <ThumbsUp size={14} className="text-gray-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <ThumbsDown size={14} className="text-gray-600" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="bg-gray-100 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Prompts or Input */}
      {messages.length === 1 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3 border-t border-gray-200 bg-gray-50"
        >
          <p className="text-xs font-medium text-gray-600 mb-2">Suggested</p>
          <div className="space-y-2">
            {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 2 }}
                onClick={() => handleSendMessage(prompt)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 transition-all"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white disabled:opacity-50 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
