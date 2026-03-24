import React, { useState } from 'react';
import { Search, Headset, ChevronRight, User as UserIcon, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface AdminChat {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  isSupport: boolean;
}

const MOCK_ADMIN_CHATS: AdminChat[] = [
  { 
    id: 's1', 
    userId: 'u1', 
    userName: 'Azizbek Karimov', 
    userAvatar: 'https://picsum.photos/seed/user1/100/100',
    lastMessage: 'Assalomu alaykum, e\'lonimni qanday tahrirlasam bo\'ladi?', 
    time: '10:35', 
    unread: 1,
    isSupport: true
  },
  { 
    id: 's2', 
    userId: 'u2', 
    userName: 'Malika Ahmedova', 
    userAvatar: 'https://picsum.photos/seed/user2/100/100',
    lastMessage: 'Rahmat, yordamingiz uchun!', 
    time: 'Kecha', 
    unread: 0,
    isSupport: true
  },
  { 
    id: 'c1', 
    userId: 'u3', 
    userName: 'Sardor Rahimov', 
    userAvatar: 'https://picsum.photos/seed/user3/100/100',
    lastMessage: 'Narxini kelishsak bo\'ladimi?', 
    time: 'Dushanba', 
    unread: 0,
    isSupport: false
  },
];

export const AdminMessages: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useUser();

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Chatlar boshqaruvi</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Foydalanuvchilar bilan muloqot va qo'llab-quvvatlash</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            3 Yangi xabar
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 border-b border-black/5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Foydalanuvchini qidirish..."
                className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none text-sm font-bold"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {MOCK_ADMIN_CHATS.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => navigate(`/admin/chats/${chat.userId}`)}
                className="p-8 flex gap-6 hover:bg-gray-50 cursor-pointer transition-all border-b border-black/5 last:border-0 group"
              >
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-[24px] bg-gray-100 flex items-center justify-center text-gray-900 text-xl font-black shadow-inner overflow-hidden">
                    {chat.userAvatar ? <img src={chat.userAvatar} alt="" className="w-full h-full object-cover" /> : chat.userName[0]}
                  </div>
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      {chat.unread}
                    </div>
                  )}
                  {chat.isSupport && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFD700] text-black rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      <Headset size={12} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-gray-900 truncate tracking-tight group-hover:text-emerald-600 transition-colors">{chat.userName}</h4>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate font-bold">{chat.lastMessage}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {chat.isSupport ? (
                      <span className="px-3 py-0.5 rounded-full bg-yellow-50 text-yellow-600 text-[9px] font-black uppercase tracking-widest">Support</span>
                    ) : (
                      <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest">User Chat</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content (Empty State) */}
        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 flex items-center justify-center p-12 h-[700px]">
          <div className="text-center max-w-sm">
            <div className="relative w-64 h-64 mx-auto mb-12">
              <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-30 animate-pulse" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full h-full flex items-center justify-center"
              >
                <div className="w-48 h-48 bg-gray-900 rounded-[48px] border-8 border-white shadow-2xl flex items-center justify-center text-emerald-400">
                  <MessageSquare size={80} strokeWidth={1.5} />
                </div>
              </motion.div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Suhbatni tanlang</h3>
            <p className="text-gray-400 font-bold leading-relaxed">
              Foydalanuvchilar bilan muloqot qilish uchun chap tarafdagi ro'yxatdan birini tanlang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
