import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Maximize2, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { API_BASE_URL } from '../config';

interface Message {
  role: 'user' | 'model';
  text: string;
  feedback?: 'positive' | 'negative';
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Namaste! Main P S NAKEEBPUR 2ND ka AI assistant hoon. Main aapki kaise madad kar sakta hoon?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY;
      
      if (!apiKey || apiKey.length < 10) {
        throw new Error('MISSING_KEY');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const chatHistory = messages
        .filter((m, index) => index > 0 || m.role === 'user')
        .concat({ role: 'user', text: userMessage })
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: chatHistory,
        config: {
          systemInstruction: "You are the AI Assistant for 'Primary School Nakeebpur Second' (P S NAKEEBPUR 2ND), established in 1954. You are helpful, polite, and knowledgeable about school management. Use Hinglish (Hindi + English).",
        },
      });

      const aiText = response.text || "Maaf kijiye, main abhi samajh nahi pa raha hoon.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error: any) {
      console.error('Chat Error:', error);
      let errorMsg = "Technical error! Kripya check karein ki internet chal raha hai.";
      
      if (error.message === 'MISSING_KEY') {
        errorMsg = "API Key nahi mili! Kripya .env file mein VITE_GEMINI_API_KEY check karein.";
      } else if (error.message?.includes('503') || error.message?.includes('high demand')) {
        errorMsg = "Abhi server par bahut load hai (High Demand). Kripya 1 minute baad phir se try karein.";
      } else if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID')) {
        errorMsg = "API Key galat hai. Kripya Google AI Studio se nayi key lein.";
      } else {
        errorMsg = `Error: ${error.message || 'Unknown error'}. Kripya check karein ki API Key sahi hai.`;
      }
      
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (index: number, rating: 'positive' | 'negative') => {
    if (feedbackSent[index]) return;

    const message = messages[index];
    const userMessage = messages[index - 1];

    try {
      await fetch(`${API_BASE_URL}/api/chatbot/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_text: userMessage?.text || 'N/A',
          response_text: message.text,
          rating
        })
      });

      setFeedbackSent(prev => ({ ...prev, [index]: true }));
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[index] = { ...newMessages[index], feedback: rating };
        return newMessages;
      });
    } catch (err) {
      console.error('Feedback Error:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-800 transition-all group"
          >
            <MessageSquare className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className={`bg-white rounded-2xl shadow-2xl border border-black/5 flex flex-col overflow-hidden transition-all duration-300 ${
              isMinimized ? 'h-16 w-72' : 'h-[500px] w-80 md:w-96'
            }`}
          >
            {/* Header */}
            <div className="bg-blue-700 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">School AI Assistant</h3>
                  <p className="text-[10px] opacity-70">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
                >
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[80%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                          m.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-white border border-black/5 text-slate-400'
                        }`}>
                          {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${
                          m.role === 'user' 
                            ? 'bg-blue-700 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 border border-black/5 rounded-tl-none shadow-sm'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                      
                      {/* Feedback Buttons for Model Messages (except first greeting) */}
                      {m.role === 'model' && i > 0 && (
                        <div className="flex items-center gap-2 mt-1 ml-8">
                          {feedbackSent[i] ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                              <Check size={10} /> Feedback sent
                            </span>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleFeedback(i, 'positive')}
                                className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                                title="Helpful"
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button 
                                onClick={() => handleFeedback(i, 'negative')}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                title="Not helpful"
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-black/5 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-blue-700" />
                        <span className="text-xs text-slate-400 italic">Assistant is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-black/5 bg-white">
                  <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
