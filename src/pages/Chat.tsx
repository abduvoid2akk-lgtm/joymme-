import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Info, MoreVertical, CheckCheck, ChevronLeft, Image, MapPin, Headset } from 'lucide-react';
import { CustomUserIcon } from '../components/CustomUserIcon';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

export const Chat: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, user: currentUser } = useUser();
  
  // Mock chats data to find user if not in context
  const MOCK_CHATS_DATA = [
    { id: '1', name: 'Ali Karimov', avatar: 'https://picsum.photos/seed/user1/100/100' },
    { id: '2', name: 'Malika Ahmedova', avatar: 'https://picsum.photos/seed/user2/100/100' },
    { id: '3', name: 'Diyorbek Usmonov', avatar: 'https://picsum.photos/seed/user3/100/100' },
  ];

  // Find the other user in the chat
  const otherUser = users.find(u => u.id === id) || MOCK_CHATS_DATA.find(u => u.id === id);
  const isSupport = id === 'support';
  const isAdmin = currentUser?.role === 'admin';

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: isSupport 
        ? 'Assalomu alaykum! Qo\'llab-quvvatlash xizmatiga xush kelibsiz. Qanday yordam bera olamiz?' 
        : `Assalomu alaykum! ${otherUser?.name || 'Foydalanuvchi'} bilan bog'langaningizdan xursandmiz.`, 
      sender: 'other', 
      time: '10:30', 
      status: 'read' 
    },
    { 
      id: '2', 
      text: isSupport 
        ? 'Rahmat! E\'lonimni qanday tahrirlashni bilmayapman.' 
        : 'Va alaykum assalom! Albatta, qanday savolingiz bor?', 
      sender: 'me', 
      time: '10:32', 
      status: 'read' 
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate auto-reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: isSupport ? 'Tushunarli. E\'loningizni tahrirlash uchun "Mening e\'lonlarim" bo\'limiga o\'ting.' : 'Tushunarli, o\'ylab ko\'ramiz.',
        sender: 'other',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const chatTitle = isSupport ? 'Qo\'llab-quvvatlash' : (otherUser?.name || 'Foydalanuvchi');
  const chatAvatar = isSupport ? null : otherUser?.avatar;

  return (
    <div className="fixed inset-0 top-14 md:top-16 bg-white z-50 flex flex-col">
      {/* Chat Header */}
      <div className={`p-3 md:p-6 border-b border-black/5 flex items-center justify-between shadow-sm z-10 ${isSupport ? 'bg-[#FFD700]' : 'bg-white'}`}>
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => navigate(-1)} className={`p-1.5 -ml-1 rounded-full transition-colors ${isSupport ? 'text-black hover:bg-black/5' : 'text-gray-500 hover:bg-gray-50'}`}>
            <ChevronLeft size={20} />
          </button>
          <div className="relative">
            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-gray-400 border-2 border-white shadow-sm overflow-hidden ${isSupport ? 'bg-black text-[#FFD700]' : 'bg-white'}`}>
              {isSupport ? (
                <Headset size={16} className="md:w-6 md:h-6" />
              ) : (
                chatAvatar ? (
                  <img src={chatAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <CustomUserIcon size={16} />
                )
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div>
            <h3 className={`font-black tracking-tight text-xs md:text-base ${isSupport ? 'text-black' : 'text-gray-900'}`}>{chatTitle}</h3>
            <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${isSupport ? 'text-black/60' : 'text-emerald-600'}`}>Onlayn</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 md:gap-2">
          <button className={`p-2 md:p-3 rounded-2xl transition-all ${isSupport ? 'text-black hover:bg-black/5' : 'text-gray-400 hover:bg-gray-50'}`}>
            <Phone size={16} className="md:w-5 md:h-5" />
          </button>
          <button className={`p-2 md:p-3 rounded-2xl transition-all ${isSupport ? 'text-black hover:bg-black/5' : 'text-gray-400 hover:bg-gray-50'}`}>
            <MoreVertical size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-8 space-y-3 md:space-y-6 bg-[#F5F7FB] relative overscroll-contain">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative z-10 space-y-4 md:space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] p-3 md:p-5 rounded-[18px] md:rounded-[24px] shadow-sm relative ${
                    msg.sender === 'me'
                      ? 'bg-black text-white rounded-tr-none'
                      : 'bg-white text-gray-900 rounded-tl-none border border-black/5'
                  }`}
                >
                  <p className="text-xs md:text-sm font-bold leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1.5 mt-1.5 md:mt-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest ${msg.sender === 'me' ? 'text-white/40' : 'text-gray-400'}`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && (
                      <div className="text-[#FFD700]">
                        <CheckCheck size={12} className="md:w-3.5 md:h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-6 bg-white border-t border-black/5">
        <div className="flex items-center gap-2 md:gap-4 bg-gray-50 p-1 md:p-2 rounded-full border border-black/5 shadow-inner max-w-4xl mx-auto">
          <div className="flex gap-0.5 md:gap-1 pl-0.5">
            <button className="p-1.5 md:p-3 text-gray-400 hover:text-black transition-colors">
              <Image size={18} className="md:w-[22px] md:h-[22px]" />
            </button>
            <button className="p-1.5 md:p-3 text-gray-400 hover:text-black transition-colors hidden sm:block">
              <MapPin size={18} className="md:w-[22px] md:h-[22px]" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Xabar yozing..."
            className="flex-1 bg-transparent py-1.5 md:py-3 px-1 md:px-2 text-[11px] md:text-sm font-bold focus:outline-none placeholder:text-gray-400"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-[#FFD700] text-black w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-[#FFC700] transition-all shadow-lg shadow-yellow-100 disabled:opacity-50 disabled:shadow-none active:scale-90"
          >
            <Send size={16} className="md:w-[22px] md:h-[22px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
