import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCheck, Phone, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Assalomu alaykum! Uy bo\'yicha savolim bor edi.', sender: 'other', time: '10:30' },
    { id: '2', text: 'Va alaykum assalom! Albatta, qanday savolingiz bor?', sender: 'me', time: '10:32' },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'me', time: '10:35' }]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-2xl">
      <div className="p-5 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/seed/user1/100/100" className="w-12 h-12 rounded-2xl object-cover" alt="User" />
          <div>
            <h3 className="font-black text-gray-900">Azizbek Karimov</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Onlayn</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 text-gray-400 hover:text-emerald-600 transition-colors bg-gray-50 rounded-2xl"><Phone size={20} /></button>
          <button className="p-3 text-gray-400 hover:text-emerald-600 transition-colors bg-gray-50 rounded-2xl"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                msg.sender === 'me' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none border border-black/5'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${msg.sender === 'me' ? 'text-emerald-100' : 'text-gray-400'}`}>
                  <span>{msg.time}</span>
                  {msg.sender === 'me' && <CheckCheck size={14} />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-5 bg-white border-t border-black/5">
        <div className="flex items-center gap-3 bg-gray-50 rounded-3xl p-1.5 border border-black/5">
          <input
            type="text"
            placeholder="Xabar yozing..."
            className="flex-1 bg-transparent py-3.5 px-5 focus:outline-none font-bold text-sm"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-90 transition-all">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
