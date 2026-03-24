import React, { useState } from 'react';
import { MessageSquare, Headset, ChevronRight, Search, MoreVertical, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
}

const MOCK_CHATS: ChatItem[] = [
  { id: '1', name: 'Azizbek Karimov', lastMessage: 'Narxini yana bir oz tushirib bera olasizmi?', time: '10:35', unread: 2, avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: '2', name: 'Malika Ahmedova', lastMessage: 'Ertaga borib ko\'rsak bo\'ladimi?', time: 'Kecha', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: '3', name: 'Sardor Rahimov', lastMessage: 'Tushunarli, rahmat.', time: 'Dushanba', avatar: 'https://picsum.photos/seed/user3/100/100' },
];

export const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 top-20 bg-white z-40 flex flex-col">
      {/* Support Banner - Optional, maybe keep it at the top of the list */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-[400px] flex flex-col bg-white border-r border-black/5">
          <div className="p-6 md:p-8 border-b border-black/5 bg-gray-50/50">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-black/5 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-90"
              >
                <ChevronLeft size={24} className="text-gray-900" />
              </button>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Suhbatlar</h2>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Ism yoki xabar bo'yicha qidirish..."
                className="w-full bg-white border border-black/5 rounded-[24px] py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm md:text-base font-bold placeholder:text-gray-400 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Support Banner inside list */}
          <div className="px-4 py-2">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/chat/support')}
              className="bg-[#FFD700] p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#FFC700] transition-all shadow-lg shadow-yellow-100/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-[#FFD700] shadow-lg shrink-0">
                  <Headset size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black tracking-tight leading-tight">Qo'llab-quvvatlash</h3>
                  <p className="text-black/60 font-bold text-[10px]">Sizga yordam beramiz</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-black group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {MOCK_CHATS.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="p-5 md:p-6 flex gap-5 hover:bg-emerald-50/30 cursor-pointer transition-all border-b border-black/5 last:border-0 group relative"
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition-transform">
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                  </div>
                  {chat.unread && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-xl animate-bounce">
                      {chat.unread}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-black text-gray-900 truncate tracking-tight text-base md:text-lg group-hover:text-emerald-600 transition-colors">{chat.name}</h4>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate font-bold leading-relaxed">{chat.lastMessage}</p>
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content (Empty State) */}
        <div className="hidden md:flex flex-1 bg-[#F5F7FB] items-center justify-center p-12 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="text-center max-w-sm relative z-10">
            <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={40} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Xabarlarni tanlang</h3>
            <p className="text-gray-400 font-bold text-sm leading-relaxed">
              Suhbatni boshlash uchun chap tarafdagi ro'yxatdan foydalanuvchini tanlang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
